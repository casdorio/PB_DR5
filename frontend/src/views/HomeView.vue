<template>
  <div class="d-flex justify-content-center align-items-stretch vh-100">
    <div class="d-flex justify-content-center" style="width: 90%;">
      <div class="col-md-6 align-self-center p-5">
          <img alt="Vue logo" class="logo" src="@/assets/QueueEase.svg" width="200px" />
          <h1>Bem-vindo ao QueueEase</h1>
          <h3>
            Diga adeus às longas esperas e comece a oferecer um
            atendimento eficiente aos seus clientes.
          </h3>
      </div>
      <div class="col-md-6 align-self-center p-5" v-if="!listCreated">
        <h1>Configure Sua fila</h1>
        <form v-if="!listCreated" @submit.prevent="createList">
          <div class="mt-5">
            Escolha um nome simples e claro para sua fila. Pode ser o nome do seu negócio, como
              “Brinquedos Pollock”, ou o tipo de serviço que oferece, por exemplo, “Registro Residencial”. Esse nome
              ajuda a identificar sua fila facilmente, tornando tudo mais organizado e acessível tanto para você
              quanto para seus clientes.
          </div>
          <div class="form-group mt-5">
            <input type="text" v-model="name" class="form-control col-6" id="name" placeholder="Nome da Fila" required>
          </div>
          <div class="col-12 text-center">
            <button type="submit" class="btn btn-queue btn-block mt-5">Comece Agora</button>
          </div>
        </form>
      </div>
      <div v-else class="col-md-6 align-self-center">
        <h1 class="mb-5">Sua fila {{ listName }} esta pronta</h1>

        <div class="p-5 bg-light border rounded-3">
        <p><strong>Acesso Admin:</strong> <a :href="adminAccessUrl" target="_blank">{{ adminAccessUrl }}</a></p>
        <p><strong>Acesso painel:</strong> <a :href="painelAccessUrl" target="_blank">{{ painelAccessUrl }}</a></p>
        <p><strong>Acesso qrcode:</strong> <a :href="qrcodeAccessUrl" target="_blank">{{ qrcodeAccessUrl }}</a></p>
      </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="loading" style="background-color: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Aguarde enquanto criamos sua fila...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../globals';


export default {
  data() {
    return {
      name: '',
      loading: false,
      listCreated: false,
      listName: '',
      listId: '',
      listHash: ''
    };
  },
  computed: {
    adminAccessUrl() {
      return window.location.origin + '/admin/' + this.listId + '/' + this.listHash;
    },
    qrcodeAccessUrl() {
      return window.location.origin + '/qrcode/' + this.listId;
    },
    painelAccessUrl() {
      return window.location.origin + '/painel/' + this.listId;
    }
  },
  methods: {
    async createList() {
      try {
        this.loading = true;

        const response = await axios.post(`${API_BASE_URL}/queues`, {
          name: this.name
        });

        this.listId = response.data.id_queue;
        this.listHash = response.data.hash_admin;
        this.listName = response.data.name;

        this.name = '';

        this.loading = false;

        this.listCreated = true;

      } catch (error) {
        console.error('Erro ao criar lista:', error);
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
h1 {
  color: #aa3684;
  text-align: center !important;
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.btn-queue {
  background-color: #aa3684;
  font-size: 1.3rem;
  color: white;
  padding: 15px;
}

.btn-queue:hover {
  background-color: #aa368350;
  font-size: 1.3rem;
  color: black;
  border: 1px solid #aa3684;
  padding: 15px;
}

.modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  max-width: 400px;
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.spinner-border {
  margin-top: 20px;
}
</style>
