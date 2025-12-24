package server

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type ServerInfo struct {
	Port                  int    `json:"port"`
	MaxPlayers            int    `json:"maxPlayers"`
	WorldName             string `json:"worldName"`
	WorldSize             string `json:"worldSize"`
	Difficulty            string `json:"difficulty"`
	WorldPath             string `json:"worldPath"`
	Seed                  string `json:"seed"`
	Password              string `json:"password"`
	MOTD                  string `json:"motd"`
	Language              string `json:"language"`
	Secure                bool   `json:"secure"`
	UPnP                  bool   `json:"upnp"`
	Priority              int    `json:"priority"`
	NPCStream             int    `json:"npcstream"`
	WorldRollbacksToKeep  int    `json:"worldRollbacksToKeep"`
}

func ParseConfig(path string) (*ServerInfo, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open config file: %w", err)
	}
	defer file.Close()

	configMap := make(map[string]string)
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])
			configMap[key] = value
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	info := &ServerInfo{}

	if portStr, ok := configMap["port"]; ok {
		if port, err := strconv.Atoi(portStr); err == nil {
			info.Port = port
		}
	}

	if maxPlayersStr, ok := configMap["maxplayers"]; ok {
		if maxPlayers, err := strconv.Atoi(maxPlayersStr); err == nil {
			info.MaxPlayers = maxPlayers
		}
	}

	info.WorldName = configMap["worldname"]
	if info.WorldName == "" {
		if worldPath, ok := configMap["world"]; ok {
			parts := strings.Split(worldPath, "/")
			if len(parts) > 0 {
				fileName := parts[len(parts)-1]
				info.WorldName = strings.TrimSuffix(fileName, ".wld")
			}
		}
	}

	if autocreateStr, ok := configMap["autocreate"]; ok {
		switch autocreateStr {
		case "1":
			info.WorldSize = "small"
		case "2":
			info.WorldSize = "medium"
		case "3":
			info.WorldSize = "large"
		default:
			info.WorldSize = "unknown"
		}
	}

	if difficultyStr, ok := configMap["difficulty"]; ok {
		switch difficultyStr {
		case "0":
			info.Difficulty = "classic"
		case "1":
			info.Difficulty = "expert"
		case "2":
			info.Difficulty = "master"
		case "3":
			info.Difficulty = "journey"
		default:
			info.Difficulty = "unknown"
		}
	}

	info.WorldPath = configMap["world"]
	info.Seed = configMap["seed"]
	info.Password = configMap["password"]
	info.MOTD = configMap["motd"]
	info.Language = configMap["language"]

	// Parse secure (boolean)
	if secureStr, ok := configMap["secure"]; ok {
		info.Secure = secureStr == "1"
	}

	// Parse upnp (boolean)
	if upnpStr, ok := configMap["upnp"]; ok {
		info.UPnP = upnpStr == "1"
	}

	// Parse priority (integer)
	if priorityStr, ok := configMap["priority"]; ok {
		if priority, err := strconv.Atoi(priorityStr); err == nil {
			info.Priority = priority
		}
	}

	// Parse npcstream (integer)
	if npcstreamStr, ok := configMap["npcstream"]; ok {
		if npcstream, err := strconv.Atoi(npcstreamStr); err == nil {
			info.NPCStream = npcstream
		}
	}

	// Parse worldrollbackstokeep (integer)
	if rollbacksStr, ok := configMap["worldrollbackstokeep"]; ok {
		if rollbacks, err := strconv.Atoi(rollbacksStr); err == nil {
			info.WorldRollbacksToKeep = rollbacks
		}
	}

	return info, nil
}

