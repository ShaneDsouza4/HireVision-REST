const express = require("express");
const router = express.Router();
const {
  Interview,
  Interviewer,
  Interviewee,
  InterviewTag,
  Tag,
  Job,
  BusinessArea,
} = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

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

    const interviewers = await Interviewer.findAll({
      where: { id: interview.interviewer },
    });
    interview.dataValues.interviewer = interviewers.map(
      (interviewer) => interviewer
    );

    const interviewee = await Interviewee.findByPk(interview.interviewee);
    interview.dataValues.interviewee = interviewee;

    const job = await Job.findByPk(interview.job);
    interview.dataValues.job = job;

    const business_area = await BusinessArea.findByPk(interview.business_area);
    interview.dataValues.business_area = business_area;

    const tagIds = await InterviewTag.findAll({
      where: { interview_id: interview.id },
      attributes: ["tag_id"],
    });

    const tags = await Tag.findAll({
      where: { id: tagIds.map((tag) => tag.tag_id) },
      attributes: ["tag_name"],
    });
    const tagNames = tags.map((tag) => tag.tag_name);

    interview.dataValues.tags = tagNames;

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

// Get filtered interviews based on payload
router.post("/filteredInterview", async (req, res) => {
  const { from, to, ...filters } = req.body;

  try {
    const whereConditions = {};

    // date range filter
    if (from && to) {
      whereConditions.date_time = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    // Additional filters from the payload
    Object.keys(filters).forEach((key) => {
      if (key === "interviewer") {
        whereConditions[key] = {
          [Op.contains]: filters[key],
        };
      } else if (filters[key] !== null) {
        whereConditions[key] = filters[key];
      }
    });

    const interviews = await Interview.findAll({
      where: whereConditions,
    });

    res.status(200).json({
      message: "Retrieved filtered interviews successfully",
      interviews,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
