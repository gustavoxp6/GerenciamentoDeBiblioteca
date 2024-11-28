// api/model/ModelLoans

// Importa o módulo 'fs' para trabalhar com o sistema de arquivos
var fs = require('fs');

// Importa a classe 'HandleDBMSMySQL' para gerenciar conexões e operações com o banco de dados MySQL
var HandleDBMSMySQL = require('../config/database/HandleDBMSMySQL');

// Define a classe 'ModelUser' para gerenciar acessos ao sistema
class ModelUser {
    // Define o número máximo de empréstimos permitidos por usuário
    static MAX_LOANS_PER_USER = 2;
    // O construtor inicializa uma instância de 'HandleDBMSMySQL'
    constructor() {
        this._HandleDBMSMySQL = new HandleDBMSMySQL();
    }

    // Método para destruir objetos, utilizado para lançar um erro se os parâmetros forem incorretos
    destroy(param = null) {
        // Função para obter o nome da variável
        var varToString = varObj => Object.keys(varObj)[0];
        // Lança um novo erro com informações sobre o parâmetro incorreto
        new Error('Parâmetros incorretos para a classe: `%s`, parâmetro `%s`', this.constructor.name, varToString({ param }));
    }

    // Método para buscar registros de acesso com suporte a paginação
    getLoans(limit = 0, offset = 0) {
        // Lê o arquivo de configuração 'env.json' para obter informações do banco de dados
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        // Define os limites de consulta
        var _limit = limit;
        var _offset = offset;

        // Declaração SQL vazia que será construída com base nas condições
        var sql = ``;

        // Se os limites de paginação forem nulos, busca todos os registros
        if ((_limit === null) && (_offset === null)) {
            sql = `select * from ` + envFile.database + `.emprestimo order by idemprestimo desc`;
        }
        // Se os limites de paginação forem números válidos, aplica a paginação
        else if ((typeof _limit === 'number' && _limit >= 0) && (typeof _offset === 'number' && _offset >= 1)) {
            sql = `select * from ` + envFile.database + `.emprestimo order by idemprestimo desc limit ` + _limit + `, ` + _offset;
        }
        // Se os parâmetros forem inválidos, exibe uma mensagem de erro
        else {
            console.error('Parâmetros incorretos para a classe: `%s`', this.constructor.name);
        }
        // Executa a consulta usando o método 'query' da instância de 'HandleDBMSMySQL'
        return this._HandleDBMSMySQL.query(sql);
    }

    // Método para inserir um novo registro de acesso no banco de dados
async postLoans(livro_idlivro = null, usuario_idusuario = null, data_emprestimo = null, data_devolucao = null) {
    // Valida o timestamp, hostname e ip; se inválidos, chama o método 'destroy' para lançar um erro
    console.log("3");
    this._data_emprestimo = (typeof data_emprestimo !== 'string' || data_emprestimo === null) ? this.destroy(data_emprestimo) : data_emprestimo;
    this._data_devolucao = (typeof data_devolucao !== 'string' || data_devolucao === null) ? this.destroy(data_devolucao) : data_devolucao;
    this._livro_idlivro = (typeof livro_idlivro !== 'string' || livro_idlivro === null) ? this.destroy(livro_idlivro) : livro_idlivro;
    this._usuario_idusuario = (typeof usuario_idusuario !== 'string' || usuario_idusuario === null) ? this.destroy(usuario_idusuario) : usuario_idusuario;

    // Lê o arquivo de configuração 'env.json' para obter informações do banco de dados
    var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

    // Verifica quantos empréstimos ativos o usuário possui
    var sqlCountLoans = `SELECT COUNT(*) AS loanCount FROM ${envFile.database}.emprestimo WHERE usuario_idusuario = ${this._usuario_idusuario} AND status = 'PENDENTE'`;

    // Executa a consulta para contar os empréstimos ativos do usuário
    const result = await this._HandleDBMSMySQL.query(sqlCountLoans, [usuario_idusuario]);
    console.log('Resultado da consulta:', result);

    // Se o número de empréstimos ativos for igual ou maior que o limite, retorna erro
    if (result.data[0].loanCount >= ModelUser.MAX_LOANS_PER_USER) {
        throw new Error(`O usuário já possui o máximo permitido de ${ModelUser.MAX_LOANS_PER_USER} Pendências ativas.`);
    }

    // Cria a declaração SQL para inserir o novo registro
    var sqlInsert = `insert into ${envFile.database}.emprestimo values (null, '${this._data_emprestimo}', '${this._data_devolucao}', 'PENDENTE', '${this._livro_idlivro}', '${this._usuario_idusuario}')`;

    // Executa a inserção usando o método 'insert' da instância de 'HandleDBMSMySQL'
    return this._HandleDBMSMySQL.insert(sqlInsert, [data_emprestimo, data_devolucao, livro_idlivro, usuario_idusuario]);
}

