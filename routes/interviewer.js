const express = require("express");
const router = express.Router();
const { Interviewer } = require("../models");
const Joi = require("joi"); // Import Joi

// Define Joi schema for interviewer validation
const interviewerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  designation: Joi.string().max(100).optional(),
  business_area_id: Joi.string().guid().optional(),
});

// Create an interviewer
router.post("/", async (req, res) => {
  // Validate request body
  const { error } = interviewerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // 400 Bad Request
  }

  try {
    const interviewer = await Interviewer.create(req.body);
    res.status(201).json(interviewer); // 201 Created
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

// Get all interviewers
router.get("/", async (req, res) => {
  try {
    const interviewers = await Interviewer.findAll();
    res.status(200).json(interviewers); // 200 OK
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

// Get a single interviewer by ID
router.get("/:id", async (req, res) => {
  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" }); // 404 Not Found
    }
    res.status(200).json(interviewer); // 200 OK
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

// Update an interviewer by ID
router.put("/:id", async (req, res) => {
  // Validate request body
  const { error } = interviewerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // 400 Bad Request
  }

  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" }); // 404 Not Found
    }
    await interviewer.update(req.body);
    res.status(200).json(interviewer); // 200 OK after successful update
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

// Delete an interviewer by ID
router.delete("/:id", async (req, res) => {
  try {
    const interviewer = await Interviewer.findByPk(req.params.id);
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" }); // 404 Not Found
    }
    await interviewer.destroy();
    res.status(204).send(); // 204 No Content after successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

module.exports = router;
