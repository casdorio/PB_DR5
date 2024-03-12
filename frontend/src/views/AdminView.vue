<template>
  <div class="admin-page">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else>
      <div class="queue-info">
        <div>Em serviço: {{ inService }}</div>
        <div>Pessoas na fila: {{ peopleInQueue }}</div>
        <div>Atendidos: {{ served }}</div>
        <div>Cancelados: {{ cancelled }}</div>
      </div>
      <div class="panel">
        {{ nextToBeCalled }}
      </div>
      <div class="actions">
        <button @click="callNext">Chamar próximo</button>
        <button @click="returnLast">Retornar</button>
        <button @click="cancelQueue">Cancelar fila</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';
import { API_BASE_URL } from '../globals';

export default {
  data() {
    return {
      loading: true,
      peopleInQueue: 0,
      served: 0,
      cancelled: 0,
      inService: 0,
      queueId: '',
      hash_admin:'',
      nextToBeCalled: 0,
      socket: null,
    };
  },
  mounted() {
    this.queueId = this.$route.params.queueId;
    this.hash_admin = this.$route.params.hash_admin;
    this.initAdminPage();
    this.setupWebSocket();
    
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect(); // Desconecte o socket ao destruir o componente
    }
  },
  methods: {
    initAdminPage() {

      axios.get(`${API_BASE_URL}/api/admin/${this.queueId}/${this.hash_admin}`)
        .then(response => {
          this.updateQueueData(response.data);
          this.loading = false;
        })
        .catch(error => {
          console.error('Erro ao inicializar a página do admin:', error);
          this.loading = false;
        });
    },
    updateQueueData(data) {
      this.peopleInQueue = data.waiting;
      this.served = data.served;
      this.cancelled = data.cancelled;
      this.inService = data.inService;
      this.nextToBeCalled = data.nextToBeCalled;
    },
    setupWebSocket() {
      this.socket = io(`${API_BASE_URL}`, { transports: ['websocket', 'polling'] });
      this.socket.on('connect', () => {
        console.log('Conectado ao WebSocket');
        this.socket.emit('subscribe', { queueId: this.queueId });

      });

      // Configurar manipuladores de eventos para o socket aqui
      this.socket.on(`update-queue-${this.queueId}`, (data) => {
       // this.updateQueueData(data);
       console.log('Dados atualizados:', data);
      });

    },


    callNext() {
     // this.setupWebSocket()
     if (this.socket) {
      console.log('Emitindo evento call-next amdin');
        this.socket.emit('call-next', { queueId: this.queueId });
      }
      // const queueId = this.$route.params.queueId;
      // axios.get(`${API_BASE_URL}/next/${queueId}`)
      //   .then(response => {
      //     console.log('Próximo chamado:', response.data);
      //     this.fetchQueueInfo()
      //   })
      //   .catch(error => {
      //     console.error('Erro ao chamar o próximo:', error);
      //   });
    },

    returnLast() {
      const queueId = this.$route.params.queueId;
      axios.get(`${API_BASE_URL}/api/return/${queueId}`)
        .then(response => {
          console.log('Último retorno:', response.data);
        })
        .catch(error => {
          console.error('Erro ao retornar o último:', error);
        });
    },

    cancelQueue() {
      const queueId = this.$route.params.queueId;
      axios.get(`${API_BASE_URL}/api/cancel/${queueId}`)
        .then(response => {
          console.log('Fila cancelada:', response.data);
        })
        .catch(error => {
          console.error('Erro ao cancelar a fila:', error);
        });
    },
  }
}
</script>

<style>
.admin-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}

.queue-info {
  position: absolute;
  top: 20px;
  right: 20px;
}

.loading {
  font-size: 2em;
}

.actions button {
  margin: 10px;
}
</style>