func WriteConfig(path string, info *ServerInfo) error {
	file, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("failed to open config file: %w", err)
	}

	configMap := make(map[string]string)
	var lines []string
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		lines = append(lines, line)

		trimmed := strings.TrimSpace(line)
		if trimmed == "" || strings.HasPrefix(trimmed, "#") {
			continue
		}

		parts := strings.SplitN(trimmed, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			configMap[key] = ""
		}
	}
	file.Close()

	if err := scanner.Err(); err != nil {
		return fmt.Errorf("failed to read config file: %w", err)
	}

	updateMap := make(map[string]string)
	updateMap["port"] = strconv.Itoa(info.Port)
	updateMap["maxplayers"] = strconv.Itoa(info.MaxPlayers)
	updateMap["world"] = info.WorldPath
	updateMap["worldname"] = info.WorldName
	updateMap["seed"] = info.Seed

	switch info.WorldSize {
	case "small":
		updateMap["autocreate"] = "1"
	case "medium":
		updateMap["autocreate"] = "2"
	case "large":
		updateMap["autocreate"] = "3"
	}

	switch info.Difficulty {
	case "classic":
		updateMap["difficulty"] = "0"
	case "expert":
		updateMap["difficulty"] = "1"
	case "master":
		updateMap["difficulty"] = "2"
	case "journey":
		updateMap["difficulty"] = "3"
	}

	updateMap["password"] = info.Password
	updateMap["motd"] = info.MOTD
	updateMap["language"] = info.Language

	// Write new fields
	if info.Secure {
		updateMap["secure"] = "1"
	} else {
		updateMap["secure"] = "0"
	}

	if info.UPnP {
		updateMap["upnp"] = "1"
	} else {
		updateMap["upnp"] = "0"
	}

	updateMap["priority"] = strconv.Itoa(info.Priority)
	updateMap["npcstream"] = strconv.Itoa(info.NPCStream)
	updateMap["worldrollbackstokeep"] = strconv.Itoa(info.WorldRollbacksToKeep)

	var newLines []string
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Handle empty lines
		if trimmed == "" {
			newLines = append(newLines, line)
			continue
		}

		// Handle comment lines - check if it's a commented config
		if strings.HasPrefix(trimmed, "#") {
			// Try to extract key from commented config line
			commentContent := strings.TrimPrefix(trimmed, "#")
			commentContent = strings.TrimSpace(commentContent)
			parts := strings.SplitN(commentContent, "=", 2)

			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				// Check if we have a new value for this commented key
				if newValue, ok := updateMap[key]; ok {
					// Uncomment and write new value
					newLines = append(newLines, key+"="+newValue)
					delete(updateMap, key)
					continue
				}
			}

			// Keep original comment line
			newLines = append(newLines, line)
			continue
		}

		// Handle normal config lines
		parts := strings.SplitN(trimmed, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			if newValue, ok := updateMap[key]; ok {
				newLines = append(newLines, key+"="+newValue)
				delete(updateMap, key)
			} else {
				newLines = append(newLines, line)
			}
		} else {
			newLines = append(newLines, line)
		}
	}

	// Append any remaining keys that weren't in the original file
	for key, value := range updateMap {
		newLines = append(newLines, key+"="+value)
	}

	tmpFile := path + ".tmp"
	outFile, err := os.Create(tmpFile)
	if err != nil {
		return fmt.Errorf("failed to create temp config file: %w", err)
	}
	defer os.Remove(tmpFile)

	writer := bufio.NewWriter(outFile)
	for _, line := range newLines {
		if _, err := writer.WriteString(line + "\n"); err != nil {
			outFile.Close()
			return fmt.Errorf("failed to write config: %w", err)
		}
	}

	if err := writer.Flush(); err != nil {
		outFile.Close()
		return fmt.Errorf("failed to flush config: %w", err)
	}

	if err := outFile.Sync(); err != nil {
		outFile.Close()
		return fmt.Errorf("failed to sync config: %w", err)
	}

	if err := outFile.Close(); err != nil {
		return fmt.Errorf("failed to close temp config: %w", err)
	}

	if err := os.Rename(tmpFile, path); err != nil {
		data, readErr := os.ReadFile(tmpFile)
		if readErr != nil {
			return fmt.Errorf("failed to rename config: %w", err)
		}
		if writeErr := os.WriteFile(path, data, 0644); writeErr != nil {
			return fmt.Errorf("failed to write config fallback: %w", writeErr)
		}
	}

	return nil
}

func ValidateConfig(info *ServerInfo) error {
	if info.Port < 1 || info.Port > 65535 {
		return fmt.Errorf("port must be between 1 and 65535")
	}

	if info.MaxPlayers < 1 || info.MaxPlayers > 255 {
		return fmt.Errorf("maxPlayers must be between 1 and 255")
	}

	validSizes := map[string]bool{"small": true, "medium": true, "large": true}
	if info.WorldSize != "" && !validSizes[info.WorldSize] {
		return fmt.Errorf("worldSize must be one of: small, medium, large")
	}

	validDifficulties := map[string]bool{"classic": true, "expert": true, "master": true, "journey": true}
	if info.Difficulty != "" && !validDifficulties[info.Difficulty] {
		return fmt.Errorf("difficulty must be one of: classic, expert, master, journey")
	}

	if info.Priority < 0 || info.Priority > 5 {
		return fmt.Errorf("priority must be between 0 and 5")
	}

	if info.NPCStream < 0 {
		return fmt.Errorf("npcstream must be non-negative")
	}

	if info.WorldRollbacksToKeep < 0 {
		return fmt.Errorf("worldRollbacksToKeep must be non-negative")
	}

	return nil
}
