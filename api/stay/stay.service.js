const dbService = require('../../services/db.service')
const utilService = require('../../services/utilService.js')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')


async function query(filterBy={}) {
  const collection = await dbService.getCollection('stay')
  
  if(filterBy) {
    const criteria = _buildCriteria(filterBy)
    logger.info(criteria)
    var stays = await collection.find(criteria).limit(30).toArray()

  }else{
    var stays = await collection.find().limit(30).toArray()
  }
  return stays
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

function _buildCriteria(filterBy = {where:'',label:'',adults:0,children:0,infants:0,pets:0}) {
  const criteria = {}
  // logger.info(filterBy)
  if(filterBy.where || filterBy.label){
    const { where, label, adults,children,infants,pets } = filterBy
    criteria.capacity = { $gte: (+adults + +children + +infants + +pets) }
    if (where) criteria["address.street"]  = { $regex: where, $options: 'i' }
    if(label) criteria.label = { $regex: label, $options: 'i' }

  }

  if(filterBy.minPrice){
    let minPrice = (+filterBy.minPrice + 0)
    let maxPrice = (+filterBy.maxPrice + 0)
    criteria.price = {$gt:minPrice,$lt:maxPrice}

    if(filterBy.beds!=='any') criteria.beds = {$eq:+filterBy.beds}
    // criteria.amenities = { $all: filterBy }
  }
  
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
