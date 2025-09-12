const { executeQuery } = require('../../config/pool_conexoes');

// Modelo básico para HQ
class HQModel {
  // Exemplo de método para favoritar/desfavoritar
  static async favoritarHQ(hqId, userId) {
    // Implemente a lógica de favoritar/desfavoritar aqui
    // Exemplo: salvar no banco, retornar status, etc.
    return { sucesso: true, mensagem: 'Favoritado/desfavoritado com sucesso.' };
  }

  static async findAll(userId) {
    // Retorna lista de HQs (exemplo básico)
    // Implemente a lógica real conforme seu banco de dados
    return [
      { id: 1, titulo: 'HQ Exemplo 1', favorito: false },
      { id: 2, titulo: 'HQ Exemplo 2', favorito: true }
    ];
  }

  static async HQs() {
    try {
      const query = 'SELECT id_hq AS id, titulo, autor, genero, ano_publicacao FROM hq';
      const hqs = await executeQuery(query);
      return hqs;
    } catch (error) {
      console.error('Erro ao buscar HQs:', error);
      return [];
    }
  }
}

module.exports = HQModel;
