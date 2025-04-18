# 🚲 VéliVélo - Gestion de Clients

Projet web permettant de gérer les clients d’un service de location de vélos via une interface Vue.js et une API Node.js (Express) connectée à une base de données PostgreSQL.

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
