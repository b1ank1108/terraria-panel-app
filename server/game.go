package server

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"terraria-panel/utils/fileUtils"
	"time"

	"gopkg.in/natefinch/lumberjack.v2"
)

type ServerState int

const (
	StateStopped ServerState = iota
	StateStarting
	StateRunning
	StateStopping
	StateCrashed
)

type Game struct {
	lock       sync.Mutex
	running    atomic.Bool
	state      ServerState
	send       chan []string
	binPath    string
	configPath string
	stdin      io.WriteCloser
	stdout     io.ReadCloser
	startTime  time.Time
}

type BackupInfo struct {
	CreateTime time.Time `json:"createTime"`
	FileName   string    `json:"fileName"`
	FileSize   int64     `json:"fileSize"`
	Time       int64     `json:"time"`
	Path       string    `json:"path"`
}

const tLogsTxt = "t_log.txt"

func getLogWriter() io.Writer {
	return &lumberjack.Logger{
		Filename:   tLogsTxt,
		MaxSize:    100,
		MaxBackups: 5,
		MaxAge:     7,
		Compress:   true,
	}
}

func NewGame(binPath, configPath string) *Game {
	running := atomic.Bool{}
	running.Store(false)
	game := &Game{
		lock:       sync.Mutex{},
		running:    running,
		state:      StateStopped,
		send:       make(chan []string),
		binPath:    binPath,
		configPath: configPath,
	}
	return game
}

func (receiver *Game) Status() bool {
	return receiver.running.Load()
}

func (receiver *Game) Start() {
	if receiver.running.Load() == true {
		return
	}
	receiver.lock.Lock()
	receiver.state = StateStarting
	receiver.startTime = time.Now()

	logWriter := getLogWriter()

	if err := os.Chmod(receiver.binPath, 0755); err != nil {
		log.Printf("Warning: failed to set executable permission: %v\n", err)
	}

	cmd := exec.Command(receiver.binPath, "-config", receiver.configPath)
	receiver.running.Store(true)
	receiver.lock.Unlock()

	var err error
	receiver.stdin, err = cmd.StdinPipe()
	if err != nil {
		log.Printf("Error getting stdin pipe: %v\n", err)
		receiver.state = StateCrashed
		receiver.running.Store(false)
		return
	}
	receiver.stdout, err = cmd.StdoutPipe()
	if err != nil {
		log.Printf("Error getting stdout pipe: %v\n", err)
		receiver.state = StateCrashed
		receiver.running.Store(false)
		return
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.Printf("Error getting stderr pipe: %v\n", err)
		receiver.state = StateCrashed
		receiver.running.Store(false)
		return
	}

	if err := cmd.Start(); err != nil {
		log.Printf("Error starting command: %v\n", err)
		receiver.state = StateCrashed
		receiver.running.Store(false)
		return
	}

	receiver.state = StateRunning
	log.Println("Terraria server started successfully")

	go func() {
		io.Copy(io.MultiWriter(os.Stdout, logWriter), receiver.stdout)
	}()
	go func() {
		io.Copy(io.MultiWriter(os.Stderr, logWriter), stderr)
	}()

	if err := cmd.Wait(); err != nil {
		log.Printf("Error waiting for command: %v\n", err)
		receiver.state = StateCrashed
		receiver.running.Store(false)
		return
	}
	log.Println("Terraria process exited")
	receiver.state = StateStopped
	receiver.running.Store(false)
}

func (receiver *Game) Stop() {
	receiver.lock.Lock()
	defer receiver.lock.Unlock()

	if receiver.running.Load() == true {
		receiver.state = StateStopping
		err := receiver.Send("exit")
		if err != nil {
			log.Printf("stop game error: %v\n", err)
			receiver.state = StateCrashed
		} else {
			receiver.state = StateStopped
			receiver.running.Store(false)
		}
	}
}

func (receiver *Game) Send(cmd string) error {
	// 向子进程写入命令
	writer := bufio.NewWriter(receiver.stdin)
	input := cmd + "\n"
	_, err := writer.WriteString(input)
	if err != nil {
		log.Printf("Error writing to stdin: %v\n", err)
		return err
	}
	err = writer.Flush()
	if err != nil {
		return err
	}
	return nil
}

