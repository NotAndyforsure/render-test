const express = require("express");
require('dotenv').config()
const cors= require("cors")
const morgan = require("morgan")
const app = express();
const Note=require("./mongo")
app.use(express.json())
app.use(cors())
app.use(express.static("build"))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
morgan.token('content', function (req, res) { return JSON.stringify(req.body)})



app.get("/api/persons", (request, response) => {
  Note.find({}).then(r=> {
    response.status(200).json(r)
  }).catch(e=>next(e))

});



app.get("/info", (request, response) => {
  const date=new Date().toString()
  Note.find({}).then(r=> {

    const answer=`<div>
    <h3>Phone book has ${r.length} contacts available</h3>
    <span>${date}<span>
    </div>`
  
    
    response.send(answer);

  }).catch(e=>next(e))
  

  
});




app.get("/api/persons/:id",(request,response)=>{
  personId=request.params.id
  Note
  .find({id:personId})
  .then(r=>{
    if(r){
      response.json(r).status(200)
    }else{
      response.status(404).end()
    }
  
  } 
  )
  .catch(e=>{ next(e) })
  

})



app.delete("/api/persons/:id",(request,response)=>{

  Note.deleteOne({id:request.params.id})
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
  
  
})


app.post("/api/persons",(request,response)=>{
  const item=request.body

  
  const note = new Note({
    name: item.name,
    number:item.number,
    id:item.name
  })

  note.save().then(savedNote => {
    response.status(200).json(savedNote)
  }).catch(e=>next(e))
  

 

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') { 
    return response.status(400).json({ error: error.message })  
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)





const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} successfully`);
})