    putLoans(id, data_devolucao = null, ) {
        this._data_devolucao = (typeof data_devolucao !== 'string' || data_devolucao === null) ? this.destroy(data_devolucao) : data_devolucao;

        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        var sqlUpdate = `update ${envFile.database}.emprestimo set data_devolucao='${this._data_devolucao}', status='DEVOLVIDO' where idemprestimo=${id}`;

        return this._HandleDBMSMySQL.query(sqlUpdate,  [id, data_devolucao]);
    }

    // Método para deletar um registro de usuário no banco de dados
    deleteLoans(id) {
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        var sqlDelete = `delete from ${envFile.database}.emprestimo where idemprestimo=${id}`;

        return this._HandleDBMSMySQL.query(sqlDelete);
    }
    async getBooksAndUsersReports() {
        try {
            // Consulta SQL para obter os 10 livros mais emprestados
            const sqlLivrosMaisEmprestados = `
                SELECT livro_idlivro AS id_livro, livro.titulo AS nome_livro, COUNT(*) AS quantidade_de_emprestimo, 'livro mais EMPRESTADO' AS tipo
                FROM emprestimo
                INNER JOIN livro ON livro.idlivro = emprestimo.livro_idlivro
                GROUP BY livro_idlivro
                ORDER BY quantidade_de_emprestimo DESC
                LIMIT 10
            `;
    
            // Consulta SQL para obter os usuários com pendências
            const sqlUsuariosComPendencia = `
                SELECT usuario_idusuario AS id_usuario, usuario.nome AS nome_usuario, COUNT(*) AS quantidade_de_emprestimo, 'usuario com PENDÊNCIA' AS tipo
                FROM emprestimo
                INNER JOIN usuario ON usuario.idusuario = emprestimo.usuario_idusuario
                WHERE status = 'PENDENTE'
                GROUP BY usuario_idusuario
                HAVING quantidade_de_emprestimo > 0
                ORDER BY quantidade_de_emprestimo DESC
            `;
    
            // Executa a consulta para obter os livros mais emprestados
            const LivrosMaisEmprestados = await this._HandleDBMSMySQL.query(sqlLivrosMaisEmprestados);
    
            // Executa a consulta para obter os usuários com pendências
            const UsuariosComPendencia = await this._HandleDBMSMySQL.query(sqlUsuariosComPendencia);
    
            // Retorna os resultados das duas consultas
            return { LivrosMaisEmprestados, UsuariosComPendencia };
    
        } catch (error) {
            // Lança um erro caso ocorra algum problema ao gerar o relatório
            throw new Error(`Erro ao gerar o relatório combinado: ${error.message}`);
        }
    }
    

}

// Exporta a classe 'ModelUser' para que possa ser usada em outros módulos
module.exports = ModelUser;

// Exemplo comentado para converter um timestamp em formato GMT/UTC
// let timestamp = 1590349280203;
// let dateObject = new Date(timestamp);
// console.log(dateObject.toString());
// let myDate = dateObject.getDate();
// let myMonth = dateObject.getMonth() + 1;
// let myYear = dateObject.getFullYear();
// let myHour = dateObject.getHours();
// let myMinute = dateObject.getMinutes();
// let mySecond = dateObject.getSeconds();
// console.log(`${myYear}-${myMonth}-${myDate} ${myHour}:${myMinute}:${mySecond}`);