const express = require('express')
require('dotenv').config()
var bodyParser = require('body-parser')
const cors = require('cors')
var jwt = require('jsonwebtoken');


const { Client } = require('pg')

const send = require('./mail')
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const client = new Client()

client.connect()

const frontEndPoint = process.env.FRONTENDPOINT
const app = express()
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.get('/', async (req, res) => {
    
    //const r = await client.query('SELECT $1::text as message', ['Hello world!'])
    //console.log(res.rows[0].message) // Hello world!
    // const r = await client.query('SELECT $1::text as message', ['drop table name;'])
    // console.log(r.rows[0].message)

    res.send('hey there')
})

const rand = (min, max) => {
    let randomNum = Math.random() * (max - min) + min;
    return Math.round(randomNum);
 }
 
 app.post('/doLogin', async (req, res) => {
     console.log(req.body)
     const email = req.body.email
     const code = req.body.code
     console.log(email, code)
     const result = await client.query('SELECT * FROM sso inner join users on users.id = sso.user_id where sso.code = $1::text and users.email = $2::text', [code, email])
     const resultrows = result.rows.length
     if (resultrows === 1) {
        jwtToken = jwt.sign({userId: result.rows[0].user_id}, process.env.JWT_SECRET)
        return res.send({id: result.rows[0].user_id, token: jwtToken})
     } else {
         console.log(resultrows)
         return res.status(401).send({status: false})
     }

 })

app.post('/login', async (req, res) => {
    const email = req.body.email
    
    try {
        const seeIfEmailExists = await client.query('select * from users where email=$1::text', [email])

        if (seeIfEmailExists.rows.length !== 1) {
            return res.send({status: false, error: 'userDoesNotExist'})
        }
        const userId = seeIfEmailExists.rows[0].id
        const code = rand(1000, 10000)
        const insertCode = await client.query('INSERT INTO SSO (user_id, code) values ($1::uuid, $2::text)', [userId, code])
        send(email, 'SSO Kode', `For å logge inn, skriv inn følgende kode: ${code}`)  
        res.send({code})
    } catch (e) {
        console.log(e)
        return res.status(401).send({status: false})
    }
})

app.post('/users', async (req, res) => {
    try {
        const r = await client.query('INSERT INTO users (email) VALUES ($1::text) RETURNING *', [req.body.email]).catch(err => {  
        })
        const id = r.rows[0].id
        const ssrQ = await client.query('INSERT INTO ssr (user_id) values ($1::uuid) RETURNING *', [id]).catch(err => {
        })
        const token = ssrQ.rows[0].token
        const jwtToken = jwt.sign({userId: id}, process.env.JWT_SECRET)
        const text = `http://${frontEndPoint}/register/${id}/${token}/${jwtToken}`
        
        send(req.body.email, 'Fullfør registrering', `For å fullføre registreringen, følg denne lenken: ${text}`)
        return res.send({status: 'ok'})

    } catch (e) {
        return res.send({status: false})
    }
})



app.post('/register/:id', async (req, res) => {
    const id = req.params.id
    const token = req.query.token
    const name = req.body.name
    const t = await client.query('SELECT token FROM SSR where user_id = $1::uuid AND token = $2::uuid AND generatedat > current_timestamp - interval \'2 days\'', [id, token])
    if (t.rows.length === 1) {
        let promiseOne = client.query('UPDATE users SET name=$1::text WHERE id=$2::uuid', [name, id])
        let promiseTwo = client.query('DELETE FROM SSR WHERE token = $2::uuid AND user_id = $1::uuid', [id, token])
        Promise.all([promiseOne, promiseTwo]).then(r => {
            console.log(r)
        })
    } else {
        console.log(t.rows.length)
        return res.status(401).send({status: false})
    }
})


app.listen(8000)