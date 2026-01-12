package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
	"terraria-panel/internal/middleware"
)

func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		if !strings.HasPrefix(param.Path, "/swagger/") && !strings.HasPrefix(param.Path, "/assets/") {
			statusColor := param.StatusCodeColor()
			methodColor := param.MethodColor()
			resetColor := param.ResetColor()
			return fmt.Sprintf("[GIN] %v |%s %3d %s| %13v | %15s |%s %-7s %s %#v\n%s",
				param.TimeStamp.Format("2006/01/02 - 15:04:05"),
				statusColor, param.StatusCode, resetColor,
				param.Latency,
				param.ClientIP,
				methodColor, param.Method, resetColor,
				param.Path,
				param.ErrorMessage,
			)
		}
		return ""
	})
}

// authMiddleware 返回JWT认证中间件
func authMiddleware() gin.HandlerFunc {
	return middleware.JWTAuthMiddleware(appConfig.Auth.JwtSecret)
}

func RegisterRouter(r *gin.Engine) {

	r.Use(Logger(), gin.Recovery())

	// 登录接口（无需认证）
	r.POST("/api/login", loginHandler)

	// 健康检查接口（无需认证）
	r.GET("/api/game/status", gameStatus)

	// 需要认证的接口组
	authGroup := r.Group("/api")
	authGroup.Use(authMiddleware())
	{
		authGroup.POST("/game/config", editServerConfig)
		authGroup.GET("/game/config", getServerConfig)
		authGroup.GET("/config/structured", getConfigStructured)
		authGroup.PATCH("/config/structured", updateConfigStructured)
		authGroup.GET("/game/start", startGame)
		authGroup.GET("/game/stop", stopGame)
		authGroup.POST("/game/cmd", sendCmd)
		authGroup.GET("/game/log", gameLogs)
		authGroup.GET("/game/backup", gameBackup)
		authGroup.GET("/game/backup/restore", restoreBackup)
		authGroup.DELETE("/game/backup", deleteBackup)
	}

	// API information endpoint
	r.GET("/api", func(c *gin.Context) {
		versionValue, _ := c.Get("version")
		version := "unknown"
		if v, ok := versionValue.(string); ok {
			version = v
		}

		c.JSON(200, gin.H{
			"service": "Terraria Panel API",
			"version": version,
			"status":  "running",
			"endpoints": gin.H{
				"game_config": gin.H{
					"GET":  "/api/game/config - Get server configuration",
					"POST": "/api/game/config - Update server configuration",
				},
				"game_control": gin.H{
					"GET /api/game/start":  "Start Terraria server",
					"GET /api/game/stop":   "Stop Terraria server",
					"GET /api/game/status": "Get server status",
					"POST /api/game/cmd":   "Send command to server",
				},
				"game_logs": gin.H{
					"GET /api/game/log": "Get server logs (query param: lineNum)",
				},
				"game_backup": gin.H{
					"GET /api/game/backup":         "List backup files",
					"GET /api/game/backup/restore": "Restore from backup (query param: backupFilePath)",
					"DELETE /api/game/backup":      "Delete backup (query param: backupFilePath)",
				},
			},
		})
	})

	// Frontend routes
	r.LoadHTMLGlob("dist/index.html")
	r.Static("/static", "./dist/static")
	r.Static("/assets", "./dist/assets")
	r.StaticFile("/favicon.ico", "./dist/favicon.ico")
	r.StaticFile("/terraria", "./dist/terraria")
	r.StaticFile("/", "./dist/index.html")

	// SPA fallback - serve index.html for all non-API routes
	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		// Don't redirect API routes
		if len(path) >= 4 && path[:4] == "/api" {
			c.JSON(404, gin.H{"error": "Not Found"})
			return
		}
		// Serve index.html for SPA routing
		c.File("./dist/index.html")
	})
}
