package services

import (
	"errors"

	"toolva/internal/models"

	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

//
// =========================
// USER
// =========================
//

// Get user if exists, else create (Supabase-managed user)
func (s *UserService) GetOrCreateUser(userID string, email string) (*models.User, error) {
	// Input validation
	if userID == "" || email == "" {
		return nil, errors.New("userID and email are required")
	}

	var user models.User

	// Try to fetch existing user
	err := s.db.First(&user, "id = ?", userID).Error
	if err == nil {
		return &user, nil
	}

	// If error is not "record not found", return it
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Create new user record (Supabase auth.users already exists)
	user = models.User{
		ID:    userID, // UUID from Supabase
		Email: email,
		Role:  "user",
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) UpdateUserName(userID string, name string) error {
	if userID == "" || name == "" {
		return errors.New("userID and name are required")
	}

	return s.db.Model(&models.User{}).
		Where("id = ?", userID).
		Update("name", name).Error
}

//
// =========================
// FAVORITES
// =========================
//

func (s *UserService) AddFavorite(userID string, toolID string) error {
	if userID == "" || toolID == "" {
		return errors.New("userID and toolID are required")
	}

	favorite := models.Favorite{
		UserID: userID,
		ToolID: toolID,
	}

	return s.db.Create(&favorite).Error
}

func (s *UserService) RemoveFavorite(userID string, toolID string) error {
	if userID == "" || toolID == "" {
		return errors.New("userID and toolID are required")
	}

	return s.db.
		Where("user_id = ? AND tool_id = ?", userID, toolID).
		Delete(&models.Favorite{}).
		Error
}

func (s *UserService) GetFavorites(userID string) ([]models.Tool, error) {
	if userID == "" {
		return nil, errors.New("userID is required")
	}

	var favorites []models.Favorite

	if err := s.db.
		Preload("Tool").
		Where("user_id = ?", userID).
		Find(&favorites).Error; err != nil {
		return nil, err
	}

	tools := make([]models.Tool, 0, len(favorites))
	for _, fav := range favorites {
		tools = append(tools, fav.Tool)
	}

	return tools, nil
}

//
// =========================
// REVIEWS
// =========================
//

func (s *UserService) AddReview(review *models.Review) error {
	if review == nil {
		return errors.New("review is required")
	}
	if review.UserID == "" || review.ToolID == "" {
		return errors.New("userID and toolID are required")
	}

	return s.db.Create(review).Error
}

func (s *UserService) GetToolReviews(toolID string) ([]models.Review, error) {
	if toolID == "" {
		return nil, errors.New("toolID is required")
	}

	var reviews []models.Review

	err := s.db.
		Preload("User").
		Where("tool_id = ?", toolID).
		Find(&reviews).Error

	return reviews, err
}
