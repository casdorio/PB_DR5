<template>
  <div class="painel">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else>
      <h1>{{ queueName }}</h1>
      <h2 class="number">{{ currentUserNumber }}</h2>
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
      queueName: '',
      currentUserNumber: 0,
      loading: true,
      queueId: ''
    }
  },
  mounted() {
    this.queueId = this.$route.params.id
    this.fetchQueueData()
    this.setupWebSocket()
  },
  methods: {
    fetchQueueData() {
      this.loading = true

      axios
        .get(`${API_BASE_URL}/api/panel/${this.queueId}`)
        .then((response) => {
          this.queueName = response.data.queueName
          this.currentUserNumber = response.data.nextToBeCalled
          this.loading = false
        })
        .catch((error) => {
          console.error('Erro ao buscar os dados da fila:', error)
          this.loading = false
        })
    },
    setupWebSocket() {
      this.socket = io(`${API_BASE_URL}`, { transports: ['websocket', 'polling'] })

      console.log('Conectado ao WebSocket', this.socket)
      this.socket.on('connect', () => {
        console.log('Conectado ao WebSocket')
        this.socket.emit('subscribe', { queueId: this.queueId, clientId: null})
      })

      this.socket.on(`update-queue-${this.queueId}`, (data) => {
        const { clientId } = data.data;

        if(!clientId){
          this.fetchQueueData()
        }
      })
    }
  }
}
</script>

<style>
.painel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}

.number {
  font-size: 5em;
  margin: 20px 0;
}

.loading {
  font-size: 2em;
}
</style>
