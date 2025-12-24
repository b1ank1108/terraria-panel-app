package main

import (
	"fmt"
	"log"
	"os"
	"terraria-panel/api"
	"terraria-panel/internal/config"
	"terraria-panel/internal/global"
	"terraria-panel/server"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

var (
	version = "1.1.0"
	cfgFile string
	conf    config.Config
)

func main() {
	config.Init(cfgFile, &conf)

	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set("version", version)
		c.Next()
	})
	api.RegisterRouter(router)

	binPath := conf.Terraria.BinaryPath
	configPath := conf.Terraria.ConfigPath

	if _, err := os.Stat(binPath); os.IsNotExist(err) {
		log.Fatalf("Terraria server binary not found: %s", binPath)
	}
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("Terraria server config not found: %s", configPath)
	}

	global.TerrariaGame = server.NewGame(binPath, configPath)
	log.Printf("Initialized Terraria server with binary: %s, config: %s\n", binPath, configPath)

	log.Println("Starting terraria-panel...")
	log.Println("Version: ", version)
	log.Println("Port:", viper.GetInt("web.port"))

	if err := router.Run(fmt.Sprintf(":%d", viper.GetInt("web.port"))); err != nil {
		log.Panicln("Server exited with error: ", err)
	}
}
