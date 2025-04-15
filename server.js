import express from 'express';

const app = express()
const port = 3000

import pkg from 'pg';
const { Client: Db } = pkg;

const db = new Db({user:'postgres', password:'1234', database:'velivelo'})
await db.connect();

await db.query("SET search_path TO 'velivelo';")
/*const res = await db.query('SELECT * FROM Client;') 
console.log(res.rows[0]);*/

// Clients

app.get('/client/', async (req, res)=>{
	let clients = await db.query('SELECT * FROM Client;') 
	res.send(clients.rows);
});

app.get('/client/:id', async (req, res)=>{
	let clients = await db.query(`SELECT * FROM Client where id = ${req.params.id};`) 
	res.send(clients.rows[0]);
});

app.post('/client/:id', async (req, res)=> {
	res.body;
	let clients = await db.query('INSERT INTO Client Values ;') 
	res.send(clients.rows[0]);
});

app.put('/client/update_nom/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Client SET nom = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/client/update_prenom/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Client SET prenom = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/client/update_email/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Client SET email = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/client/update_mot_de_passe/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Client SET mot_de_passe = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.delete('/client/:id', async (req, res)=> {
	await db.query(`DELETE FROM Client where id = ${req.params.id};`) 
	res.send("ça marche !");
});

// Gérants

app.get('/gerant/', async (req, res)=>{
	let clients = await db.query('SELECT * FROM Gerant;') 
	res.send(clients.rows);
});

app.get('/gerant/:id', async (req, res)=>{
	let clients = await db.query(`SELECT * FROM Gerant where id = ${req.params.id};`) 
	res.send(clients.rows[0]);
});

app.post('/gerant/:id', async (req, res)=> {
	res.body;
	let clients = await db.query('INSERT INTO Gerant Values ;') 
	res.send(clients.rows[0]);
});

app.put('/gerant/update_nom/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Gerant SET nom = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/gerant/update_prenom/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Gerant SET prenom = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/gerant/update_email/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Gerant SET email = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.put('/gerant/update_mot_de_passe/:id', async (req, res)=> {
	let clients = await db.query(`UPDATE Gerant mot_de_passe = ${req.body} where id = ${req.params.id} ;`) 
	res.send(clients.rows[0]);
});

app.delete('/gerant/:id', async (req, res)=> {
	await db.query(`DELETE FROM Gerant where id = ${req.params.id};`) 
	res.send("ça marche !");
});

// Vélos

app.get('/velo/', async (req, res)=>{
	let velos = await db.query('SELECT * FROM Velo;') 
	res.send(velos.rows);
});

app.get('/velo_disponibles/', async (req, res)=>{
	let velos = await db.query('SELECT * FROM Velos_disponibles;') 
	res.send(velos.rows);
});

app.get('/velo/:id', async (req, res)=>{
	let velos = await db.query(`SELECT * FROM Velo where id = ${req.params.id};`) 
	res.send(velos.rows[0]);
});

app.post('/velo/:id', async (req, res)=> {
	req.body;
	let velo = await db.query('INSERT INTO Velo Values ;') 
	await db.query("CREATE VIEW Velos_disponibles as SELECT * from Velo where maintenance = FALSE");
	res.send(velo.rows[0]);
});

app.put('/velo/update_nom/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET nom = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_etat/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET etat = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_maintenance/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET maintenance = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_type/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET type = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_duree_de_vie/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET duree_de_vie = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_cycle_de_vie/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET cycle_de_vie = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_annee_mise_en_service/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET annee_mise_en_service = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.put('/velo/update_prix/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET prix = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);	
});

app.put('/velo/update_photo/:id', async (req, res)=> {
	let velo = await db.query(`UPDATE Velo SET photo = ${req.body} where id = ${req.params.id} ;`) 
	res.send(velo.rows[0]);
});

app.delete('/velo/:id', async (req, res)=> {
	await db.query(`DELETE FROM Velo where id = ${req.params.id};`) 
	res.send("ça marche !");
});

// Locations

app.get('/location/', async (req, res)=>{
	let locations = await db.query('SELECT * FROM Location;') 
	res.send(locations.rows);
});

app.get('/location/:id', async (req, res)=>{
	let location = await db.query(`SELECT * FROM Location where id = ${req.params.id};`) 
	res.send(location.rows[0]);
});

app.put('/location/update_date_debut/:id', async (req, res)=>{
	let location = await db.query(`UPDATE Client SET date_debut = ${req.body} where id = ${req.params.id} ;`) 
	res.send(location.rows[0]);
});

app.put('/location/update_date_fin_estimee/:id', async (req, res)=>{
	let location = await db.query(`UPDATE Client SET date_fin_estimee = ${req.body} where id = ${req.params.id} ;`) 
	res.send(location.rows[0]);
});

app.put('/location/update_date_rendu/:id', async (req, res)=>{
	let location = await db.query(`UPDATE Client SET date_rendu = ${req.body} where id = ${req.params.id} ;`) 
	res.send(location.rows[0]);
});

app.delete('/location/:id', async (req, res)=> {
	await db.query(`DELETE FROM Location where id = ${req.params.id};`) 
	res.send("ça marche !");
});



app.listen(port, () => { 
	console.log(`Example app listening at http://localhost:${port}`)
});