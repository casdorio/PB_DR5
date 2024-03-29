# QueueEase

## Descrição

QueueEase oferece uma solução eficaz para gerenciar filas de forma inteligente e eficiente, proporcionando uma experiência mais rápida e conveniente para seus usuários.

## Como Utilizar


### Inicialização Rápida

A inicialização rápida é uma maneira conveniente de começar a usar o QueueEase rapidamente. Certifique-se de ter o MySQL instalado e o banco de dados criado antes de executar a inicialização rápida.

**Nota: É necessário ter o banco de dados MySQL já criado antes de executar a inicialização rápida.**

1. Abra o terminal.
2. Navegue até o diretório raiz do projeto.
3. Execute o seguinte comando:


```bash
git clone https://github.com/casdorio/PB_DR5.git
cd PB_DR5
npm run init
```

Se o arquivo backend/database/database.js não existir, o sistema solicitará que você forneça as informações necessárias, como nome do banco de dados, nome de usuário, senha e host do MySQL, via terminal. Em seguida, ele criará o arquivo database.js com as informações fornecidas e instalará as dependências do backend.

### Iniciar Separadamente

Se preferir iniciar o backend e o frontend separadamente, siga estas etapas:

### Backend

O backend do aplicativo é construído com Express e MySQL. Siga estas etapas para iniciar o servidor:

1. Certifique-se de ter o MySQL instalado e em execução na sua máquina.
2. No diretório `backend/database`, renomeie o arquivo `example.database.js` para `database.js`.
3. Abra o arquivo `database.js` e configure as informações de conexão do MySQL de acordo com sua configuração local.
4. No terminal, navegue até o diretório `backend`.
5. Execute o comando `npm install` para instalar as dependências.

```bash
cd backend
npm install
```

6. Execute o comando `npm start` para iniciar o servidor backend. O servidor estará acessível em `http://localhost:5000`.

```bash
npm start
```

### Frontend

O frontend do aplicativo é construído com Vue.js. Siga estas etapas para executar o aplicativo frontend:

1. No diretório `frontend`, execute o comando `npm install` para instalar as dependências.

```bash
cd frontend
npm install
```

2. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento do Vue.js. O aplicativo estará acessível assim que o Vite concluir a compilação e informar o endereço e porta no terminal.

```bash
npm run dev
```

## Estrutura do Diretório

- `backend`: Contém o código-fonte do servidor backend.
- `frontend`: Contém o código-fonte do aplicativo frontend.

## Configuração do Banco de Dados

O arquivo `database.js` localizado no diretório `backend/database` contém as configurações de conexão com o banco de dados MySQL. Certifique-se de configurar corretamente este arquivo antes de iniciar o servidor backend.

## Contato

Para quaisquer dúvidas ou problemas, entre em contato [casdorio@gmail.com].
