<template>
  <div class="qrcode-container">
    <h1>{{ queueName }}</h1>
    <p>Para entrar, escaneie o QR Code ou clique no botão abaixo.</p>
    <div class="qrcode-wrapper" v-if="qrcodeValue">
      <qrcode-vue :value="qrcodeValue" :size="qrcodeSize" class="qrcode" />
      <p><a :href="qrcodeValue" target="_blank" class="btn btn-primary">Acessar Fila</a></p>
    </div>
    <div v-else>
      <p>Carregando...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'
import { API_BASE_URL } from '../globals'

export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
      qrcodeValue: null,
      qrcodeSize: 500,
      id: null,
      queueName: ''
    }
  },
  async created() {
    this.id = this.$route.params.id
    try {
      const response = await axios.get(`${API_BASE_URL}/api/queue/${this.id}`)
      this.queueName = response.data.queue.name
      if (response.data.isActive) {
        this.qrcodeValue = `${window.location.origin}/acesso/${this.id}`
      } else {
        console.log('A fila não está ativa.')
      }
    } catch (error) {
      console.error('Erro ao obter status da fila:', error)
    }
  }
}
</script>

<style scoped>
.qrcode-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* Centraliza o texto */
}

.qrcode-wrapper {
  max-width: 90%;
  max-height: 90%;
  border-radius: 49px;
  border: 5px solid #aa3684; /* Borda roxa */
  padding: 20px; /* Espaçamento interno */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra opcional para destaque */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-wrapper canvas {
  max-width: 100%; /* Garante que a imagem não ultrapasse o wrapper */
  height: 100% !important;
}

@media (max-width: 768px) {
  /* Para dispositivos móveis */
  .qrcode-wrapper {
    max-width: 60%; /* Torna o QR Code menor em dispositivos móveis */
  }
}

.btn-primary {
  background-color: #aa3684; /* Personaliza a cor do botão para roxo */
  border-color: #aa3684; /* Bordas do botão */
  padding: 10px 20px; /* Ajuste do padding para um melhor visual */
  color: white; /* Cor do texto */
  text-decoration: none; /* Remove o sublinhado do link */
  margin-top: 15px; /* Espaço acima do botão */
}
</style>
