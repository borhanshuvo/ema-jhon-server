const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzcd4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohn").collection("products");
  const ordersCollection = client.db("emaJohn").collection("orders");
  
  // add product
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      res.send(result.insertedCount);
    })
  });

  // add order
  app.post('/addOrder', (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  });

  // all product list
  app.get('/productList', (req, res) => {
    productsCollection.find({}).limit(20)
    .toArray((err, documents) => {
      res.send(documents);
    })
  });

  //product details
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, document) => {
      res.send(document[0]);
    })
  });

  // get some products
  app.post('/productByKeys', (req, res) => {
    const productKey = req.body;
    productsCollection.find({key: {$in: productKey}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  });

});


app.get('/', (req, res) => {
    res.send('Hello Buddy');
})

app.listen(process.env.PORT || port);