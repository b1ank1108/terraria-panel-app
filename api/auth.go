package api

import (
	"net/http"
	"terraria-panel/internal/config"
	"terraria-panel/internal/middleware"

	"github.com/gin-gonic/gin"
)

// LoginRequest 登录请求结构
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应结构
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// User 用户信息结构
type User struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

var appConfig *config.Config

// SetConfig 设置配置（从 main.go 调用）
func SetConfig(cfg *config.Config) {
	appConfig = cfg
}

// loginHandler 处理用户登录
func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request format", err.Error())
		return
	}

	// 验证用户名和密码
	if req.Username != appConfig.Auth.Username || req.Password != appConfig.Auth.Password {
		ErrorResponse(c, http.StatusUnauthorized, "AUTH_FAILED", "Invalid username or password", "Authentication failed")
		return
	}

	// 生成 JWT Token
	authConfig := middleware.AuthConfig{
		Username:   appConfig.Auth.Username,
		Password:   appConfig.Auth.Password,
		JWTSecret:  appConfig.Auth.JwtSecret,
		TokenHours: appConfig.Auth.TokenHours,
	}

	token, err := middleware.GenerateJWTToken(req.Username, authConfig)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "TOKEN_ERROR", "Failed to generate token", err.Error())
		return
	}

	// 返回登录成功响应
	response := LoginResponse{
		Token: token,
		User: User{
			Username: req.Username,
			Role:     "admin",
		},
	}

	SuccessResponse(c, response)
}