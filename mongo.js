const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting')

mongoose.connect(url)
  .then(result => {    console.log('connected to MongoDB')  })  .catch((error) => { console.log('error connecting to MongoDB:', error.message)  })

const noteSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true,
      minLength:3
    },
    number: {
      type:String,
      required:true,
      minLength:7
    },
    id:{
      type:String,
      required:true,
      minLength:3
    }
  })

  noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })



  module.exports = mongoose.model('Note', noteSchema)


