<script setup>
import { ref } from 'vue';

const emit = defineEmits(['update:change_current_page','update:handle_client']);

const fname = ref('');
const surname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const onSubmit = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  const clientData = {
    fname: fname.value,
    surname: surname.value,
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch('http://localhost:3000/client/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorMessageFromBackend = await response.text();
      if (errorMessageFromBackend === "Cet email est déjà utilisé.") {
        errorMessage.value = "Cet email est déjà utilisé.";
      } else {
        throw new Error("Erreur lors de la création du client.");
      }
    } else {
      const data = await response.json();
      emit('update:change_current_page', 'ListeVelos');
      emit('update:handle_client', true, data.id_client);
    }

  } catch (error) {
    console.error("Erreur côté client :", error);
    errorMessage.value = "Une erreur est survenue. Veuillez réessayer.";
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="login-container">
      <h1 class="title">S'inscrire</h1>
    
    <div class="input-row">
    <label for="email">Email :</label><br>
    <input type="email" id="email" v-model="email" required><br>
    </div>

    <div class="input-row">
    <label for="fname">First Name :</label><br>
    <input type="text" id="fname" v-model="fname" required><br>
    </div>

    <div class="input-row">
    <label for="surname">Surname :</label><br>
    <input type="text" id="surname" v-model="surname" required><br>
    </div>

    <div class="input-row">
    <label for="password">Mot de passe :</label><br>
    <input type="password" id="password" v-model="password" required><br>
    </div>

    <div class="input-row">
    <label for="confirm_password">Confirmez le mot de passe :</label><br>
    <input type="password" id="confirm_password" v-model="confirmPassword" required><br><br>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>

    <input class="btn-connection" type="submit" value="S'inscrire">
  </div>
  </form>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: 90px auto 70px;
  padding: 30px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 15px;
  font-family: 'Segoe UI', sans-serif;
  color: var(--color-dark-blue);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-row label {
  font-weight: 600;
}

.input-row input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.btn-connection {
  background-color: var(--color-soft-blue);
  color: var(--color-beige);
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 16px;
}

.btn-connection:hover {
  background-color: var(--color-dark-blue);
}

.link {
  text-align: center;
  border-radius: 8px;
  font-size: 14px;
  color: var();
  text-decoration: none;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--color-soft-blue);
  cursor: pointer;
}
</style>