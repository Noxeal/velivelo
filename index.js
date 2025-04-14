import express from 'express';

const app = express()
const port = 3000

import pkg from 'pg';
const { Client } = pkg;

const client = new Client({user:'postgres', password:'1234', database:'velivelo'})
await client.connect();

await client.query("SET search_path TO 'velivelo';")
/*const res = await client.query('SELECT * FROM Client;') 
console.log(res.rows[0]);*/

app.get('/velo/', async (req, res)=>{
	let velos = await client.query('SELECT * FROM Velo;') 
	res.send(velos.rows);
});

app.get('/client/', async (req, res)=>{
	let velos = await client.query('SELECT * FROM Client;') 
	res.send(velos.rows);
});