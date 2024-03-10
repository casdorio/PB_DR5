<script setup>
import TheWelcome from '../components/TheWelcome.vue'

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <div class="greetings">
        <h1>Bem-vindo ao QueueEase</h1>
        <h3>
          Diga adeus às longas esperas e comece a oferecer um 
          atendimento eficiente aos seus clientes.
        </h3>
      </div>
    </div>
  </header>
  <main>
    <TheWelcome />
  </main>
</template>


<style scoped>

h1 {
  color: #a907bb;
  text-align: center!important;;
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  text-align: center;
  margin-top: 2rem;
  font-size: rem;
  padding: 1rem 0;
  margin-top: 1rem;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
  border: 1px solid var(--color-border);

}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: #a907bb;
  text-align: center;
  cursor: pointer;
}
.wrapper {
  text-align: center; /* Centralizar o conteúdo */
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }

}
</style>
