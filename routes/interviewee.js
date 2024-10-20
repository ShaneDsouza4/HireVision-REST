const express = require("express");
const router = express.Router();
const { Interviewee } = require("../models");
const Joi = require("joi");

// Joi schema for validating Interviewee
const intervieweeSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  resume: Joi.string().optional(),
  comments: Joi.string().optional(),
});

// Create an Interviewee
router.post("/", async (req, res) => {
  const { error } = intervieweeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const interviewee = await Interviewee.create(req.body);
    res.status(201).json({
      message: "Interviewee created successfully",
      interviewee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Interviewees
router.get("/", async (req, res) => {
  try {
    const interviewees = await Interviewee.findAll();
    res.status(200).json(interviewees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an Interviewee by ID
router.get("/:id", async (req, res) => {
  try {
    const interviewee = await Interviewee.findByPk(req.params.id);
    if (!interviewee) {
      return res.status(404).json({ message: "Interviewee not found" });
    }
    res.status(200).json(interviewee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an Interviewee by ID
router.put("/:id", async (req, res) => {
  const { error } = intervieweeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const interviewee = await Interviewee.findByPk(req.params.id);
    if (!interviewee) {
      return res.status(404).json({ message: "Interviewee not found" });
    }
    await interviewee.update(req.body);
    res.status(200).json({
      message: "Interviewee updated successfully",
      interviewee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Interviewee by ID
router.delete("/:id", async (req, res) => {
  try {
    const interviewee = await Interviewee.findByPk(req.params.id);
    if (!interviewee) {
      return res.status(404).json({ message: "Interviewee not found" });
    }
    await interviewee.destroy();
    res.status(200).json({ message: "Interviewee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
