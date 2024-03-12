<template>
  <div class="access-page">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else class="welcome-container">
      <h1 v-if="queueName">Bem-vindo à fila {{ queueName }}</h1>
      <h1 v-else>Erro ao carregar nome da fila</h1>

      <div v-if="clientPosition !== null">
        <h2>Sua posição na fila é: {{ clientPosition }}</h2>
      </div>

      <div v-else>
        <p v-if="queueName">Por favor, clique no botão abaixo para entrar na fila.</p>
        <button v-if="queueName && queueIsActive" @click="enterQueue">Entrar na Fila</button>
        <p class="mt-5" v-else>A fila está inativa. Por favor, tente novamente mais tarde ou converse com um atendente
          do estabelecimento.</p>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../globals';

export default {
  data() {
    return {
      queueName: '',
      queueId: '',
      queueIsActive: false,
      loading: true,
      session: '',
      idClient: null,
      clientPosition: null,
    };
  },
  mounted() {
    this.queueId = this.$route.params.id;

    this.captureSession().then(() => {
      if (this.session) {
        this.getQueueNameAndStatus();
      } else {
        this.generateSession();
      }
    });
  },
  watch: {
    idClient(newValue) {
      if (newValue !== null) {
        this.checkQueuePosition();
      }
    }
  },
  methods: {
    async checkQueuePosition() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/client/position/${this.queueId}/${this.idClient}`);
        this.clientPosition = response.data.positionInQueue;
      } catch (error) {
        console.error('Erro ao verificar a posição na fila:', error);
      }
    },

    async captureSession() {
      try {
        // Tenta recuperar a sessão do localStorage
        const storedSession = localStorage.getItem('queueSession');

        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          // Verifica se a sessão armazenada corresponde ao queueId atual
          if (sessionData.queueId === this.queueId) {
            this.session = sessionData.session;
          } else {
            // Se a sessão armazenada não corresponder, gera uma nova
            await this.generateSession();
          }
        } else {
          // Se não houver sessão armazenada, gera uma nova
          await this.generateSession();
        }
      } catch (error) {
        console.error('Erro ao capturar a sessão do usuário:', error);
      }
    },
    async getQueueNameAndStatus() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/queue/${this.queueId}/${this.session}`);
        this.queueName = response.data.queue.name;
        this.queueIsActive = response.data.isActive;
        this.idClient = response.data.id_client?? null;
        this.loading = false;
      } catch (error) {
        console.error('Erro ao obter o nome da fila e status:', error);
        this.loading = false;
      }
    },
    enterQueue() {
      axios.post(`${API_BASE_URL}/api/queue/join`, {
        queueId: this.queueId,
        session: this.session,
      })
        .then(response => {
          console.log('Sucesso ao entrar na fila:', response.data);
          this.idClient = response.data.id_client;
        })
        .catch(error => {
          console.error('Erro ao tentar entrar na fila:', error);
        });
    },
    async generateSession() {
      const newSession = uuidv4();
      this.session = newSession;
      const sessionData = { queueId: this.queueId, session: newSession };
      localStorage.setItem('queueSession', JSON.stringify(sessionData));
    },
  }
};
</script>

<style scoped>
.access-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  font-size: 1.2em;
}

.welcome-container {
  text-align: center;
}

button {
  background-color: #aa3684;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #aa368350;
  color: black;
}
</style>
