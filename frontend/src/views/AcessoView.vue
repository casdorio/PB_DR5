<template>
  <div class="access-page">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-else class="welcome-container">
      <h1 class="queue-name">Bem-vindo - {{ queueName }}</h1>
      <div v-if="clientPosition !== null && queueIsActive">
        <div class="client-position-container">
          <div class="circle-container">
            <div class="circle">
              <div class="client-position">
                <p>{{ serviceNumber }}</p>
                <p>{{ positionText }}</p>
              </div>
            </div>
            <div class="circle-outer"></div>
            <div class="gradient-border"></div>
            <div class="gradient-border-moving"></div>
          </div>
        </div>
        <h1>{{ message }}</h1>
        <button v-if="clientPosition > 0" class="btn btn-danger my-2" @click="deleteClient">Sair da fila</button>
        <!--Criar button para entrar novamente na fila caso clientPosition === 0 --> 
        <button v-if="clientPosition === 0" class="btn btn-success my-2" @click="enterQueueAgain">Entrar novamente</button>
      </div>

      <div v-else>
        <p v-if="queueIsActive">Por favor, clique no botão abaixo para entrar na fila.</p>
        <button v-if="queueIsActive" @click="enterQueue">Entrar na Fila</button>
        <p v-if="!queueIsActive" class="queue-inactive-message">
          A fila está inativa. Por favor, tente novamente mais tarde ou converse com um atendente do
          estabelecimento.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { API_BASE_URL } from '../globals'
import io from 'socket.io-client'
import alertSound from '@/assets/audio/alert.mp3'

export default {
  data() {
    return {
      queueName: '',
      queueId: '',
      queueIsActive: false,
      loading: true,
      session: '',
      idClient: null,
      message: null,
      clientPosition: null,
      positionText: null,
      serviceNumber: null,
    }
  },
  mounted() {
    this.queueId = this.$route.params.id
    this.setupWebSocket();
    this.captureSession().then(() => {
      if (this.session) {
        this.getQueueNameAndStatus()
      } else {
        this.generateSession()
      }
    })
  },

  watch: {
    idClient(newValue) {
      if (newValue !== null) {
        this.checkQueuePosition()
      }
    }
  },
  methods: {
    resetData() {
      this.idClient = null;
      this.clientPosition = null;
      this.message = null;
      this.serviceNumber = null;
    },
    resetLocalStorage() {
      localStorage.removeItem(`queueSession-${this.queueId}`)
    },
    async checkQueuePosition() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/client/position/${this.queueId}/${this.idClient}`);
            
            this.handleQueuePositionResponse(response.data);
            this.handleClientStatus(response.data.status);
        } catch (error) {
            console.error('Erro ao verificar a posição na fila:', error);
        }
    },
    handleQueuePositionResponse(data) {
        this.serviceNumber = data.serviceNumber;
        this.clientPosition = data.positionInQueue;
        this.message = data.message;
        this.queueIsActive = data.queueIsActive;

        if (data.status === 'served') {
            this.positionText = "Obrigado, volte sempre!";
        } else {
            this.positionText = this.getPositionText();
        }
    },
    handleClientStatus(status) {
        if (status === 'in_service') {
            this.playAudio();
            this.vibrateDevice();
        }
    },
    getPositionText() {
        switch (this.clientPosition) {
            case 0:
                return "Sua vez de ser atendido!";
            case 1:
                return "Você está em 1º lugar, é o próximo a ser atendido!";
            case 2:
                return "Você está em 2º lugar, aguarde ser chamado!";
            case 3:
                return "Você está em 3º lugar, aguarde um pouco mais!";
            default:
                return this.clientPosition ? `Você está em ${this.clientPosition}º lugar` : "";
        }
    },
    async captureSession() {
      try {
        const storedSession = localStorage.getItem(`queueSession-${this.queueId}`)

        if (storedSession) {
          const sessionData = JSON.parse(storedSession)
          if (sessionData.queueId === this.queueId) {
            this.session = sessionData.session
          } else {
            await this.generateSession()
          }
        } else {
          await this.generateSession()
        }
      } catch (error) {
        console.error('Erro ao capturar a sessão do usuário:', error)
      }
    },
    async getQueueNameAndStatus() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/queue/${this.queueId}/${this.session}`
        )
        this.queueName = response.data.queue.name
        this.queueIsActive = response.data.isActive
        this.idClient = response.data.id_client ?? null

        this.loading = false
      } catch (error) {
        console.error('Erro ao obter o nome da fila e status:', error)
        this.loading = false
      }
    },
    enterQueue() {
      axios
        .post(`${API_BASE_URL}/api/queue/join`, {
          queueId: this.queueId,
          session: this.session
        })
        .then((response) => {
          this.startWebSocket();
          this.idClient = response.data.id_client
        })
        .catch((error) => {
          console.error('Erro ao tentar entrar na fila:', error)
        })
    },
    async generateSession() {
      const newSession = uuidv4()
      this.session = newSession
      const sessionData = { queueId: this.queueId, session: newSession }
      localStorage.setItem(`queueSession-${this.queueId}`, JSON.stringify(sessionData))
    },

    playAudio() {
      const audio = new Audio(alertSound)
      audio.play().catch((e) => console.error('Erro ao reproduzir o áudio:', e))
    },
    vibrateDevice() {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      } else {
        console.log('Vibração não suportada neste dispositivo.')
      }
    },
    deleteClient() {
      axios
        .delete(`${API_BASE_URL}/api/client/${this.idClient}`)
        .then(() => {
          this.resetData()
          this.resetLocalStorage();
          this.deleteClientEmit();
          this.generateSession();
        })
        .catch((error) => {
          console.error('Erro ao tentar sair da fila:', error)
        })
    },
    deleteClientEmit(){
      this.socket.emit('cancel-client', { queueId: this.queueId, clientId: this.idClient})
    },
    setupWebSocket() {
      this.socket = io(`${API_BASE_URL}`, { transports: ['websocket', 'polling'] })
      this.socket.on('connect', () => {
        console.log('Conectado ao WebSocket')
      })
    },
    startWebSocket() {
      if (this.socket) {
        this.socket.emit('subscribe', { queueId: this.queueId, clientId: this.idClient})
        this.socket.on(`update-queue-${this.queueId}`, (data) => {
          const { clientId } = data.data;
          if(!clientId){
            this.checkQueuePosition()
          }
        })
      }
    },
    stopWebSocket() {
      if (this.socket) {
        this.socket.off(`update-queue-${this.queueId}`);
      }
    },
    enterQueueAgain() {
          this.resetData();
          this.resetLocalStorage();
          this.startWebSocket();
          this.generateSession();
          this.enterQueue();
    },
  }
}
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
  padding: 20px;
}

