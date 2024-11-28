// Importa o módulo 'express'
var express = require('express');

// Cria um roteador usando o 'express'
var router = express.Router();

// Importa o modelo 'ModelUser'
var ModelUser = require('../model/ModelUser');

// Cria uma instância de 'ModelUser'
var _ModelUser = new ModelUser();

// Define a rota para '/'
router.route('/')
  // Método GET para obter usuários
  .get(function(req, res, next) {
    _ModelUser.getUsuario(null, null)
      .then(resultJSON => {
        res.status(200).json(resultJSON).end();
      })
      .catch(err => {
        console.error('Erro na requisição `get` para o recurso: ' + err);
        res.status(500).json({error: 'Erro na requisição `get` para o recurso: ' + err}).end();
      });
  })
  // Método POST para criar um novo usuário
  .post(function(req, res) {
    _ModelUser.postUsuario(req.body.nome, req.body.endereco, req.body.email, req.body.telefone)
      .then(resultJSON => {
        res.status(201).json("Usuário Criado com sucesso!").end();
      })
      .catch(err => {
        console.error('Erro na requisição `post` para o recurso: ' + err);
        res.status(500).json({error: 'Erro na requisição `post` para o recurso: ' + err}).end();
      });
  });

// Define a rota PUT para atualizar um usuário pelo ID
router.put('/:id', function(req, res) {
  console.log("1", req.body.nome);
  const userId = req.params.id;
  _ModelUser.putUsuario(userId, req.body.nome, req.body.endereco, req.body.email, req.body.telefone)
    .then(resultJSON => {
      res.status(200).json("Usuário Atualizado com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `put` para o recurso: ' + err);
      res.status(500).json({error: 'Erro na requisição `put` para o recurso: ' + err}).end();
    });
});

// Define a rota DELETE para deletar um usuário pelo ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  _ModelUser.deleteUsuario(userId)
    .then(resultJSON => {
      res.status(202).json("Usuário Deletado com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `delete` para o recurso: ' + err);
      res.status(500).json({error: 'Erro na requisição `delete` para o recurso: ' + err}).end();
    });
});

// Exporta o roteador
module.exports = router;
