// Importa o módulo 'mysql' para interagir com o banco de dados MySQL
var mysql = require('mysql');

// Importa o módulo 'fs' para trabalhar com o sistema de arquivos
var fs = require('fs');

// Define a classe 'HandleDBMSMySQL' para gerenciar conexões e operações com o banco de dados MySQL
class HandleDBMSMySQL {

  // O construtor da classe aceita parâmetros opcionais para host, database, user e password
  constructor(host=null, database=null, user=null, password=null){

    // Lê o arquivo de configuração 'env.json' que contém as credenciais do banco de dados
    var session_file = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8', 'r'));
    
    // Se o arquivo de configuração foi lido com sucesso, inicializa as propriedades
    if (session_file) {
      // Atribui valores das configurações ou dos parâmetros fornecidos
      this._host      = ( typeof host      !== 'string' || host     == null ) ? session_file.host     : host;
      this._database  = ( typeof database  !== 'string' || database == null ) ? session_file.database : database;
      this._user      = ( typeof user      !== 'string' || user     == null ) ? session_file.user     : user;
      this._password  = ( typeof password  !== 'string' || password == null ) ? session_file.password : password;
      
      // Chama o método 'connect' para estabelecer a conexão com o banco de dados
      this.connect();
    } else {
      // Se o arquivo de configuração não foi lido corretamente, exibe um erro no console
      console.error('Parâmetros incorretos para a classe: `%s`', this.constructor.name);
    }

  }

  // Método para estabelecer a conexão com o banco de dados
  connect() {

    // Cria uma nova conexão MySQL usando as credenciais fornecidas
    this.connection = mysql.createConnection({
      host:     this._host,
      database: this._database,
      user:     this._user,
      password: this._password 
    });

  }

  // Método para executar uma consulta SQL com argumentos, retornando uma Promise
  query(sql, args){

    return new Promise((resolve, reject) => {
      // Executa a consulta SQL
      this.connection.query(sql, args, (err, results, fields) => {
        if (err) {
          // Se houver um erro, rejeita a Promise
          reject(err);
        } else {
          // Formata os resultados em JSON com metadados e dados
          var resultsJSON = { 'metadata': {}, 'data': {} };
          console.log(results);  
          // Se fields estiver definido e for um array, copia os metadados dos campos
          if (Array.isArray(fields) && fields.length > 0) {
            // Captura o nome da tabela da primeira coluna (assume que todas as colunas são da mesma tabela)
            resultsJSON.metadata.tableName = fields[0].table;
            resultsJSON.metadata.columns = fields.map((field) => field.name);  // Copia metadados dos campos
          }
          // Se results estiver definido e for um array, copia os dados das linhas
          if (Array.isArray(results)) {
          resultsJSON.data = results.map((r) => Object.assign({}, r));  // Copia os dados das linhas
          }else{
            // Caso contrário, usa o objeto `results` diretamente (para `OkPacket` de operações `UPDATE`, `DELETE` ou `INSERT`)
            resultsJSON.data = results
          }
        // Resolve a Promise com os resultados formatados
          resolve(resultsJSON);
        }
      });
    });

  }

  // Método para executar uma inserção no banco de dados, retornando uma Promise
  insert(sql, args){

    return new Promise((resolve, reject) => {
      // Executa a inserção
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          // Rejeita a Promise em caso de erro
          reject(err);
        } else {
          // Resolve a Promise com os resultados da inserção
          resolve(results);
        }
      });
    });

  }

  // Método para fechar a conexão com o banco de dados, retornando uma Promise
  close() {

    return new Promise((resolve, reject) => {
      // Encerra a conexão
      this.connection.end(err => {
        if (err) {
          // Rejeita a Promise em caso de erro ao fechar a conexão
          reject(err);
        } else {
          // Resolve a Promise se a conexão foi fechada com sucesso
          resolve();
        }
      });
    });

  }

}

// Exporta a classe 'HandleDBMSMySQL' para que possa ser usada em outros módulos
module.exports = HandleDBMSMySQL;