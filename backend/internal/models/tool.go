package models

import (
	"time"
)

type Tool struct {
	ID              string    `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name            string    `json:"name" gorm:"not null"`
	Description     string    `json:"description" gorm:"type:text"`
	Category        string    `json:"category" gorm:"not null"`
	URL             string    `json:"url" gorm:"not null"`
	Github          *string   `json:"github,omitempty"`
	Image           string    `json:"image" gorm:"not null"`
	Pricing         string    `json:"pricing" gorm:"not null"`
	Rating          float64   `json:"rating" gorm:"not null"`
	Featured        bool      `json:"featured" gorm:"default:false"`
	DailyUsers      string    `json:"dailyUsers" gorm:"not null"`
	ModelType       string    `json:"modelType" gorm:"not null"`
	EaseOfUse       float64   `json:"easeOfUse" gorm:"not null"`
	CodeQuality     *float64  `json:"codeQuality,omitempty"`
	UserExperience  float64   `json:"userExperience" gorm:"not null"`
	LastUpdated     time.Time `json:"lastUpdated" gorm:"autoUpdateTime"`
	CreatedAt       time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt       time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}