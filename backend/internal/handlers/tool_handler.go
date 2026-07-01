package handlers

import (
	"net/http"
	"toolva/internal/models"
	"toolva/internal/services"

	"github.com/gin-gonic/gin"
)

type ToolHandler struct {
	toolService *services.ToolService
}

func NewToolHandler(toolService *services.ToolService) *ToolHandler {
	return &ToolHandler{toolService: toolService}
}

func (h *ToolHandler) GetAllTools(c *gin.Context) {
	tools, err := h.toolService.GetAllTools()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetToolByID(c *gin.Context) {
	id := c.Param("id")
	tool, err := h.toolService.GetToolByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tool not found"})
		return
	}
	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) GetToolsByCategory(c *gin.Context) {
	category := c.Param("category")
	tools, err := h.toolService.GetToolsByCategory(category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetFeaturedTools(c *gin.Context) {
	tools, err := h.toolService.GetFeaturedTools()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) SearchTools(c *gin.Context) {
	query := c.Query("q")
	tools, err := h.toolService.SearchTools(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) CreateTool(c *gin.Context) {
	var tool models.Tool
	if err := c.ShouldBindJSON(&tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.toolService.CreateTool(&tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, tool)
}

func (h *ToolHandler) UpdateTool(c *gin.Context) {
	id := c.Param("id")
	var tool models.Tool
	if err := c.ShouldBindJSON(&tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tool.ID = id
	if err := h.toolService.UpdateTool(&tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) DeleteTool(c *gin.Context) {
	id := c.Param("id")
	if err := h.toolService.DeleteTool(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Tool deleted successfully"})
}