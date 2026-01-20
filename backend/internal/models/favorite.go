package models

import "time"

type Favorite struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    string    `json:"userId" gorm:"not null"`
	ToolID    string    `json:"toolId" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`

	User User `json:"-" gorm:"foreignKey:UserID;references:ID"`
	Tool Tool `json:"tool" gorm:"foreignKey:ToolID;references:ID"`
}
