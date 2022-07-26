const dbService = require('../../services/db.service')
const utilService = require('../../services/utilService.js')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')


async function query(filterBy) {
  const criteria = _buildCriteria(filterBy)
  // logger.info(criteria)
  const collection = await dbService.getCollection('stay')
  var stays = await collection.find(criteria).toArray()
  logger.info(stays.length);
  return stays.slice(0,50)
}

async function getById(stayId) {
  const collection = await dbService.getCollection('stay')
  const stay = collection.findOne({ _id: ObjectId(stayId) })
  return stay
}

async function remove(stayId) {
  const collection = await dbService.getCollection('stay')
  await collection.deleteOne({ _id: ObjectId(stayId) })
  return stayId
}

async function add(stay) {
  const collection = await dbService.getCollection('stay')
  const { ops } = await collection.insertOne(stay)
  return ops[0]
}
async function update(stay) {
  var id = ObjectId(stay._id)
  delete stay._id
  const collection = await dbService.getCollection('stay')
  await collection.updateOne({ _id: id }, { $set: { ...stay } })
  stay._id = id
  return stay
}

async function addReview(review, stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    review.id = utilService.makeId()
    review.createdAt = Date.now()
    await collection.updateOne({ _id: ObjectId(stayId) }, { $push: { reviews: review } })
    return review
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function addMsg(stayId, msg) {
  const stay = await getById(stayId)
  stay.msgs = stay.msgs || []
  stay.msgs.push(msg)
  update(stay)
}

function _buildCriteria(filterBy = {where:'',label:'',adults:0,children:0}) {
  const { where, label, adults,children } = filterBy
  const criteria = {}
  // var criteria = {
  //   adress:{street:''},}
  criteria.capacity = { $gte: (+adults + +children) }
  if (where) criteria["address.street"]  = { $regex: where, $options: 'i' }
  // if (status) {
  //   var inStock = status === 'In stock' ? true : false
  //   criteria.inStock = { $eq: inStock }
  // }
  // if (byLabel) criteria.capacity = { $lte: +adults + +children }
  // return criteria
  return criteria
}



module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addReview,
  addMsg
}
