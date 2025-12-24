package api

import (
	"time"

	"github.com/gin-gonic/gin"
)

type ApiResponse struct {
	Status string      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
	Error  *ErrorInfo  `json:"error,omitempty"`
	Meta   Meta        `json:"meta"`
}

type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

type Meta struct {
	Timestamp string `json:"timestamp"`
	Version   string `json:"version"`
}

func SuccessResponse(c *gin.Context, data interface{}) {
	versionValue, exists := c.Get("version")
	versionStr := "unknown"
	if exists {
		if v, ok := versionValue.(string); ok {
			versionStr = v
		}
	}

	c.JSON(200, ApiResponse{
		Status: "success",
		Data:   data,
		Meta: Meta{
			Timestamp: time.Now().Format(time.RFC3339),
			Version:   versionStr,
		},
	})
}

func ErrorResponse(c *gin.Context, statusCode int, code string, message string, details string) {
	versionValue, exists := c.Get("version")
	versionStr := "unknown"
	if exists {
		if v, ok := versionValue.(string); ok {
			versionStr = v
		}
	}

	c.JSON(statusCode, ApiResponse{
		Status: "error",
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
			Details: details,
		},
		Meta: Meta{
			Timestamp: time.Now().Format(time.RFC3339),
			Version:   versionStr,
		},
	})
}
