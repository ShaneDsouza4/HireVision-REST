const express = require("express");
const router = express.Router();
const { Job } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

// Joi schema for validating Job
const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, "").max(255), // Optional field
});

// Create a Job
router.post("/", async (req, res) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Jobs by title
router.post("/search", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    try {
      const jobs = await Job.findAll({ limit: 5 });
      return res.status(200).json(jobs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const jobs = await Job.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Job by ID
router.put("/:id", async (req, res) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await job.update(req.body);
    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Job by ID
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
