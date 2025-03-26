const express = require('express'); // Importa o módulo express para criar o servidor
const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens
const dotenv = require('dotenv'); // Importa o módulo dotenv para gerenciar variáveis de ambiente

const Cliente = require('./models/Cliente'); // Importa o modelo de Cliente
const Endereco = require('./models/Endereco'); // Importa o modelo de Endereco

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 5000; // Define a porta do servidor a partir da variável de ambiente ou usa 5000 como padrão
const MONGO_URI = process.env.MONGO_URI; // Obtém a URI de conexão do MongoDB a partir da variável de ambiente
const secret = process.env.JWT_SECRET; // Obtém a chave secreta do JWT a partir da variável de ambiente

app.use(cors()); // Utiliza o middleware CORS
app.use(express.json()); // Utiliza o middleware para parsear o corpo das requisições como JSON

app.use((req, res, next) => { 
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); 
  next(); 
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, // Configuração para usar o novo parser de URL do MongoDB
  useUnifiedTopology: true, // Configuração para usar a nova engine de topo do MongoDB
})
.then(() => console.log('Connected to MongoDB')) // Mensagem de sucesso na conexão com o MongoDB
.catch(err => console.error('Error connecting to MongoDB:', err.message)); // Mensagem de erro na conexão com o MongoDB




app.get('/', (req, res) => {
  res.send('API da aplicação Sua Pizza está funcionando!'); // Mensagem de sucesso ao acessar a raiz da API
})


// Registrar cliente
app.post('/clientes/registro', async (req, res) => {
    const { nome, email, senha, telefones, enderecos } = req.body; // Extrai os dados do corpo da requisição

    try {
        const cliente = new Cliente({ nome, email, senha, telefones, enderecos }); // Cria uma nova instância de Cliente
        await cliente.save(); // Salva o cliente no banco de dados
        res.status(201).json({ message: 'Cliente registrado com sucesso', cliente }); // Retorna mensagem de sucesso com status 201
    } catch (err) {
        res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
    }
});

// Atualizar cliente
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do cliente a ser atualizado
  const { nome, email, senha, telefones, enderecos } = req.body; // Dados para atualização

  try {
      const clienteAtualizado = await Cliente.findByIdAndUpdate(
          id,
          { nome, email, senha, telefones, enderecos },
          { new: true, runValidators: true } // Retorna o documento atualizado e valida os dados
      );

      if (!clienteAtualizado) {
          return res.status(404).json({ message: 'Cliente não encontrado' }); // Cliente não existe
      }

      res.status(200).json({ message: 'Cliente atualizado com sucesso', cliente: clienteAtualizado });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Retorna erros de validação ou outros problemas
  }
});

// Deletar cliente
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do cliente a ser deletado

  try {
      const clienteDeletado = await Cliente.findByIdAndDelete(id);

      if (!clienteDeletado) {
          return res.status(404).json({ message: 'Cliente não encontrado' }); // Cliente não existe
      }

      res.status(200).json({ message: 'Cliente deletado com sucesso', cliente: clienteDeletado });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Retorna erro, se necessário
  }
});

// Listar clientes
app.get('/clientes', async (req, res) => {
  try {
      const clientes = await Cliente.find().populate('enderecos'); // Recupera clientes e popula os endereços
      res.status(200).json({ message: 'Lista de clientes', clientes });
  } catch (err) {
      res.status(500).json({ message: 'Erro ao recuperar clientes', error: err.message });
  }
});

// Registrar endereco
app.post('/enderecos/registro', async (req, res) => {
  const { userId, logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body; // Extrai os dados do corpo da requisição

  try {
      const endereco = new Endereco({ userId, logradouro, numero, complemento, bairro, cidade, estado, cep }); // Cria uma nova instância de Endereco
      await endereco.save(); // Salva o endereço no banco
      res.status(201).json({ message: 'Endereço registrado com sucesso', endereco });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Retorna mensagem de erro
  }
});


// Atualizar endereco
app.put('/enderecos/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do endereço a ser atualizado
  const { logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body; // Dados para atualização

  try {
      const enderecoAtualizado = await Endereco.findByIdAndUpdate(
          id,
          { logradouro, numero, complemento, bairro, cidade, estado, cep },
          { new: true, runValidators: true } // Retorna o documento atualizado e valida os dados
      );

      if (!enderecoAtualizado) {
          return res.status(404).json({ message: 'Endereço não encontrado' }); // Endereço não existe
      }

      res.status(200).json({ message: 'Endereço atualizado com sucesso', endereco: enderecoAtualizado });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Retorna erros de validação ou outros problemas
  }
});

// Deletar endereco
app.delete('/enderecos/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do endereço a ser deletado

  try {
      const enderecoDeletado = await Endereco.findByIdAndDelete(id);

      if (!enderecoDeletado) {
          return res.status(404).json({ message: 'Endereço não encontrado' }); // Endereço não existe
      }

      res.status(200).json({ message: 'Endereço deletado com sucesso', endereco: enderecoDeletado });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Retorna erro
  }
});

// Listar enderecos
app.get('/enderecos', async (req, res) => {
  try {
      const enderecos = await Endereco.find().populate('userId'); // Recupera endereços e popula os dados do cliente associado
      res.status(200).json({ message: 'Lista de endereços', enderecos });
  } catch (err) {
      res.status(500).json({ message: 'Erro ao recuperar endereços', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Mensagem indicando que o servidor está rodando na porta especificada
});
