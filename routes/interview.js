const express = require("express");
const router = express.Router();
const { Interview } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

/**
 * @swagger
 * components:
 *   schemas:
 *     Interview:
 *       type: object
 *       properties:
 *         interviewer:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         business_area:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         job:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         date_time:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: integer
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *         interviewee:
 *           type: string
 *           format: uuid
 *           nullable: true
 */

/**
 * @swagger
 * tags:
 *   name: Interviews
 *   description: API to manage interviews
 */

/**
 * @swagger
 * /api/interviews:
 *   post:
 *     summary: Create an Interview
 *     tags: [Interviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interview'
 *     responses:
 *       201:
 *         description: Interview created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res) => {
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

/**
 * @swagger
 * /api/interviews:
 *   get:
 *     summary: Get all Interviews
 *     tags: [Interviews]
 *     responses:
 *       200:
 *         description: Retrieved all Interviews successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interview'
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviews/{id}:
 *   get:
 *     summary: Get a single Interview by ID
 *     tags: [Interviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interview ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Retrieved Interview successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviews/{id}:
 *   put:
 *     summary: Update an Interview by ID
 *     tags: [Interviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interview ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interview'
 *     responses:
 *       200:
 *         description: Interview updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interview'
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", async (req, res) => {
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

/**
 * @swagger
 * /api/interviews/{id}:
 *   delete:
 *     summary: Delete an Interview by ID
 *     tags: [Interviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interview ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Interview deleted successfully
 *       404:
 *         description: Interview not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviews/filteredInterview:
 *   post:
 *     summary: Get filtered interviews
 *     tags: [Interviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *                 format: date-time
 *               to:
 *                 type: string
 *                 format: date-time
 *               interviewer:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *               business_area:
 *                 type: string
 *                 format: uuid
 *               job:
 *                 type: string
 *                 format: uuid
 *               interviewee:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Retrieved filtered interviews successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interview'
 *       500:
 *         description: Internal Server Error
 */
router.post("/filteredInterview", async (req, res) => {
  const { from, to, ...filters } = req.body;

  try {
    const whereConditions = {};

    if (from && to) {
      whereConditions.date_time = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null) {
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
