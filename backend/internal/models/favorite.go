package models

import "time"

type Favorite struct {
	ID        string    `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    string    `json:"userId" gorm:"type:uuid;not null"`
	ToolID    string    `json:"toolId" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`

	User User `json:"-" gorm:"foreignKey:UserID;references:ID"`
	Tool Tool `json:"tool" gorm:"foreignKey:ToolID;references:ID"`
}
