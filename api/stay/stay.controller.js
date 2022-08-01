const stayService = require('./stay.service.js')
const logger = require('../../services/logger.service')
// const { broadcast } = require('../../services/socket.service.js')

async function getStays(req, res) {
  try {
    const queryParams = req.query
    const stays = await stayService.query(queryParams)
    res.json(stays)
  } catch (err) {
    res.status(404).send(err)
  }
}

async function getStayById(req, res) {
  try {
    const stayId = req.params.id
    const stay = await stayService.getById(stayId)
    res.json(stay)
  } catch (err) {
    res.status(404).send(err)
  }
}

async function addStay(req, res) {
  const stay = req.body
  console.log('stay',stay);
  try {
    const addedStay = await stayService.add(stay)
    broadcast({ type: 'something-changed', userId: req.session?.user._id })
    res.json(addedStay)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function updateStay(req, res) {
  try {
    const stay = req.body
    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function removeStay(req, res) {
  try {
    const stayId = req.params.id
    const removedId = await stayService.remove(stayId)
    logger.info('deleted',stayId)
    res.send(removedId)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function addReview(req, res) {
  const stayId = req.params.id
  const review = req.body
  try {
    const addedReview = await stayService.addReview(review, stayId)
    res.send(addedReview)
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = {
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
  addReview,
}
