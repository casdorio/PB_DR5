<template>
  <div class="container d-flex justify-content-center vh-100">
    <div class="w-75 my-auto">
      <div v-if="loading" class="loading">Carregando...</div>
      <div v-else>
        <div class="text-center mb-5 fs-1">{{ queueName }}</div>

        <!-- Container flexível para alinhar imagem e texto -->
        <div class="d-flex flex-row align-items-center w-100 mb-3">
          <!-- Imagem do lado esquerdo -->
          <div class="flex-shrink-0">
            <img
              alt="Vue logo"
              class="logo img-fluid logo-mobile mb-3"
              src="@/assets/QueueEase.svg"
            />
          </div>
          <!-- Texto do lado direito -->
          <div class="flex-grow-1 ms-3 text-end">
            <div>Pessoas na fila: {{ peopleInQueue }}</div>
            <div>Em atendimento: {{ inService }}</div>
            <div>Atendidos: {{ served }}</div>
            <div>Cancelados: {{ cancelled }}</div>
          </div>
        </div>
        <div class="panel my-5">
          {{ nextToBeCalled }}
        </div>
        <div class="actions d-flex flex-column align-items-center">
          <button class="btn btn-primary my-2 custom-primary" :disabled="!isQueueActive" @click="callNext">
            Chamar próximo
          </button>
          <button class="btn btn-secondary my-2" :disabled="!isQueueActive">Retornar</button>
          <button class="btn" :class="isQueueActive ? 'btn-danger' : 'btn-success'" @click="toggleQueue">
            {{ isQueueActive ? 'Desativar fila' : 'Ativar fila' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'
import { API_BASE_URL } from '../globals'

export default {
  data() {
    return {
      loading: true,
      peopleInQueue: 0,
      served: 0,
      cancelled: 0,
      inService: 0,
      queueId: '',
      hash_admin: '',
      nextToBeCalled: 0,
      socket: null,
      queueName: '',
      isQueueActive: null
    }
  },
  mounted() {
    this.queueId = this.$route.params.queueId
    this.hash_admin = this.$route.params.hash_admin
    this.initAdminPage()
    this.setupWebSocket()
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect() // Desconecte o socket ao destruir o componente
    }
  },
  methods: {
    initAdminPage() {
      axios
        .get(`${API_BASE_URL}/api/admin/${this.queueId}/${this.hash_admin}`)
        .then((response) => {
          this.updateQueueData(response.data)
          this.loading = false
        })
        .catch((error) => {
          console.error('Erro ao inicializar a página do admin:', error)
          this.loading = false
        })
    },
    updateQueueData(data) {
      this.peopleInQueue = data.waiting
      this.served = data.served
      this.cancelled = data.cancelled
      this.inService = data.inService
      this.nextToBeCalled = data.nextToBeCalled
      this.queueName = data.queueName,
      this.isQueueActive = data.isQueueActive
    },
    setupWebSocket() {
      this.socket = io(`${API_BASE_URL}`, { transports: ['websocket', 'polling'] })
      this.socket.on('connect', () => {
        console.log('Conectado ao WebSocket')
        this.socket.emit('subscribe', { queueId: this.queueId, clientId: null })
      })

      // this.socket.on(`update-queue-${this.queueId}`, (data) => {
      //   this.initAdminPage()
      //   console.log('Dados atualizados:', data)
      // })

      this.socket.on(`new-client-in-queue-${this.queueId}`, (data) => {
        this.initAdminPage()
        console.log('Dados atualizados:', data)
      })
    },

    callNext() {
      if (this.socket) {
        this.socket.emit('call-next', { queueId: this.queueId })
      }
    },

    returnLast() {
      const queueId = this.$route.params.queueId
      axios
        .get(`${API_BASE_URL}/api/return/${queueId}`)
        .then((response) => {
          console.log('Último retorno:', response.data)
        })
        .catch((error) => {
          console.error('Erro ao retornar o último:', error)
        })
    },

    toggleQueue() {
      if (this.socket) {
        this.socket.emit('toggle-queue', { queueId: this.queueId, status: !this.isQueueActive })
        this.isQueueActive = !this.isQueueActive;
      }
    },
  }
}
</script>

<style scoped>
.panel {
  font-size: 8rem;
  /* Ajuste conforme necessário */
  font-weight: bold;
  text-align: center;
}

.custom-primary {
  background-color: #aa3684;
  /* Exemplo de cor roxa */
  border-color: #aa3684;
  /* Cor mais escura para a borda */
}
.custom-primary:hover {
  background-color: #aa368350;
  color: black;
  border: 1px solid #aa3684;
}

/* Para garantir que os botões estejam um abaixo do outro com espaçamento */
.actions button {
  width: 100%;
  margin-top: 10px;
  /* Espaçamento entre os botões */
}

.logo-mobile {
  max-width: 100px;
  /* Tamanho padrão para telas maiores */
}

/* Media query para telas menores (dispositivos móveis) */
@media (max-width: 768px) {
  .logo-mobile {
    max-width: 80px;
    /* Diminui o tamanho da logo para dispositivos móveis */
  }
}
</style>
