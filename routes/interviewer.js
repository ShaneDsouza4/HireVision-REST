const express = require("express");
const router = express.Router();
const { Interviewer } = require("../models");
const Joi = require("joi");

// Joi schema for validating Interviewer
const interviewerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  designation: Joi.string().max(50).required(),
  business_area_id: Joi.string().uuid().required(), // Assuming business_area_id is a UUID
});

// Create an Interviewer
router.post("/", async (req, res) => {
  const { error } = interviewerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const interviewer = await Interviewer.create(req.body);
    res.status(201).json({
      message: "Interviewer created successfully",
      interviewer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Interviewers
router.get("/", async (req, res) => {
  try {
    const interviewers = await Interviewer.findAll();
    res.status(200).json(interviewers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an Interviewer by ID
router.get("/:id", async (req, res) => {
  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }
    res.status(200).json(interviewer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an Interviewer by ID
router.put("/:id", async (req, res) => {
  const { error } = interviewerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }
    await interviewer.update(req.body);
    res.status(200).json({
      message: "Interviewer updated successfully",
      interviewer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Interviewer by ID
router.delete("/:id", async (req, res) => {
  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }
    await interviewer.destroy();
    res.status(200).json({ message: "Interviewer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
