import 'dotenv/config'
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;


/*
app.get("/", (req, res) => {
  res.send("Hello from Chandan and his coffee!");
});

app.get("/cold-coffee", (req, res) => {
  res.send("What cold coffee would you prefer?");
});

app.get("/twitter", (req, res) => {
  res.send("chandandotcom");
});
*/


app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
); 


let coffeeData = [];
let nextId = 1;


// add a new coffee
app.post("/coffees", (req, res) => {  
  const { name, price } = req.body;
  const newCoffee = {
    id: nextId++,
    name,
    price,
  };
  coffeeData.push(newCoffee);
  res.status(201).send(newCoffee);
});


// get all coffees
app.get("/coffee", (req, res) => {
  res.status(200).send(coffeeData);
});


// get a coffee with id
app.get("/coffees/:id", (req, res) => {
  const coffee = coffeeData.find((coffee) => coffee.id === parseInt(req.params.id));
  if (!coffee) {
    return res.status(404).send("coffee not found");
  }

  res.status(200).send(coffee);
});


// update coffee
app.put("/coffees/:id", (req, res) => {
  const coffee = coffeeData.find((coffee) => coffee.id === parseInt(req.params.id));
  if (!coffee) {
    return res.status(404).send("coffee not found");
  }

  const { name, price } = req.body;
  coffee.name = name;
  coffee.price = price;

  res.status(200).send(coffee);
});


// delete coffee
app.delete("/coffees/:id", (req, res) => {
  const index = coffeeData.findIndex((coffee) => coffee.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("coffee not found");
  }

  coffeeData.splice(index, 1);
  res.status(204).send("Deleted");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
