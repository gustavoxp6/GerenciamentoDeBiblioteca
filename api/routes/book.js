// Importa o módulo 'express'
var express = require('express');
// Cria um roteador usando o 'express'
var router = express.Router();
// Importa o modelo 'ModelBook'
var ModelBook = require('../model/ModelBook');
// Cria uma instância de 'ModelBook'
var _ModelBook = new ModelBook();
// Define a rota para '/'

router.route('/')
  // Método GET para obter livros
  .get(function(req, res, next) {
    _ModelBook.getBook(null, null)
      .then(resultJSON => {
        res.status(200).json(resultJSON).end();
      })
      .catch(err => {
        console.error('Erro na requisição `get` para o recurso: ' + err);
        res.status(500).json({error: 'Erro na requisição `get` para o recurso: ' + err}).end();
      });
  })
  // Método POST para inserir um novo livro
  .post(function(req, res) {
    _ModelBook.postBook(req.body.titulo, req.body.autor, req.body.genero, parseInt(req.body.ano_publicacao, 10))
      .then(resultJSON => {
        res.status(201).json("Livro Inserido com sucesso!").end();
      })
      .catch(err => {
        console.error('Erro na requisição `post` para o recurso: ' + err);
        res.status(500).json({error: 'Erro na requisição `post` para o recurso: ' + err}).end();
      });
  });

// Define a rota PUT para atualizar um livro pelo ID
router.put('/:id', function(req, res) {
  const livroId = req.params.id;
  _ModelBook.putBook(livroId, req.body.titulo, req.body.autor, req.body.genero, parseInt(req.body.ano_publicacao, 10))
    .then(resultJSON => {
      res.status(200).json("Livro Atualizado com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `put` para o recurso: ' + err);
      res.status(500).json({error: 'Erro na requisição `put` para o recurso: ' + err}).end();
    });
});

// Define a rota DELETE para deletar um livro pelo ID
router.delete('/:id', (req, res) => {
  const livroId = req.params.id;
  _ModelBook.deleteBook(livroId)
    .then(resultJSON => {
      res.status(202).json("Livro Deletado com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `delete` para o recurso: ' + err);
      res.status(500).json({error: 'Erro na requisição `delete` para o recurso: ' + err}).end();
    });
});

// Exporta o roteador
module.exports = router;
