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
  const createDB = async () => {
    try {
        console.log("waiting to connect");
        const client = await pool.connect();
        console.log("connect");
        const query = {
          text: 'select * from clients.clients c where client_id = 5'
        }
        const results = await client.query(query)
        await res.send({robert: results.rows})
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
     
      const update_bucket = {
        text: `UPDATE clients.buckets SET bucket_owner = 5 WHERE bucket_id = ${return_bucket}`
      }
      const updateSuccess = await client.query(update_bucket);

      const update_return_bucket = {
        text: `UPDATE clients.buckets SET bucket_owner = ${client_id} WHERE bucket_id = ${new_bucket}`
      }
      const returnSuccess = await client.query(update_return_bucket);

      console.log(returnSuccess.text);
      
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
        text: 'SELECT client_id, first_name, last_name FROM clients.clients WHERE client_id != 5' 
      }
      const clientResults = await client.query(client_query)
      
      const available_bucket_query = {
        text: 'SELECT bucket_id, bucket_name FROM clients.buckets WHERE bucket_owner = 5'
      }
      const availableBuckets = await client.query(available_bucket_query)
      
      const out_bucket_query = {
        text: 'SELECT * FROM clients.buckets WHERE bucket_owner != 5'
      }
      const outBuckets = await client.query(out_bucket_query);


      res.send({clientResults: clientResults.rows, availableBuckets: availableBuckets.rows, outBuckets: outBuckets.rows});
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