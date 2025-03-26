const mongoose = require('mongoose'); // Importa o módulo mongoose

const ClienteSchema = new mongoose.Schema({ // Cria um novo esquema de cliente
    nome: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    email: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    senha: {
        type: String, // Define o tipo como String
        required: true, // Campo obrigatório
    },
    telefones: {
        type: [String], // Define o tipo como Array de Strings
        required: true, // Campo obrigatório
    },
    enderecos: [{
        type: mongoose.Schema.Types.ObjectId, // Define o tipo como ObjectId
        ref: 'Endereco', // Referência ao modelo de endereco
    }],
});

module.exports = mongoose.model('Cliente', ClienteSchema); // Exporta o modelo Cliente baseado no esquema