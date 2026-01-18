// package services

// import (
// 	"errors"
// 	"toolva/internal/models"

// 	"golang.org/x/crypto/bcrypt"
// 	"gorm.io/gorm"
// )

// type UserService struct {
// 	db *gorm.DB
// }

// func NewUserService(db *gorm.DB) *UserService {
// 	return &UserService{db: db}
// }

// func (s *UserService) Register(user *models.User) error {
// 	// Hash password
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		return err
// 	}
// 	user.Password = string(hashedPassword)

// 	// Create user
// 	return s.db.Create(user).Error
// }

// func (s *UserService) Login(email, password string) (*models.User, error) {
// 	var user models.User
// 	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
// 		return nil, errors.New("invalid credentials")
// 	}

// 	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
// 		return nil, errors.New("invalid credentials")
// 	}

// 	return &user, nil
// }

// func (s *UserService) GetUserByID(id uint) (*models.User, error) {
// 	var user models.User
// 	err := s.db.First(&user, id).Error
// 	return &user, err
// }

// func (s *UserService) UpdateUser(user *models.User) error {
// 	return s.db.Save(user).Error
// }

// func (s *UserService) DeleteUser(id uint) error {
// 	return s.db.Delete(&models.User{}, id).Error
// }

// func (s *UserService) AddFavorite(userID, toolID uint) error {
// 	favorite := models.Favorite{
// 		UserID: userID,
// 		ToolID: toolID,
// 	}
// 	return s.db.Create(&favorite).Error
// }

// func (s *UserService) RemoveFavorite(userID, toolID uint) error {
// 	return s.db.Where("user_id = ? AND tool_id = ?", userID, toolID).Delete(&models.Favorite{}).Error
// }

// func (s *UserService) GetFavorites(userID uint) ([]models.Tool, error) {
// 	var favorites []models.Favorite
// 	if err := s.db.Preload("Tool").Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
// 		return nil, err
// 	}

// 	tools := make([]models.Tool, len(favorites))
// 	for i, fav := range favorites {
// 		tools[i] = fav.Tool
// 	}
// 	return tools, nil
// }

// func (s *UserService) AddReview(review *models.Review) error {
// 	return s.db.Create(review).Error
// }

// func (s *UserService) GetToolReviews(toolID uint) ([]models.Review, error) {
// 	var reviews []models.Review
// 	err := s.db.Preload("User").Where("tool_id = ?", toolID).Find(&reviews).Error
// 	return reviews, err
// }





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

// Get user if exists, else create (Supabase user)
func (s *UserService) GetOrCreateUser(userID string, email string) (*models.User, error) {
	var user models.User

	err := s.db.First(&user, "id = ?", userID).Error
	if err == nil {
		return &user, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	user = models.User{
		ID:    userID,
		Email: email,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) UpdateUserName(userID string, name string) error {
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
	favorite := models.Favorite{
		UserID: userID,
		ToolID: toolID,
	}

	return s.db.Create(&favorite).Error
}

func (s *UserService) RemoveFavorite(userID string, toolID string) error {
	return s.db.
		Where("user_id = ? AND tool_id = ?", userID, toolID).
		Delete(&models.Favorite{}).
		Error
}

func (s *UserService) GetFavorites(userID string) ([]models.Tool, error) {
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
	return s.db.Create(review).Error
}

func (s *UserService) GetToolReviews(toolID string) ([]models.Review, error) {
	var reviews []models.Review

	err := s.db.
		Preload("User").
		Where("tool_id = ?", toolID).
		Find(&reviews).Error

	return reviews, err
}
