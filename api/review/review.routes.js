const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getReviews, addReview } = require('./review.controller')
const router = express.Router()

router.get('/', getReviews)
router.post('/', addReview)

module.exports = router