.queue-name {
  font-size: 2em;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  margin-bottom: 20px;
}

.client-position-container {
  display: inline-block;
}

.circle-container {
  position: relative;
  margin: 50px;
}

.circle {
  width: 400px; /* Largura do círculo */
  height: 400px; /* Altura do círculo */
  border-radius: 50%;
  border: 10px solid #aa3684; /* Espessura da borda */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Efeito de sombra */
  position: relative;
}

.client-position {
  font-size: 2rem; /* Tamanho do número */
}

.circle-outer,
.gradient-border,
.gradient-border-moving {
  position: absolute;
  top: -6px;
  left: -60px;
  width: 130%;
  height: 100%;
  border-radius: 50%;
}

.circle-outer {
  animation: spin 10s linear infinite; /* Animação de rotação */
  border: 40px solid rgba(221, 25, 25, 0.062);
}

.gradient-border-moving {
  animation: spin 5s linear infinite; /* Animação de rotação */
  border: 40px solid rgba(48, 221, 25, 0.062);
}

.gradient-border {
  animation: spin 8s linear infinite; /* Animação de rotação */
  border: 40px solid rgba(61, 25, 221, 0.062);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.queue-inactive-message {
  margin-top: 20px;
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

@media screen and (max-width: 768px) {
  .circle {
    width: 250px;
    height: 250px;
    border-width: 8px;
  }

  .client-position {
    font-size: 1rem;
  }

  .circle-outer,
  .gradient-border,
  .gradient-border-moving {
    left: -38px;
  }
  .circle-outer {
    border: 28px solid rgba(221, 25, 25, 0.062);
  }

  .gradient-border-moving {
    border: 28px solid rgba(48, 221, 25, 0.062);
  }

  .gradient-border {
    border: 28px solid rgba(61, 25, 221, 0.062);
  }
}
</style>
