const express = require("express");
const router = express.Router();
const { Tag } = require("../models");
const Joi = require("joi");

// Joi schema for validating Tag
const tagSchema = Joi.object({
  tag_name: Joi.string().min(3).max(50).required(),
});

// Create a Tag
router.post("/", async (req, res) => {
  const { error } = tagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({
      message: "Tag created successfully",
      tag,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Tag by ID
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Tag by ID
router.put("/:id", async (req, res) => {
  const { error } = tagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await tag.update(req.body);
    res.status(200).json({
      message: "Tag updated successfully",
      tag,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Tag by ID
router.delete("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await tag.destroy();
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;