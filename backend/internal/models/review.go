package models

import "time"

type Review struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    string    `json:"userId" gorm:"not null"`
	ToolID    string    `json:"toolId" gorm:"type:uuid;not null"`
	Rating    float64   `json:"rating" gorm:"not null"`
	Comment   string    `json:"comment" gorm:"type:text"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`

	User User `json:"user" gorm:"foreignKey:UserID;references:ID"`
	Tool Tool `json:"-" gorm:"foreignKey:ToolID;references:ID"`
}
