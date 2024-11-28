// Importa o módulo 'fs' para trabalhar com o sistema de arquivos
var fs = require('fs');

// Importa a classe 'HandleDBMSMySQL' para gerenciar conexões e operações com o banco de dados MySQL
var HandleDBMSMySQL = require('../config/database/HandleDBMSMySQL');

// Define a classe 'ModelUser' para gerenciar acessos ao sistema
class ModelUser {

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
    getBook(limit = 0, offset = 0) {
        // Lê o arquivo de configuração 'env.json' para obter informações do banco de dados
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        // Define os limites de consulta
        var _limit = limit;
        var _offset = offset;

        // Declaração SQL vazia que será construída com base nas condições
        var sql = ``;

        // Se os limites de paginação forem nulos, busca todos os registros
        if ((_limit === null) && (_offset === null)) {
            sql = `select * from ` + envFile.database + `.livro order by idlivro desc`;
        }
        // Se os limites de paginação forem números válidos, aplica a paginação
        else if ((typeof _limit === 'number' && _limit >= 0) && (typeof _offset === 'number' && _offset >= 1)) {
            sql = `select * from ` + envFile.database + `.livro order by idlivro desc limit ` + _limit + `, ` + _offset;
        }
        // Se os parâmetros forem inválidos, exibe uma mensagem de erro
        else {
            console.error('Parâmetros incorretos para a classe: `%s`', this.constructor.name);
        }
        // Executa a consulta usando o método 'query' da instância de 'HandleDBMSMySQL'
        return this._HandleDBMSMySQL.query(sql);
    }

    // Método para inserir um novo registro de acesso no banco de dados
    postBook(titulo = null, autor = null, genero = null, ano_publicacao = null) {
        // Valida o timestamp, hostname e ip; se inválidos, chama o método 'destroy' para lançar um erro
        this._titulo = (typeof titulo !== 'string' || titulo === null) ? this.destroy(titulo) : titulo;
        this._autor = (typeof autor !== 'string' || autor === null) ? this.destroy(autor) : autor;
        this._genero = (typeof genero !== 'string' || genero === null) ? this.destroy(genero) : genero;
        this._ano_publicacao = (typeof ano_publicacao !== 'number' || ano_publicacao < 1000 || ano_publicacao > 9999 || ano_publicacao === null) ? this.destroy(ano_publicacao) : ano_publicacao;

        // Lê o arquivo de configuração 'env.json' para obter informações do banco de dados
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        // Cria a declaração SQL para inserir o novo registro
        var sqlInsert = `insert into ${envFile.database}.livro values (null, '${this._titulo}', '${this._autor}', '${this._genero}','${this._ano_publicacao}')`;

        // Executa a inserção usando o método 'insert' da instância de 'HandleDBMSMySQL'
        return this._HandleDBMSMySQL.insert(sqlInsert);


    }
    //Metodo para atualizar o registro do livro no banco de dados
    putBook(id, titulo = null, autor = null, genero = null, ano_publicacao = null) {
        this._titulo = (typeof titulo !== 'string' || titulo === null) ? this.destroy(titulo) : titulo;
        this._autor = (typeof autor !== 'string' || autor === null) ? this.destroy(autor) : autor;
        this._genero = (typeof genero !== 'string' || genero === null) ? this.destroy(genero) : genero;
        this._ano_publicacao = (typeof ano_publicacao !== 'number' || ano_publicacao < 1000 || ano_publicacao > 9999 || ano_publicacao === null) ? this.destroy(ano_publicacao) : ano_publicacao;

        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        var sqlUpdate = `update ${envFile.database}.livro set titulo='${this._titulo}', autor='${this._autor}', genero='${this._genero}', ano_publicacao='${this._ano_publicacao}' where idlivro=${id}`;

        return this._HandleDBMSMySQL.query(sqlUpdate);
    }

    // Método para deletar o registro do livro no banco de dados
    deleteBook(id) {
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));

        var sqlDelete = `delete from ${envFile.database}.livro where idlivro=${id}`;

        return this._HandleDBMSMySQL.query(sqlDelete);
    }

}

// Exporta a classe 'ModelUser' para que possa ser usada em outros módulos
module.exports = ModelUser;
