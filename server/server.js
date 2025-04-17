import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = 3000

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// allow cors
app.use(cors())

// Connexion à la base

const { Client: Db } = pkg;

const db = new Db({user:process.env.db_user, password:process.env.db_password, database:process.env.db_name})
await db.connect();

await db.query("SET search_path TO 'velivelo';")
/*const res = await db.query('SELECT * FROM Client;') 
console.log(res.rows[0]);*/

// Test 

app.get("/", (req, res) => {
	res.json({ message: "Welcome to bezkoder application." });
});


// Clients

app.get('/client/', async (req, res)=>{
	let clients = await db.query('SELECT * FROM Client;') 
	res.send(clients.rows);
});

app.get('/client/:id', async (req, res)=>{
	let clients = await db.query(`SELECT * FROM Client where id = ${req.params.id};`) 
	res.send(clients.rows[0]);
});

app.post('/client/', async (req, res) => {
	const { fname, surname, email, password } = req.body;
	try {
	  const clients = await db.query(
		`INSERT INTO Client (prenom, nom, email, mot_de_passe) VALUES ($1, $2, $3, $4);`,
		[fname, surname, email, password]
	  );
	res.send(clients.rows[0]);
	} catch (err) {
	  console.error(err);
	  res.status(500).send('Erreur lors de la création du client');
	}
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

// Se connecter

app.post('/se_connecter', async (req, res) => {
	let account = req.body;
	console.log(account);
	let row_client = await db.query(`SELECT id from Client where email = '${account.email}' AND mot_de_passe = '${account.password}';`) 
	if(row_client.rows.length == 0){
		console.log("Pas de user");
		res.send({
			success: false,
			message: "Email ou mot de passe incorrect"
		  });
	}
	else{	
		console.log("Id client : ",row_client.rows[0]);
		res.send({
			id_client: row_client.rows[0].id,
			success: true,
			message: "Connexion réussie !",
		});
	}
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

app.get('/velos_disponibles/', async (req, res)=>{
	let velos = await db.query('SELECT * FROM Velos_disponibles;') 
	res.send(velos.rows);
});

app.post('/velos_disponibles/date', async (req, res)=>{
	const { date } = req.body;
	console.log("date : ", date);
	const resultNonDispo = await db.query(
		`SELECT id_velo FROM Location WHERE $1 BETWEEN date_debut AND date_fin_estimee`,
		[new Date(date)]
	);
	console.log("resultNonDispo :",resultNonDispo);

	const idsNonDispo = resultNonDispo.rows.map(row => row.id_velo);

	console.log("idsNonDispo :", idsNonDispo);
	let velos;

	if (idsNonDispo.length > 0) {
		const placeholders = idsNonDispo.map((_, i) => `$${i + 1}`).join(',');
		velos = await db.query(
		`SELECT * FROM Velo WHERE id NOT IN (${placeholders})`,
		[...idsNonDispo]  // ⬅️ PAS de "date" ici !
		);
	} else {
		velos = await db.query(`SELECT * FROM Velos_disponibles`);
	}
	res.send(velos.rows);
});

app.post('/velos_disponibles/double_dates', async (req, res)=>{
	const { date_debut, date_fin } = req.body;
	console.log("Recherche entre :", date_debut, "et", date_fin);

	try {
		// 1. Sélection des vélos indisponibles pendant l'intervalle donné
		const resultNonDispo = await db.query(
			`SELECT id_velo FROM Location 
			WHERE NOT ($2 < date_debut OR $1 > date_fin_estimee)`,
			[date_debut, date_fin]
		);

		const idsNonDispo = resultNonDispo.rows.map(row => row.id_velo);
		console.log("Vélos non dispo :", idsNonDispo);

		let velos;
		if (idsNonDispo.length > 0) {
			const placeholders = idsNonDispo.map((_, i) => `$${i + 1}`).join(',');
			velos = await db.query(
				`SELECT * FROM Velo WHERE id NOT IN (${placeholders})`,
				[...idsNonDispo]
			);
		} else {
			velos = await db.query(`SELECT * FROM Velo`);
		}
		res.send(velos.rows);
	} catch (error) {
		console.error("Erreur dans /velos_disponibles/date :", error);
		res.status(500).send({ error: 'Erreur serveur' });
	}
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

// Ecoute sur le port

app.listen(port, () => { 
	console.log(`Example app listening at http://localhost:${port}`)
});