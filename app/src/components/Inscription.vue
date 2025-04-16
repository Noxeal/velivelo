<script setup>

const onSubmit = async () => {
  
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

  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="email">Email :</label><br>
    <input type="email" id="email" v-model="email" required><br>

    <label for="surname">Surname :</label><br>
    <input type="surname" id="surname" v-model="surname" required><br>

    <label for="fname">First Name :</label><br>
    <input type="fname" id="fname" v-model="fname" required><br>

    <label for="password">Mot de passe :</label><br>
    <input type="password" id="password" v-model="password" required><br>

    <label for="confirm_password">Confirmez le mot de passe :</label><br>
    <input type="password" id="confirm_password" v-model="confirmPassword" required><br><br>

    <input type="submit" value="S'inscrire">
  </form>
</template>

<style scoped>
nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
}
button {
  padding: 2rem 4rem;
}

.active{
    background-color: red;
}
</style>
