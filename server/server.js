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
		const clients = await db.query(`INSERT INTO Client (prenom, nom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING id;`,[fname, surname, email, password]);
		res.send(clients.rows[0]);
		  
	} catch (err) {
		console.log(err.code);
		if (err.code === '23505') {
			res.status(400).send('Cet email est déjà utilisé.');
		  } else {
			res.status(500).send('Erreur lors de la création du client');
		  }
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

app.get('/location_list/', async (req, res)=>{
	let locations = await db.query('SELECT Location.id as id_location, Velo.id as id_velo, Velo.nom as nom_velo, Client.id as id_client, Client.nom, Client.prenom, Velo.Etat, date_debut, date_fin_estimee FROM Location JOIN Client ON Location.id_client = Client.id JOIN Velo ON Location.id_velo = Velo.id;');
	res.send(locations.rows);
})

app.get('/location/:id', async (req, res)=>{
	let location = await db.query(`SELECT * FROM Location where id = ${req.params.id};`) 
	res.send(location.rows[0]);
});

app.put('/location/:id', async (req, res) => {
	const id = req.params.id;
	const { date_debut, date_fin_estimee } = req.body;
  
	if (!date_debut || !date_fin_estimee) {
	  return res.status(400).send({ message: 'Champs date_debut et date_fin_estimee requis.' });
	}
  
	try {
	  const result = await db.query(
		`UPDATE Location SET date_debut = $1, date_fin_estimee = $2 WHERE id = $3 RETURNING *;`,
		[date_debut, date_fin_estimee, id]
	  );
  
	  if (result.rowCount === 0) {
		return res.status(404).send({ message: 'Location non trouvée.' });
	  }
  
	  res.status(200).send({ message: 'Location mise à jour avec succès.', location: result.rows[0] });
	} catch (error) {
	  console.error('Erreur mise à jour location :', error);
	  res.status(500).send({ message: 'Erreur serveur.' });
	}
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