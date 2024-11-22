const express = require("express");
const router = express.Router();
const { BusinessArea } = require("../models");
const Joi = require("joi");

// Joi schema for validating BusinessArea
const businessAreaSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     BusinessArea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the Business Area
 *         name:
 *           type: string
 *           description: The name of the Business Area
 *           example: Finance
 */

/**
 * @swagger
 * tags:
 *   name: BusinessAreas
 *   description: API endpoints for managing business areas
 */

/**
 * @swagger
 * /api/businessareas:
 *   post:
 *     summary: Create a new Business Area
 *     tags: [BusinessAreas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessArea'
 *     responses:
 *       201:
 *         description: Business Area created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessArea'
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", async (req, res) => {
  const { error } = businessAreaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const businessArea = await BusinessArea.create(req.body);
    res.status(201).json({
      message: "Business Area created successfully",
      businessArea,
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
 * /api/businessareas:
 *   get:
 *     summary: Retrieve all Business Areas
 *     tags: [BusinessAreas]
 *     responses:
 *       200:
 *         description: List of Business Areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BusinessArea'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const businessAreas = await BusinessArea.findAll();
    res.status(200).json({
      message: "Retrieved all Business Areas successfully",
      businessAreas,
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
 * /api/businessareas/{id}:
 *   get:
 *     summary: Retrieve a Business Area by ID
 *     tags: [BusinessAreas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Business Area
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business Area details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessArea'
 *       404:
 *         description: Business Area not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req, res) => {
  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      });
    }
    res.status(200).json({
      message: "Retrieved Business Area successfully",
      businessArea,
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
 * /api/businessareas/{id}:
 *   put:
 *     summary: Update a Business Area by ID
 *     tags: [BusinessAreas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Business Area
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessArea'
 *     responses:
 *       200:
 *         description: Business Area updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessArea'
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Business Area not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", async (req, res) => {
  const { error } = businessAreaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      });
    }
    await businessArea.update(req.body);
    res.status(200).json({
      message: "Business Area updated successfully",
      businessArea,
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
 * /api/businessareas/{id}:
 *   delete:
 *     summary: Delete a Business Area by ID
 *     tags: [BusinessAreas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Business Area
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business Area deleted successfully
 *       404:
 *         description: Business Area not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", async (req, res) => {
  try {
    const businessArea = await BusinessArea.findByPk(req.params.id);
    if (!businessArea) {
      return res.status(404).json({
        message: "Business Area not found",
      });
    }
    await businessArea.destroy();
    res.status(200).json({
      message: "Business Area deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
