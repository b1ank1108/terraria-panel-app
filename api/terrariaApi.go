package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"terraria-panel/internal/global"
	"terraria-panel/server"
	"terraria-panel/utils/fileUtils"
)

func getServerConfig(c *gin.Context) {
	config, err := global.TerrariaGame.GetConfig()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "CONFIG_READ_ERROR", "Failed to read server configuration", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"config": config})
}

func editServerConfig(c *gin.Context) {
	var payload struct {
		Config string `json:"config"`
	}
	if err := c.ShouldBind(&payload); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body", err.Error())
		return
	}

	if err := global.TerrariaGame.EditConfig(payload.Config); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "CONFIG_WRITE_ERROR", "Failed to save server configuration", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"message": "Configuration updated successfully"})
}

func startGame(c *gin.Context) {
	if global.TerrariaGame.Status() {
		ErrorResponse(c, http.StatusConflict, "SERVER_ALREADY_RUNNING", "Server is already running", "")
		return
	}

	go func() {
		global.TerrariaGame.Start()
	}()

	c.JSON(http.StatusAccepted, gin.H{
		"status":  "starting",
		"message": "Server start initiated. Use /game/status to check progress.",
	})
}

func stopGame(c *gin.Context) {
	if !global.TerrariaGame.Status() {
		ErrorResponse(c, http.StatusConflict, "SERVER_NOT_RUNNING", "Server is not running", "")
		return
	}
	global.TerrariaGame.Stop()
	SuccessResponse(c, gin.H{"message": "Server stopped successfully"})
}

func sendCmd(c *gin.Context) {
	var payload struct {
		Cmd string `json:"cmd"`
	}
	if err := c.ShouldBind(&payload); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body", err.Error())
		return
	}

	if !global.TerrariaGame.Status() {
		ErrorResponse(c, http.StatusConflict, "SERVER_NOT_RUNNING", "Cannot send command: server is not running", "")
		return
	}

	if err := global.TerrariaGame.Send(payload.Cmd); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "COMMAND_SEND_ERROR", "Failed to send command to server", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"message": "Command sent successfully"})
}

func gameStatus(c *gin.Context) {
	status := global.TerrariaGame.Status()
	info, _ := global.TerrariaGame.GetServerInfo()

	SuccessResponse(c, gin.H{
		"running": status,
		"status":  getStatusText(status),
		"info":    info,
	})
}

func getStatusText(running bool) string {
	if running {
		return "running"
	}
	return "stopped"
}

func gameLogs(c *gin.Context) {
	lineNum := c.DefaultQuery("lineNum", "100")
	value, err := strconv.ParseUint(lineNum, 10, 32)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_PARAMETER", "Invalid lineNum parameter", err.Error())
		return
	}

	logs, err := global.TerrariaGame.Logs(uint(value))
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "LOG_READ_ERROR", "Failed to read server logs", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"logs": logs, "count": len(logs)})
}

func gameBackup(c *gin.Context) {
	backupList, err := global.TerrariaGame.GetBackupList()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "BACKUP_LIST_ERROR", "Failed to retrieve backup list", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"backups": backupList, "count": len(backupList)})
}

func validateBackupPath(backupFilePath string) error {
	worldPath := global.TerrariaGame.GetWorld()
	if worldPath == "" {
		return nil
	}

	worldDir := filepath.Dir(worldPath)
	cleanBackupPath := filepath.Clean(backupFilePath)

	absWorldDir, err := filepath.Abs(worldDir)
	if err != nil {
		return err
	}

	absBackupPath, err := filepath.Abs(cleanBackupPath)
	if err != nil {
		return err
	}

	if !strings.HasPrefix(absBackupPath, absWorldDir) {
		return http.ErrAbortHandler
	}

	return nil
}

func restoreBackup(c *gin.Context) {
	backupFilePath := c.Query("backupFilePath")
	if backupFilePath == "" {
		ErrorResponse(c, http.StatusBadRequest, "MISSING_PARAMETER", "backupFilePath parameter is required", "")
		return
	}

	if err := validateBackupPath(backupFilePath); err != nil {
		ErrorResponse(c, http.StatusForbidden, "INVALID_PATH", "Backup file path is outside allowed directory", backupFilePath)
		return
	}

	if !fileUtils.Exists(backupFilePath) {
		ErrorResponse(c, http.StatusNotFound, "FILE_NOT_FOUND", "Backup file does not exist", backupFilePath)
		return
	}

	if err := global.TerrariaGame.Restore(backupFilePath); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "RESTORE_ERROR", "Failed to restore backup", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"message": "Backup restored successfully"})
}

func deleteBackup(c *gin.Context) {
	backupFilePath := c.Query("backupFilePath")
	if backupFilePath == "" {
		ErrorResponse(c, http.StatusBadRequest, "MISSING_PARAMETER", "backupFilePath parameter is required", "")
		return
	}

	if err := validateBackupPath(backupFilePath); err != nil {
		ErrorResponse(c, http.StatusForbidden, "INVALID_PATH", "Backup file path is outside allowed directory", backupFilePath)
		return
	}

	if !fileUtils.Exists(backupFilePath) {
		ErrorResponse(c, http.StatusNotFound, "FILE_NOT_FOUND", "Backup file does not exist", backupFilePath)
		return
	}

	if err := global.TerrariaGame.DeleteBackup(backupFilePath); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "DELETE_ERROR", "Failed to delete backup", err.Error())
		return
	}
	SuccessResponse(c, gin.H{"message": "Backup deleted successfully"})
}

func getConfigStructured(c *gin.Context) {
	info, err := global.TerrariaGame.GetServerInfo()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "CONFIG_READ_ERROR", "Failed to read server configuration", err.Error())
		return
	}
	SuccessResponse(c, info)
}

func updateConfigStructured(c *gin.Context) {
	var info server.ServerInfo
	if err := c.ShouldBindJSON(&info); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_REQUEST", "Failed to parse request body", err.Error())
		return
	}

	if err := global.TerrariaGame.UpdateServerInfo(&info); err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "CONFIG_WRITE_ERROR", "Failed to save server configuration", err.Error())
		return
	}
	SuccessResponse(c, info)
}
