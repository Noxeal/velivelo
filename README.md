# 🚲 VéliVélo - La location de vélos trop rigolos

VéliVélo est un projet web permettant de gérer les clients et les vélos d’un service de location de vélos via une interface Vue.js et une API Node.js (Express) connectée à une base de données PostgreSQL.

## 🛠️ Technologies utilisées

### Frontend
- [Vue.js 3](https://vuejs.org/)
- HTML / CSS (Scoped avec `style scoped`)
- Appels API via `fetch`

### Backend
- [Node.js](https://nodejs.org/) avec [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) via `pg`
- `body-parser`, `cors`, `dotenv`

---

## ⚙️ Installation

### Prérequis
- Node.js
- PostgreSQL

### 1. Clone le projet
```bash
git clone https://github.com/Noxeal/velivelo.git
cd velivelo
```

### 2. Configuration de la base de données

Dans PostgreSQL, créer une base et un schéma `velivelo`, puis exécuter le script présent dans /server/, nommé script_base_init.

### 3. Configuration des variables d’environnement

Modifier le fichier `.env` dans le dossier `server/` :
```
db_user=postgres
db_password=motdepasse
db_name=velivelo
```

### 4. Lancer le serveur
```bash
cd server/
npm install
node server.js
```
Le backend tourne sur `http://localhost:3000`.
Ensuite, ouvrir un autre terminal et retourner à la racine du projet pour lancer le frontend.

### 5. Lancer le frontend

```bash
cd app
npm install
npm run dev
```

Le frontend est accessible sur `http://localhost:5173` (ou selon le port affiché).


📌 Principales routes disponibles
Clients

    GET /client/ : Liste des clients

    GET /client/:id : Détails d’un client

    POST /client/ : Création d’un client

    PUT /client/:id : Mise à jour d’un client

    DELETE /client/:id : Suppression d’un client

    POST /se_connecter : Connexion client

    POST /profil_client/ : Création sans mot de passe (connexion simplifiée)

    PUT /compte/:id : Mise à jour d’un compte avec vérification du mot de passe

Gérants

    GET /gerant/ : Liste des gérants

    GET /gerant/:id : Détail d’un gérant

    POST /se_connecter_gerant : Connexion gérant

Vélos

    GET /velo/ : Liste des vélos

    GET /velo/:id : Détail d’un vélo

    POST /velo/ : Création d’un vélo

    PUT /velo/:id : Mise à jour d’un vélo

    GET /velos_disponibles/ : Liste des vélos disponibles

    POST /velos_disponibles/date : Vélos disponibles pour une date donnée

    POST /velos_disponibles/double_dates : Vélos disponibles entre deux dates
