const dbService = require('../../services/db.service')
const utilService = require('../../services/utilService.js')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')


async function query() {
//   const criteria = _buildCriteria(filterBy)
//   logger.info(criteria)
  const collection = await dbService.getCollection('orders')
  var orders = await collection.find().toArray()
  logger.info(orders.length);
  return orders
}

async function getById(orderId) {
  const collection = await dbService.getCollection('orders')
  const order = collection.findOne({ _id: ObjectId(orderId) })
  return order
}

async function remove(orderId) {
  const collection = await dbService.getCollection('orders')
  await collection.deleteOne({ _id: ObjectId(orderId) })
  return orderId
}

async function add(order) {
  const collection = await dbService.getCollection('orders')
  const { ops } = await collection.insertOne(order)
  return ops[0]
}
async function update(order) {
  var id = ObjectId(order._id)
  delete order._id
  const collection = await dbService.getCollection('orders')
  await collection.updateOne({ _id: id }, { $set: { ...order } })
  order._id = id
  return order
}

async function addMsg(orderId, msg) {
  const order = await getById(orderId)
  order.msgs = order.msgs || []
  order.msgs.push(msg)
  update(order)
}

// function _buildCriteria(filterBy = {where:'',label:'',adults:0,children:0}) {
//   const criteria = {}
//   if(filterBy.where || filterBy.label){
//     const { where, label, adults,children } = filterBy
//     // var criteria = {
//     //   adress:{street:''},}
//     criteria.capacity = { $gte: (+adults + +children) }
//     if (where) criteria["address.street"]  = { $regex: where, $options: 'i' }
//     if(label) criteria.label = { $regex: label, $options: 'i' }
//     // if (status) {
//   }
//   //   var inStock = status === 'In stock' ? true : false
//   //   criteria.inStock = { $eq: inStock }
//   // }
//   // if (byLabel) criteria.capacity = { $lte: +adults + +children }
//   // return criteria
//   return criteria
// }



module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addMsg
}
