const { executeQuery } = require('../../config/pool_conexoes');

class PetModel {
    static async criar(dadosPet) {
        const query = `
            INSERT INTO PETS (
                ID_CLIENTE, ID_USUARIO, NOME_PET, RACA_PET, IDADE_PET, SEXO_PET, TIPO_ADESTRAMENTO, PROBLEMA_COMPORTAMENTO, OBSERVACOES
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const resultado = await executeQuery(query, [
            dadosPet.idCliente,
            dadosPet.idUsuario,
            dadosPet.nomePet,
            dadosPet.racaPet,
            dadosPet.idadePet || null,
            dadosPet.sexoPet || null,
            dadosPet.tipoAdestramento || null,
            dadosPet.problemaComportamento || null,
            dadosPet.observacoes || null
        ]);
        
        return resultado.insertId;
    }

    static async buscarPorUsuario(idUsuario) {
        const query = `SELECT * FROM PETS WHERE ID_USUARIO = ? ORDER BY data_cadastro DESC`;
        return await executeQuery(query, [idUsuario]);
    }

    static async atualizar(idPet, dadosPet) {
        const query = `
            UPDATE PETS SET 
                NOME_PET = ?, RACA_PET = ?, IDADE_PET = ?, SEXO_PET = ?, TIPO_ADESTRAMENTO = ?, PROBLEMA_COMPORTAMENTO = ?, OBSERVACOES = ?
            WHERE ID_PET = ?
        `;
        await executeQuery(query, [
            dadosPet.nomePet,
            dadosPet.racaPet,
            dadosPet.idadePet || null,
            dadosPet.sexoPet || null,
            dadosPet.tipoAdestramento || null,
            dadosPet.problemaComportamento || null,
            dadosPet.observacoes || null,
            idPet
        ]);
    }

    static async deletar(idPet) {
        const query = `DELETE FROM PETS WHERE ID_PET = ?`;
        await executeQuery(query, [idPet]);
    }
}

module.exports = PetModel;
