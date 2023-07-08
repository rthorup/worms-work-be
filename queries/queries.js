const { response } = require('express');

const client = require('pg').Client

const pool = new client({
    user: 'rthorup',
    host: 'dpg-cidjlap5rnuplq5l5tj0-a.oregon-postgres.render.com',
    database: 'worm_works',
    password: 'QzvYTZuZApKrE0QhqAtVxCmSOFvhZSdC',
    port: 5432,
  });


const addNewClient = (request, response) => {
    const firstName = "Robert"
    const lastName = "Hickerson"
    const address = "Not Reality"
    const phone = ""
    const location_acquired = ""
    console.log('asdfasdfsdf')
    pool.query('INSERT INTO clients.clients(first_name, last_name, address, phone_number) VALUES($1, $2, $3, $4, $5)', [firstName, lastName, address, phone],(error, results) => {
        if (error) {
          throw error
        }
        response.send(results)
        response.status(201).send(reults)
    })
}

module.exports = {addNewClient}