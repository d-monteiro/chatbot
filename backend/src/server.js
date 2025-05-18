
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./db');

// Conectar ao banco de dados
connectDB();

// Importar rotas
const auth = require('./routes');

const app = express();

// Middleware para Body Parser
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Definir rotas
app.use('/api', auth);

// Rota básica
app.get('/', (req, res) => {
  res.send('API está a funcionar');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});

// Manipular rejeições não tratadas
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erro: ${err.message}`);
  // Fechar servidor e sair do processo
  server.close(() => process.exit(1));
});