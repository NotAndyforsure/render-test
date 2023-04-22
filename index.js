const express = require("express");
const cors= require("cors")
const morgan = require("morgan")
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static("build"))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
morgan.token('content', function (req, res) { return JSON.stringify(req.body)})

let data = [
  {
    id: "Arto Hellas",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "Ada Lovelace",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "Dan Abramov",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "Mary Poppendieck",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


const home =  `
    <div>
      <h1>Welcome to to our contacts api</h1>
      <h3>Please Follow interaction guidelines below</h3>
      <ul>
      <li>
      <a href="http://localhost:3001/api/persons" alt="contacts data">Click here</a> to view our contacts data
      </li>
      <li><a href="http://localhost:3001/info" alt="api info">Click here</a> for some api general information</li>
      </ul>
    </div>`


app.get("/", (request, response) => {
  response.send("index.html");
});



app.get("/api/persons", (request, response) => {
  response.status(200).json(data);
});



app.get("/info", (request, response) => {
  const date=new Date().toString()

  const answer=`<div>
  <h3>Phone book has ${data.length} contacts available</h3>
  <span>${date}<span>
  </div>`

  
  response.send(answer);
});




app.get("/api/persons/:id",(request,response)=>{
  personId=request.params.id
  person=data.find(ele=>ele.id==personId)

  if(person){
    response.json(person).status(200)
  }else{
    response.status(404).send({error:"data does not exist"}).end()
  }

  

})



app.delete("/api/persons/:id",(request,response)=>{
  personId=request.params.id
  person=data.find(ele=>ele.id==personId)

  if(person){
    const newData=data.filter(ele=>ele.id != personId)
    data=newData
    response.status(204).end()
  }else{
    response.status(404).json({error:"item does not exist"})
  }

})



app.post("/api/persons",(request,response)=>{
  const item=request.body
  const itemName=item.name
  const itemNum=item.number.length
  personId=item.id
  person=data.find(ele=>ele.id===personId)
  const nameFind=data.find(ele=>ele.name===itemName)
  
if(!nameFind){

  if(!person && itemNum >= 7){
    data.push({id:item.id,name:item.name,number:item.number})
    response.status(200).json(item)
  }else{
    response.status(400).json({error:"Item must contain a name, a number(7 or more digits) and a unique id"})
  }
}else{
  response.status(400).json({error:"We already have this name saved"})
}
 

})





const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server is running on http://localhost:3001/ successfully");
})
