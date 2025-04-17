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
await db.query("SELECT setval('Location_id_seq', COALESCE((SELECT MAX(id) FROM Location), 1), false);")
await db.query("SELECT setval('Location_id_seq', COALESCE((SELECT MAX(id) FROM Client), 1), false);")


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

// Mise à jour d’un client (nom, prénom et email)
app.put('/client/:id', async (req, res) => {
	const id = req.params.id;
	const { nom, prenom, email } = req.body;

	// console.log('Mise à jour du client avec ID:', id);
	// console.log('Nouveau nom:', nom);
	// console.log('Nouveau prénom:', prenom);
	// console.log('Nouvel email:', email);

  
	// Vérification minimale
	if (!nom || !prenom || !email) {
	  return res
		.status(400)
		.send({ message: 'Les champs nom, prénom et email sont requis.' });
	}
  
	try {
	  const result = await db.query(
		`UPDATE Client
		   SET nom    = $1,
			   prenom = $2,
			   email  = $3
		 WHERE id = $4
	  RETURNING *;`,
		[nom, prenom, email, id]
	  );
  
	  if (result.rowCount === 0) {
		return res.status(404).send({ message: 'Client non trouvé.' });
	  }
  
	  res
		.status(200)
		.send({ message: 'Client mis à jour avec succès.', client: result.rows[0] });
	} catch (err) {
	  console.error('Erreur mise à jour client :', err);
	  res.status(500).send({ message: 'Erreur serveur lors de la mise à jour.' });
	}
  });
  
// Suppression d’un client
app.delete('/client/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const result = await db.query(
		`DELETE FROM Client
				WHERE id = $1
			RETURNING *;`,
		[id]
		);

		if (result.rowCount === 0) {
		return res.status(404).send({ message: 'Client non trouvé.' });
		}

		res.status(200).send({ message: 'Client supprimé avec succès.' });
	} catch (err) {
		console.error('Erreur suppression client :', err);
		res.status(500).send({ message: 'Erreur serveur lors de la suppression.' });
	}
});


app.post('/client/', async (req, res) => {
	const { fname, surname, email, password } = req.body;
	try {
		const clients = await db.query(`INSERT INTO Client (prenom, nom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING id;`,[fname, surname, email, password]);
		res.send({
			id_client: clients.rows[0].id,
			success: true,
			message: "Connexion réussie !",
		});
		  
	} catch (err) {
		console.log(err.code);
		if (err.code === '23505') {
			res.status(400).send('Cet email est déjà utilisé.');
		  } else {
			res.status(500).send('Erreur lors de la création du client');
		  }
		}
	
});

app.put('/compte/:id', async (req, res) => {
	const { nom, prenom, email, mot_de_passe, old_password } = req.body;
	const id = req.params.id;
	console.log(old_password);
  
	try {
	  const user = await db.query('SELECT * FROM Client WHERE id = $1', [id]);
  
	  if (user.rows.length === 0) {
		return res.status(404).send("Client non trouvé");
	  }

	  console.log(user.rows[0]);
  
	  const current = user.rows[0];
	  const updates = [];
	  const values = [];
	  let paramIndex = 1;
  
	  if (mot_de_passe) {
		console.log(old_password);
  
		if (old_password !== user.rows[0].mot_de_passe) {
		  return res.status(403).send("Ancien mot de passe incorrect");
		}
  
		updates.push(`mot_de_passe = $${paramIndex++}`);
		values.push(mot_de_passe);
	  }
  
	  if (email) {
		updates.push(`email = $${paramIndex++}`);
		values.push(email);
	  }
	  if (prenom) {
		updates.push(`prenom = $${paramIndex++}`);
		values.push(prenom);
	  }
	  if (nom) {
		updates.push(`nom = $${paramIndex++}`);
		values.push(nom);
	  }
  
	  if (updates.length === 0) {
		return res.status(400).send("Rien à mettre à jour");
	  }
  
	  values.push(id);
  
	  const query = `
		UPDATE Client
		SET ${updates.join(', ')}
		WHERE id = $${paramIndex}
		RETURNING *;
	  `;
  
	  const updated = await db.query(query, values);
	  res.send(updated.rows[0]);
  
	} catch (err) {
	  console.error("Erreur lors de la mise à jour :", err);
	  res.status(500).send("Erreur serveur");
	}
  });
  

app.delete('/client/:id', async (req, res)=> {
	await db.query(`DELETE FROM Client where id = ${req.params.id};`) 
	res.send("ça marche !");
});

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
		`SELECT * FROM Velos_disponibles WHERE id NOT IN (${placeholders})`,
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
				`SELECT * FROM Velos_disponibles WHERE id NOT IN (${placeholders})`,
				[...idsNonDispo]
			);
		} else {
			velos = await db.query(`SELECT * FROM Velos_disponibles`);
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

app.get('/location_list/', async (req, res)=>{
	let locations = await db.query('SELECT Location.id as id_location, Velo.id as id_velo, Velo.nom as nom_velo, Client.id as id_client, Client.nom, Client.prenom, Velo.Etat, date_debut, date_fin_estimee FROM Location JOIN Client ON Location.id_client = Client.id JOIN Velo ON Location.id_velo = Velo.id;');
	res.send(locations.rows);
})

app.get('/location/:id', async (req, res)=>{
	let location = await db.query(`SELECT * FROM Location where id = ${req.params.id};`) 
	res.send(location.rows[0]);
});

app.post('/location', async (req, res) => {
	const { date_debut, date_fin, id_velo, id_client } = req.body;
	console.log("date debut :", date_debut);
	console.log("date fin :", date_fin);
	console.log("id velo :", id_velo);
	console.log("id client :", id_client);
	try {
	  const result = await db.query(
		`INSERT INTO Location (date_debut, date_fin_estimee, paiement_actuel, id_velo, id_client, etat)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id;`,
		[date_debut, date_fin, 0.0, id_velo, id_client, "En Cours"]
	  );
  
	  res.send({
		id_location: result.rows[0].id,
		success: true,
		message: "Location enregistrée avec succès !",
	  });
	} catch (err) {
	  console.error(err);
	  if (err.code === '23505') {
		res.status(400).send('Doublon détecté.');
	  } else {
		res.status(500).send('Erreur lors de la création de la location');
	  }
	}
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