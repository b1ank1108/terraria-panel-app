package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	Web struct {
		Port int `mapstructure:"port"`
	} `mapstructure:"web"`
	Terraria struct {
		BinaryPath string `mapstructure:"binary_path"`
		ConfigPath string `mapstructure:"config_path"`
	} `mapstructure:"terraria"`
}

func Init(cfgFile string, conf *Config) {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
		viper.SetConfigType("yaml")
	} else {
		viper.AddConfigPath(".")
		viper.SetConfigName("config")
		viper.SetConfigType("yaml")
	}

	err := viper.ReadInConfig()
	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("config file not found, try to read from env")
		} else {
			log.Println("config file was found but another error was produced")
		}
	}

	viper.SetDefault("web.port", 8080)
	viper.SetDefault("terraria.binary_path", "./Terraria-1449/Linux/TerrariaServer.bin.x86_64")
	viper.SetDefault("terraria.config_path", "./config.txt")
	err = viper.Unmarshal(conf)
	if err != nil {
		log.Panicln("Unable to decode config into struct", err)
	}
}
