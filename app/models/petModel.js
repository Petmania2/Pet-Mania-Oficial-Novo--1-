// models/petModel.js
const { executeQuery } = require('../../config/pool_conexoes');

const PetModel = {
  // Criar novo pet
  async criar(dadosPet) {
    const query = `
      INSERT INTO pets (
        cliente_id, nome, tipo_animal, raca, sexo, idade_anos, idade_meses,
        peso, tamanho, cor, castrado, vacinado, observacoes_saude,
        temperamento, observacoes_comportamento, data_cadastro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const valores = [
      dadosPet.cliente_id,
      dadosPet.nome,
      dadosPet.tipo_animal,
      dadosPet.raca,
      dadosPet.sexo,
      dadosPet.idade_anos,
      dadosPet.idade_meses,
      dadosPet.peso,
      dadosPet.tamanho,
      dadosPet.cor,
      dadosPet.castrado,
      dadosPet.vacinado,
      dadosPet.observacoes_saude,
      dadosPet.temperamento,
      dadosPet.observacoes_comportamento,
      dadosPet.data_cadastro
    ];

    try {
      const results = await executeQuery(query, valores);
      return results.insertId;
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      throw error;
    }
  },

  // Buscar pets por cliente
  async buscarPorCliente(clienteId) {
    const query = `
      SELECT 
        id, nome, tipo_animal, raca, sexo, idade_anos, idade_meses,
        peso, tamanho, cor, castrado, vacinado, observacoes_saude,
        temperamento, observacoes_comportamento, data_cadastro
      FROM pets 
      WHERE cliente_id = ? 
      ORDER BY data_cadastro DESC
    `;

    try {
      const results = await executeQuery(query, [clienteId]);
      return results;
    } catch (error) {
      console.error("Erro ao buscar pets por cliente:", error);
      throw error;
    }
  },

  // Buscar pet por ID e cliente (para segurança)
  async buscarPorIdECliente(petId, clienteId) {
    const query = `
      SELECT 
        id, nome, tipo_animal, raca, sexo, idade_anos, idade_meses,
        peso, tamanho, cor, castrado, vacinado, observacoes_saude,
        temperamento, observacoes_comportamento, data_cadastro
      FROM pets 
      WHERE id = ? AND cliente_id = ?
    `;

    try {
      const results = await executeQuery(query, [petId, clienteId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error("Erro ao buscar pet por ID e cliente:", error);
      throw error;
    }
  },

  // Buscar pet por ID
  async buscarPorId(petId) {
    const query = `
      SELECT 
        p.*, c.nome as nome_cliente, c.email as email_cliente
      FROM pets p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `;

    try {
      const results = await executeQuery(query, [petId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error("Erro ao buscar pet por ID:", error);
      throw error;
    }
  },

  // Atualizar pet
  async atualizar(petId, dadosAtualizados) {
    const query = `
      UPDATE pets SET
        nome = ?, tipo_animal = ?, raca = ?, sexo = ?, idade_anos = ?, 
        idade_meses = ?, peso = ?, tamanho = ?, cor = ?, castrado = ?, 
        vacinado = ?, observacoes_saude = ?, temperamento = ?, 
        observacoes_comportamento = ?, data_atualizacao = ?
      WHERE id = ?
    `;
    
    const valores = [
      dadosAtualizados.nome,
      dadosAtualizados.tipo_animal,
      dadosAtualizados.raca,
      dadosAtualizados.sexo,
      dadosAtualizados.idade_anos,
      dadosAtualizados.idade_meses,
      dadosAtualizados.peso,
      dadosAtualizados.tamanho,
      dadosAtualizados.cor,
      dadosAtualizados.castrado,
      dadosAtualizados.vacinado,
      dadosAtualizados.observacoes_saude,
      dadosAtualizados.temperamento,
      dadosAtualizados.observacoes_comportamento,
      dadosAtualizados.data_atualizacao,
      petId
    ];

    try {
      const results = await executeQuery(query, valores);
      return results.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      throw error;
    }
  },

  // Excluir pet
  async excluir(petId) {
    const query = "DELETE FROM pets WHERE id = ?";

    try {
      const results = await executeQuery(query, [petId]);
      return results.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      throw error;
    }
  },

  // Contar pets de um cliente
  async contarPorCliente(clienteId) {
    const query = "SELECT COUNT(*) as total FROM pets WHERE cliente_id = ?";

    try {
      const results = await executeQuery(query, [clienteId]);
      return results[0].total;
    } catch (error) {
      console.error("Erro ao contar pets:", error);
      throw error;
    }
  },

  // Buscar pets por tipo de animal
  async buscarPorTipo(clienteId, tipoAnimal) {
    const query = `
      SELECT 
        id, nome, tipo_animal, raca, sexo, idade_anos, idade_meses,
        peso, tamanho, cor, castrado, vacinado
      FROM pets 
      WHERE cliente_id = ? AND tipo_animal = ?
      ORDER BY nome
    `;

    try {
      const results = await executeQuery(query, [clienteId, tipoAnimal]);
      return results;
    } catch (error) {
      console.error("Erro ao buscar pets por tipo:", error);
      throw error;
    }
  },

  // Verificar se nome do pet já existe para o cliente
  async verificarNomeDuplicado(clienteId, nome, petId = null) {
    let query = "SELECT id FROM pets WHERE cliente_id = ? AND nome = ?";
    let params = [clienteId, nome];
    
    // Se está editando, exclui o próprio pet da verificação
    if (petId) {
      query += " AND id != ?";
      params.push(petId);
    }

    try {
      const results = await executeQuery(query, params);
      return results.length > 0;
    } catch (error) {
      console.error("Erro ao verificar nome duplicado:", error);
      throw error;
    }
  }
};

module.exports = PetModel;