package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	Name      string    `json:"name" gorm:"not null"`
	Role      string    `json:"role" gorm:"default:'user'"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

type Favorite struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"not null"`
	ToolID    string    `json:"toolId" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	User      User      `json:"-" gorm:"foreignKey:UserID"`
	Tool      Tool      `json:"tool" gorm:"foreignKey:ToolID"`
}

type Review struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"not null"`
	ToolID    string    `json:"toolId" gorm:"type:uuid;not null"`
	Rating    float64   `json:"rating" gorm:"not null"`
	Comment   string    `json:"comment" gorm:"type:text"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	Tool      Tool      `json:"-" gorm:"foreignKey:ToolID"`
}