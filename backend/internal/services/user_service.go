package services

import (
	"errors"
	"toolva/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) Register(user *models.User) error {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Create user
	return s.db.Create(user).Error
}

func (s *UserService) Login(email, password string) (*models.User, error) {
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &user, nil
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	err := s.db.First(&user, id).Error
	return &user, err
}

func (s *UserService) UpdateUser(user *models.User) error {
	return s.db.Save(user).Error
}

func (s *UserService) DeleteUser(id uint) error {
	return s.db.Delete(&models.User{}, id).Error
}

func (s *UserService) AddFavorite(userID, toolID uint) error {
	favorite := models.Favorite{
		UserID: userID,
		ToolID: toolID,
	}
	return s.db.Create(&favorite).Error
}

func (s *UserService) RemoveFavorite(userID, toolID uint) error {
	return s.db.Where("user_id = ? AND tool_id = ?", userID, toolID).Delete(&models.Favorite{}).Error
}

func (s *UserService) GetFavorites(userID uint) ([]models.Tool, error) {
	var favorites []models.Favorite
	if err := s.db.Preload("Tool").Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
		return nil, err
	}

	tools := make([]models.Tool, len(favorites))
	for i, fav := range favorites {
		tools[i] = fav.Tool
	}
	return tools, nil
}

func (s *UserService) AddReview(review *models.Review) error {
	return s.db.Create(review).Error
}

func (s *UserService) GetToolReviews(toolID uint) ([]models.Review, error) {
	var reviews []models.Review
	err := s.db.Preload("User").Where("tool_id = ?", toolID).Find(&reviews).Error
	return reviews, err
}
