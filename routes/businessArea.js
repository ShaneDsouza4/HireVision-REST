const express = require("express");
const router = express.Router();
const { BusinessArea } = require("../models");
const Joi = require("joi");

// Joi schema for validating BusinessArea
const businessAreaSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

// Create a Business Area
router.post("/", async (req, res) => {
  // Validate the request body
  const { error } = businessAreaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    }); // 400 Bad Request
  }

  try {
    const businessArea = await BusinessArea.create(req.body);
    res.status(201).json({
      message: "Business Area created successfully",
      businessArea,
    }); // 201 Created
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    }); // 500 Internal Server Error
  }
});

// Get all Business Areas
router.get("/", async (req, res) => {
  try {
    const businessAreas = await BusinessArea.findAll();
    res.status(200).json(businessAreas); // 200 OK
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    }); // 500 Internal Server Error
  }
});

// Get a single Business Area by ID
router.get("/:id", async (req, res) => {
  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      }); // 404 Not Found
    }
    res.status(200).json({
      message: "Retrieved Business Area successfully",
      businessArea,
    }); // 200 OK
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    }); // 500 Internal Server Error
  }
});

// Update a Business Area by ID
router.put("/:id", async (req, res) => {
  // Validate the request body
  const { error } = businessAreaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    }); // 400 Bad Request
  }

  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      }); // 404 Not Found
    }
    await businessArea.update(req.body);
    res.status(200).json({
      message: "Business Area updated successfully",
      businessArea,
    }); // 200 OK
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    }); // 500 Internal Server Error
  }
});

// Delete a Business Area by ID
router.delete("/:id", async (req, res) => {
  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      }); // 404 Not Found
    }
    await businessArea.destroy();
    res.status(200).json({
      message: "Business Area deleted successfully",
    }); // 204 No Content
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    }); // 500 Internal Server Error
  }
});

module.exports = router;
