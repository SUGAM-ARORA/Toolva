package handlers

import (
	"net/http"
	"toolva/internal/models"
	"toolva/internal/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

//
// =========================
// USER PROFILE
// =========================
//

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("user_id") // Supabase UUID (string)
	email := c.GetString("email")

	user, err := h.userService.GetOrCreateUser(userID, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("user_id")

	var payload struct {
		Name string `json:"name"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.UpdateUserName(userID, payload.Name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}

//
// =========================
// FAVORITES
// =========================
//

func (h *UserHandler) AddFavorite(c *gin.Context) {
	userID := c.GetString("user_id")
	toolID := c.Param("id")

	if err := h.userService.AddFavorite(userID, toolID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tool added to favorites"})
}

func (h *UserHandler) RemoveFavorite(c *gin.Context) {
	userID := c.GetString("user_id")
	toolID := c.Param("id")

	if err := h.userService.RemoveFavorite(userID, toolID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tool removed from favorites"})
}

func (h *UserHandler) GetFavorites(c *gin.Context) {
	userID := c.GetString("user_id")

	tools, err := h.userService.GetFavorites(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tools)
}

//
// =========================
// REVIEWS
// =========================
//

func (h *UserHandler) AddReview(c *gin.Context) {
	userID := c.GetString("user_id")
	toolID := c.Param("id")

	var review models.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review.UserID = userID
	review.ToolID = toolID

	if err := h.userService.AddReview(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Review added successfully"})
}

func (h *UserHandler) GetToolReviews(c *gin.Context) {
	toolID := c.Param("id")

	reviews, err := h.userService.GetToolReviews(toolID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)
}