func (receiver *Game) Logs(lineNum uint) ([]string, error) {
	return fileUtils.ReverseRead(tLogsTxt, lineNum)
}

func (receiver *Game) GetConfig() (string, error) {
	data, err := os.ReadFile(receiver.configPath)
	if err != nil {
		fmt.Println("File reading error: ", err)
		return "", err
	}
	return string(data), err
}

func (receiver *Game) EditConfig(config string) error {
	tmpFile := receiver.configPath + ".tmp"

	file, err := os.Create(tmpFile)
	if err != nil {
		return fmt.Errorf("failed to create temp config file: %w", err)
	}
	defer os.Remove(tmpFile)

	w := bufio.NewWriter(file)
	if _, err := w.WriteString(config); err != nil {
		file.Close()
		return fmt.Errorf("failed to write config: %w", err)
	}

	if err := w.Flush(); err != nil {
		file.Close()
		return fmt.Errorf("failed to flush config: %w", err)
	}

	if err := file.Sync(); err != nil {
		file.Close()
		return fmt.Errorf("failed to sync config: %w", err)
	}

	if err := file.Close(); err != nil {
		return fmt.Errorf("failed to close temp config: %w", err)
	}

	if err := os.Rename(tmpFile, receiver.configPath); err != nil {
		data, readErr := os.ReadFile(tmpFile)
		if readErr != nil {
			return fmt.Errorf("failed to rename config: %w", err)
		}
		if writeErr := os.WriteFile(receiver.configPath, data, 0644); writeErr != nil {
			return fmt.Errorf("failed to write config fallback: %w", writeErr)
		}
	}

	return nil
}

func (receiver *Game) GetServerInfo() (*ServerInfo, error) {
	return ParseConfig(receiver.configPath)
}

func (receiver *Game) UpdateServerInfo(info *ServerInfo) error {
	if err := ValidateConfig(info); err != nil {
		return err
	}
	return WriteConfig(receiver.configPath, info)
}

func (receiver *Game) GetWorld() string {
	config, err := receiver.GetConfig()
	if err != nil {
		return ""
	}
	config = strings.ReplaceAll(config, "\r", "")
	split := strings.Split(config, "\n")
	for i := range split {
		if strings.Contains(split[i], "world=") {
			lines := strings.Split(split[i], "world=")
			if len(lines) == 2 {
				return strings.TrimSpace(lines[1])
			}
		}
	}
	return ""
}

func (receiver *Game) GetBackupList() ([]BackupInfo, error) {
	var backupList []BackupInfo
	dir := filepath.Dir(receiver.GetWorld())
	if dir == "" || dir == "." {
		return backupList, fmt.Errorf("invalid world directory")
	}
	log.Println("backup path: ", dir)
	fileInfoList, err := os.ReadDir(dir)
	if err != nil {
		return backupList, fmt.Errorf("failed to read backup directory: %w", err)
	}
	for _, entry := range fileInfoList {
		if entry.IsDir() {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			continue
		}
		suffix := filepath.Ext(entry.Name())
		if strings.Contains(suffix, "bak") {
			backup := BackupInfo{
				FileName:   entry.Name(),
				FileSize:   info.Size(),
				CreateTime: info.ModTime(),
				Time:       info.ModTime().Unix(),
				Path:       filepath.Join(dir, entry.Name()),
			}
			backupList = append(backupList, backup)
		}
	}
	return backupList, nil
}

func (receiver *Game) Restore(backupFilePath string) error {
	worldPath := receiver.GetWorld()
	if worldPath == "" {
		return fmt.Errorf("world path is empty")
	}

	tmpBackup := worldPath + ".old"

	if _, err := os.Stat(worldPath); err == nil {
		if err := os.Rename(worldPath, tmpBackup); err != nil {
			return fmt.Errorf("failed to backup current world: %w", err)
		}
	}

	if err := os.Rename(backupFilePath, worldPath); err != nil {
		if _, statErr := os.Stat(tmpBackup); statErr == nil {
			os.Rename(tmpBackup, worldPath)
		}
		return fmt.Errorf("failed to restore backup: %w", err)
	}

	os.Remove(tmpBackup)
	return nil
}

func (receiver *Game) DeleteBackup(backupFilePath string) error {

	err := os.Remove(backupFilePath)
	return err

}
