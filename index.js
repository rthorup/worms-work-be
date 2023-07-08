const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const client = require('pg').Pool;
const dbClient = require('./db.js')

const pool = new client(dbClient.dbClient);




const app = express();
app.use(cors());
app.use(bodyParser.json())
const port = 3003;



  


app.get('/', (req, res) => {
  res.send("yoyoyoyoyoy we got an app")
  console.log(req.body)
});

app.post('/add-client', (req, res) => {
  const {first_name, last_name, address, email, phone_number, location_acquired} = req.body;
    const createDB = async () => {
      try {
          const client = await pool.connect();
          const query = {
            text: 'INSERT INTO clients.clients(first_name, last_name, address, phone_number, email, location_acquired) VALUES($1, $2, $3, $4, $5, $6)',
            values: [first_name, last_name, address, email, phone_number, location_acquired]
          }
          const results = await client.query(query)
          await res.send({status: "success"})
          await client.end()
      }
      catch (err) {
          console.log(err)
          res.send({status: "error"})
      }
      finally {
          console.log("you da man")
      }
  }
  createDB()
});

app.post('/add-bucket', (req, res) => {
  const {bucket_name, bucket_owner} = req.body;
  console.log(req.body);
  const createDB = async ()=> {
    try {
      const client = await pool.connect();
      console.log("creating Db");
      const query = {
        text: 'INSERT INTO clients.buckets(bucket_name, bucket_owner) VALUES($1, $2)',
        values: [bucket_name, bucket_owner] 
      }
      const results = await client.query(query)
      console.log(results)
      await res.send({status: "success"})
      await client.end()
    }
    catch(err) {
      console.log(err);
    }
    finally {
      console.log('success')
    }
  }
  createDB();
});

app.post('/transactions', (req, res) => {
  const {client_id, return_bucket, new_bucket, date} = req.body;
  console.log(req.body);
  const createDB = async ()=> {
    try {
      const client = await pool.connect();
      console.log("creating Db");
      const query = {
        text: 'INSERT INTO clients.transactions(client_id, return_bucket, new_bucket, date) VALUES($1, $2, $3, $4)',
        values: [client_id, return_bucket, new_bucket, date] 
      }
      const results = await client.query(query)
      console.log(results);
      res.send(results);
      await client.end();
    }
    catch(err) {
      console.log(err);
    }
    finally {
      console.log('hello')
    }
  }
  createDB();
})

app.get('/generate-user-list', (req, res) => {
  const createDB = async ()=> {
    try {
      const client = await pool.connect();
      console.log("creating Db");
      const client_query = {
        text: 'SELECT client_id, first_name, last_name FROM clients.clients' 
      }
      const clientResults = await client.query(client_query)
      const bucket_query = {
        text: 'SELECT bucket_id, bucket_name FROM clients.buckets'
      }

      const bucketResults = await client.query(bucket_query)
      res.send({clientResults: clientResults.rows, bucketResults: bucketResults.rows});
      await client.end();
    }
    catch(err) {
      console.log(err);
    }
    finally {
      console.log('hello')
    }
  }
  createDB();
})



app.listen(port, () => {
  console.log("yoyoyoyoyyoyoyoyoyoyoyoyoyo")
})