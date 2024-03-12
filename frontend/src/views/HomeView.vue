<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <div class="row g-4" style="overflow-x: hidden">
      <div class="col-12 col-lg-6 text-center text-lg-start">
        <!-- Primeira coluna para informações de boas-vindas -->
        <img alt="Vue logo" class="logo img-fluid logo-mobile mb-3" src="@/assets/QueueEase.svg" />

        <h1>Bem-vindo ao QueueEase</h1>
        <h3>
          Diga adeus às longas esperas e comece a oferecer um atendimento eficiente aos seus
          clientes.
        </h3>
      </div>

      <div class="col-12 col-lg-6 text-lg-start mt-lg-0 mt-5" v-if="!listCreated">
        <!-- Segunda coluna para o formulário ou mensagem de fila criada -->
        <h1>Configure Sua fila</h1>
        <form @submit.prevent="createList">
          <div class="mt-3 m-2">
            Escolha um nome simples e claro para sua fila. Pode ser o nome do seu negócio, como
            “Brinquedos Pollock”, ou o tipo de serviço que oferece, por exemplo, “Registro
            Residencial”. Esse nome ajuda a identificar sua fila facilmente, tornando tudo mais
            organizado e acessível tanto para você quanto para seus clientes.
          </div>
          <div class="form-group mt-2">
            <input
              type="text"
              v-model="name"
              class="form-control"
              id="name"
              placeholder="Nome da Fila"
              required
            />
          </div>
          <div class="mt-5 text-center">
            <button type="submit" class="btn btn-queue btn-block">Comece Agora</button>
          </div>
        </form>
      </div>

      <div class="col-12 col-lg-6 text-start" v-else>
        <!-- Este bloco é mostrado quando a fila já está criada -->
        <h1 class="mb-2 mt-lg-0 mt-5 text-center">Sua fila está pronta</h1>
        <div class="p-2 p-lg-5 bg-light border rounded-3">
          <h5 class="mb-2">{{ queueName }}</h5>
          <p>
            <strong>Acesso Admin:</strong>
            <a :href="adminAccessUrl" target="_blank">{{ adminAccessUrl }}</a>
          </p>
          <p>
            <strong>Acesso painel:</strong>
            <a :href="painelAccessUrl" target="_blank">{{ painelAccessUrl }}</a>
          </p>
          <p>
            <strong>Acesso qrcode:</strong>
            <a :href="qrcodeAccessUrl" target="_blank">{{ qrcodeAccessUrl }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '../globals'

export default {
  data() {
    return {
      name: '',
      loading: false,
      listCreated: false,
      queueName: '',
      listId: '',
      listHash: ''
    }
  },
  computed: {
    adminAccessUrl() {
      return window.location.origin + '/admin/' + this.listId + '/' + this.listHash
    },
    qrcodeAccessUrl() {
      return window.location.origin + '/qrcode/' + this.listId
    },
    painelAccessUrl() {
      return window.location.origin + '/painel/' + this.listId
    }
  },
  methods: {
    async createList() {
      try {
        this.loading = true

        const response = await axios.post(`${API_BASE_URL}/api/queues`, {
          name: this.name
        })

        this.listId = response.data.id_queue
        this.listHash = response.data.hash_admin
        this.queueName = response.data.queueName

        this.name = ''

        this.loading = false

        this.listCreated = true
      } catch (error) {
        console.error('Erro ao criar lista:', error)
        alert(
          'Erro ao criar lista. Tente novamente mais tarde. verifique se o servidor está rodando.'
        )
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
h1 {
  color: #aa3684;
}
h3 {
  word-wrap: break-word; /* Quebra a palavra se necessário */
  overflow-wrap: break-word; /* Alternativa moderna para word-wrap */
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

.logo-mobile {
  max-width: 200px; /* Tamanho padrão para telas maiores */
}

/* Media query para telas menores (dispositivos móveis) */
@media (max-width: 768px) {
  .logo-mobile {
    max-width: 150px; /* Diminui o tamanho da logo para dispositivos móveis */
  }
}
</style>
