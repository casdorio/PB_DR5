<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h1>Crie sua fila</h1>
          <form @submit.prevent="createList">
            <div class="form-group mb-3">
              <label for="name">Crie um nome para sua fila. Pode ser o nome da sua loja (por exemplo, “Loja de brinquedos Pollock” ) ou do serviço (por exemplo, “Registro de residência” ).</label>
              <input type="text" v-model="name" class="form-control" id="name" required>
            </div>
            <button type="submit" class="btn btn-primary">Criar Lista</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de loading -->
    <div class="modal" :class="{ 'is-active': loading }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <p>Aguarde enquanto criamos sua fila...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      loading: false
    };
  },
  methods: {
    async createList() {
      try {
        // Ativar o modal de loading
        this.loading = true;
        
        // Enviar o nome da lista via POST usando Axios
        await axios.post('http://localhost:5000/queues', {
          name: this.name
        });
        
        // Desativar o modal de loading após o envio bem-sucedido
        this.loading = false;
        
        // Limpar o campo do nome da lista após o envio bem-sucedido
        this.name = '';
        
        // Exibir uma mensagem de sucesso, se necessário
        alert('Lista criada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar lista:', error);
        // Desativar o modal de loading em caso de erro
        this.loading = false;
        // Exibir uma mensagem de erro, se necessário
        alert('Erro ao criar lista. Por favor, tente novamente mais tarde.');
      }
    }
  }
};
</script>

<style>
/* Estilos para centralizar o modal verticalmente */
.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilos adicionais para o modal de loading */
.modal-content .box {
  text-align: center;
}
</style>
