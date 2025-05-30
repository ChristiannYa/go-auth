package auth

import (
	"encoding/json"
	"go-auth/server/config"
	"go-auth/server/models"
	"go-auth/server/services"
	"net/http"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	tokenService := services.NewTokenService(config.DB)

	// Get refresh token from cookie
	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		// Revoke refresh token if it exists
		tokenService.RevokeRefreshToken(cookie.Value)
	}

	// Clear refresh token cookie
	tokenService.ClearRefreshTokenCookie(w)

	// Success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.AuthResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
