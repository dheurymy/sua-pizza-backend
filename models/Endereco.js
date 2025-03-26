const mongoose = require('mongoose'); // Importa o módulo mongoose

const EnderecoSchema = new mongoose.Schema({ // Cria um novo esquema de endereco
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Define o tipo como ObjectId
        ref: 'Cliente', // Referência ao modelo de usuário
        required: true, // Campo obrigatório
    },
    logradouro: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    numero: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    complemento: {
        type: String, // Define o tipo como String
    },
    bairro: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    cidade: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    estado: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    cep: {
        type: String, // Define o tipo como String
    },
});

module.exports = mongoose.model('Endereco', EnderecoSchema); // Exporta o modelo Endereco baseado no esquema
