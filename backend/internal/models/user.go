

package models

import "time"

type User struct {
	ID        string    `json:"id" gorm:"primaryKey"` // Supabase UUID (sub)
	Email     string    `json:"email" gorm:"unique;not null"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}




