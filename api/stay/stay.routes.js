const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getStays, getStayById, addStay, updateStay, removeStay, addReview } = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStays)
router.get('/:id', getStayById)
router.post('/', addStay)
router.put('/:id', updateStay)
router.delete('/:id', removeStay)
// router.post('/', requireAuth, requireAdmin, addStay)//,
// router.put('/:id', requireAuth, requireAdmin, updateStay)
// router.put('/:id', requireAuth, updateStay)
// router.delete('/:id', removeStay)//requireAuth, requireAdmin,
// router.post('/:id/review', addReview)

module.exports = router
