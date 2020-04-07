const express = require('express');
const app = express();


/**
 * @swagger
 * /user/:
 *   get:
 *     tags:
 *       - loggedInUser
 *     description: Current Session
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Current Session
 */

 /**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - SignUp
 *     description: Creates a new Documents
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: username
 *         type: file
 *       - name: firstname
 *         in: formData
 *         type: integer
 *       - name: lastname
 *         in: formData
 *         type: string
 *         require: true
 *       - name: ex
 *         in: formData
 *         type: string
 *       - name: phone
 *         in: formData
 *         type: string
 *         enum: [ "Regulation", "Report", "other"]
 *       - name: location
 *         in: formData
 *         type: string
 *       - name: industry
 *         in: formData
 *         type: string
 *       - name: role
 *         in: formData
 *         type: string
 *       - name: company
 *         in: formData
 *         type: string
 *         enum: [ "English", "Hindi", "other"]
 *     responses:
 *       ..:
 *         description: ..
 */

 /**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Login
 *     description: Creates a new Documents
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: username
 *         type: string
 *         require: true
 *       - name: password
 *         in: formData
 *         type: string
 *         require: true
 *     responses:
 *       ..:
 *         description: ..
 */