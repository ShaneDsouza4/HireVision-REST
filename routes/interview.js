const express = require("express");
const router = express.Router();
const { Interview } = require("../models");
const Joi = require("joi");

// Joi schema for validating Interview data
const interviewSchema = Joi.object({
  interviewer: Joi.array().items(Joi.string().uuid()).required(),
  business_area: Joi.string().uuid().allow(null),
  job: Joi.string().uuid().allow(null),
  date_time: Joi.date().required(),
  duration: Joi.number().integer().allow(null),
  location: Joi.string().allow(null),
  status: Joi.string().allow(null),
  notes: Joi.string().allow(null),
  interviewee: Joi.string().uuid().allow(null),
});

// Create an Interview
router.post("/", async (req, res) => {
  // Validate the request body
  const { error } = interviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const interview = await Interview.create(req.body);
    res.status(201).json({
      message: "Interview created successfully",
      interview,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

// Get all Interviews
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.findAll();
    res.status(200).json({
      message: "Retrieved all Interviews successfully",
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

// Get a single Interview by ID
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }
    res.status(200).json({
      message: "Retrieved Interview successfully",
      interview,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

// Update an Interview by ID
router.put("/:id", async (req, res) => {
  // Validate the request body
  const { error } = interviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }
    await interview.update(req.body);
    res.status(200).json({
      message: "Interview updated successfully",
      interview,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

// Delete an Interview by ID
router.delete("/:id", async (req, res) => {
  try {
    const interview = await Interview.findByPk(req.params.id);
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }
    await interview.destroy();
    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
