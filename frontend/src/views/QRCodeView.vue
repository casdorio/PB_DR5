<template>
  <div class="qrcode-container">
    <h1>QR Code page</h1>
    <div class="qrcode-wrapper" v-if="qrcodeValue">
      <qrcode-vue :value="qrcodeValue" :size="qrcodeSize" />
      <p><a :href="qrcodeValue" target="_blank">{{ qrcodeValue }}</a></p>

    </div>
    <div v-else>
      <p>Carregando...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';
import { API_BASE_URL } from '../globals';

export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
      qrcodeValue: null,
      qrcodeSize: 500,
      id: null
    };
  },
  async created() {
    this.id = this.$route.params.id;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/queue/${this.id}`);
      if (response.data.isActive) {
        this.qrcodeValue = `${window.location.origin}/acesso/${this.id}`;
      } else {
        console.log('A fila não está ativa.');
      }
    } catch (error) {
      console.error('Erro ao obter status da fila:', error);
    }
  }
};
</script>

<style scoped>
.qrcode-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qrcode-wrapper {
  max-width: 90%;
  max-height: 90%;
}

.qrcode-wrapper img {
  width: 100%;
  height: auto;
}
</style>
