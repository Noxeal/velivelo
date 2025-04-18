```
openapi: 3.0.0
info:
  title: Velivelo API
  version: 1.0.0
  description: API REST pour la gestion de l’application Velivelo (clients, vélos, locations, connexions, etc.)

servers:
  - url: http://localhost:3000
    description: Serveur local de développement

paths:

  /:
    get:
      summary: Message d’accueil
      responses:
        '200':
          description: Bienvenue dans l’application

  /client/:
    get:
      summary: Liste tous les clients
      responses:
        '200':
          description: Liste des clients

    post:
      summary: Crée un nouveau client
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                fname:
                  type: string
                surname:
                  type: string
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Client créé avec succès

  /client/{id}:
    get:
      summary: Récupère un client par ID
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Client trouvé

    put:
      summary: Met à jour un client
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                nom:
                  type: string
                prenom:
                  type: string
                email:
                  type: string
      responses:
        '200':
          description: Client mis à jour

    delete:
      summary: Supprime un client (si pas de location)
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Client supprimé

  /profil_client/:
    post:
      summary: Crée un profil client sans mot de passe
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                prenom:
                  type: string
                nom:
                  type: string
                email:
                  type: string
      responses:
        '200':
          description: Profil client créé

  /compte/{id}:
    put:
      summary: Met à jour les informations de compte (avec vérification de l’ancien mot de passe)
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                nom:
                  type: string
                prenom:
                  type: string
                email:
                  type: string
                mot_de_passe:
                  type: string
                old_password:
                  type: string
      responses:
        '200':
          description: Compte mis à jour

  /se_connecter:
    post:
      summary: Connexion client
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Résultat de la connexion

  /se_connecter_gerant:
    post:
      summary: Connexion gérant
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Résultat de la connexion

  /gerant/:
    get:
      summary: Liste tous les gérants
      responses:
        '200':
          description: Liste des gérants

  /gerant/{id}:
    get:
      summary: Détails d’un gérant
    delete:
      summary: Supprime un gérant

  /velo/:
    get:
      summary: Liste tous les vélos
    post:
      summary: Ajoute un nouveau vélo

  /velo/{id}:
    get:
      summary: Détails d’un vélo
    put:
      summary: Met à jour un vélo

  /velos_disponibles/:
    get:
      summary: Liste tous les vélos disponibles

  /velos_disponibles/date:
    post:
      summary: Vélos disponibles pour une date
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                date:
                  type: string
                  format: date

  /velos_disponibles/double_dates:
    post:
      summary: Vélos disponibles sur un intervalle de dates
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                date_debut:
                  type: string
                  format: date
                date_fin:
                  type: string
                  format: date
```