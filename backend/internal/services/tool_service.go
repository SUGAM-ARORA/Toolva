package services

import (
	"toolva/internal/models"

	"gorm.io/gorm"
)

type ToolService struct {
	db *gorm.DB
}

func NewToolService(db *gorm.DB) *ToolService {
	return &ToolService{db: db}
}

func (s *ToolService) GetAllTools() ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Find(&tools).Error
	return tools, err
}

func (s *ToolService) GetToolByID(id uint) (*models.Tool, error) {
	var tool models.Tool
	err := s.db.First(&tool, id).Error
	return &tool, err
}

func (s *ToolService) GetToolsByCategory(category string) ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("category = ?", category).Find(&tools).Error
	return tools, err
}

func (s *ToolService) GetFeaturedTools() ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("featured = ?", true).Find(&tools).Error
	return tools, err
}

func (s *ToolService) SearchTools(query string) ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("name ILIKE ? OR description ILIKE ?", "%"+query+"%", "%"+query+"%").Find(&tools).Error
	return tools, err
}

func (s *ToolService) CreateTool(tool *models.Tool) error {
	return s.db.Create(tool).Error
}

func (s *ToolService) UpdateTool(tool *models.Tool) error {
	return s.db.Save(tool).Error
}

func (s *ToolService) DeleteTool(id uint) error {
	return s.db.Delete(&models.Tool{}, id).Error
}
