const express = require("express");
const router = express.Router();
const { Interviewer } = require("../models");
const Joi = require("joi");

/**
 * @swagger
 * components:
 *   schemas:
 *     Interviewer:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         designation:
 *           type: string
 *           maxLength: 50
 *         business_area_id:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * tags:
 *   name: Interviewers
 *   description: API to manage interviewers
 */

/**
 * @swagger
 * /api/interviewers:
 *   post:
 *     summary: Create a new Interviewer
 *     tags: [Interviewers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interviewer'
 *     responses:
 *       201:
 *         description: Interviewer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewer'
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewers:
 *   get:
 *     summary: Get all Interviewers
 *     tags: [Interviewers]
 *     responses:
 *       200:
 *         description: Retrieved all Interviewers successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interviewer'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const interviewers = await Interviewer.findAll();
    res.status(200).json(interviewers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/interviewers/{id}:
 *   get:
 *     summary: Get an Interviewer by ID
 *     tags: [Interviewers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewer ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Retrieved Interviewer successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewer'
 *       404:
 *         description: Interviewer not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewers/{id}:
 *   put:
 *     summary: Update an Interviewer by ID
 *     tags: [Interviewers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewer ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interviewer'
 *     responses:
 *       200:
 *         description: Interviewer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewer'
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Interviewer not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewers/{id}:
 *   delete:
 *     summary: Delete an Interviewer by ID
 *     tags: [Interviewers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewer ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Interviewer deleted successfully
 *       404:
 *         description: Interviewer not found
 *       500:
 *         description: Internal Server Error
 */
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
