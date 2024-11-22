const express = require("express");
const router = express.Router();
const { Interviewee } = require("../models");
const Joi = require("joi");

/**
 * @swagger
 * components:
 *   schemas:
 *     Interviewee:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         resume:
 *           type: string
 *           nullable: true
 *         comments:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * tags:
 *   name: Interviewees
 *   description: API to manage interviewees
 */

/**
 * @swagger
 * /api/interviewees:
 *   post:
 *     summary: Create a new Interviewee
 *     tags: [Interviewees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interviewee'
 *     responses:
 *       201:
 *         description: Interviewee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewee'
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewees:
 *   get:
 *     summary: Get all Interviewees
 *     tags: [Interviewees]
 *     responses:
 *       200:
 *         description: Retrieved all Interviewees successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interviewee'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const interviewees = await Interviewee.findAll();
    res.status(200).json(interviewees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/interviewees/{id}:
 *   get:
 *     summary: Get an Interviewee by ID
 *     tags: [Interviewees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewee ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Retrieved Interviewee successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewee'
 *       404:
 *         description: Interviewee not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewees/{id}:
 *   put:
 *     summary: Update an Interviewee by ID
 *     tags: [Interviewees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewee ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Interviewee'
 *     responses:
 *       200:
 *         description: Interviewee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Interviewee'
 *       400:
 *         description: Validation Error
 *       404:
 *         description: Interviewee not found
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/interviewees/{id}:
 *   delete:
 *     summary: Delete an Interviewee by ID
 *     tags: [Interviewees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The interviewee ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Interviewee deleted successfully
 *       404:
 *         description: Interviewee not found
 *       500:
 *         description: Internal Server Error
 */
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
