// api/routes/loans.js

// Importa o módulo 'express'
var express = require('express');

// Cria um roteador usando o 'express'
var router = express.Router();

// Importa o modelo 'ModelLoans'
var ModelLoans = require('../model/ModelLoans');

// Cria uma instância de 'ModelLoans'
var _ModelLoans = new ModelLoans();

// Função para formatar as datas no formato "DD/MM/AAAA"
const formatarData = (data) => {
  const dia = String(data.getDate()).padStart(2, '0'); // Se o dia tiver apenas um dígito (por exemplo, "5"), padStart(2, '0') adiciona um zero à esquerda, tornando "05".
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Adiciona 1 porque os meses são indexados a partir de 0
  const ano = data.getFullYear();
  const myHour = data.getHours();
  const myMinute = data.getMinutes();
  const mySecond = data.getSeconds();
  return `${dia}/${mes}/${ano} ${myHour}:${myMinute}:${mySecond}`;
}

// Define a rota para '/'
router.route('/')
  // Método GET para obter empréstimos
  .get(function (req, res, next) {
    _ModelLoans.getLoans(null, null)
      .then(resultJSON => {
        res.status(200).json(resultJSON).end();
      })
      .catch(err => {
        console.error('Erro na requisição `get` para o recurso: ' + err);
        res.status(500).send(err).end();
      });
  })
  // Método POST para criar um novo empréstimo
  .post(function (req, res) {
    const dataEmprestimo = new Date();
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataEmprestimo.getDate() + 25); // Adiciona 25 dias
    const dataEmprestimoFormatted = formatarData(dataEmprestimo);
    const dataDevolucaoFormatted = formatarData(dataDevolucao);
    // Aqui estamos criando o empréstimo com os dados corretos
    _ModelLoans.postLoans(req.body.livro_idlivro, req.body.usuario_idusuario, dataEmprestimoFormatted, dataDevolucaoFormatted)
      .then(resultJSON => {
        res.status(201).json("Empréstimo realizado com sucesso. Você tem 25 dias para realizar a devolução do livro").end();
      })
      .catch(err => {
        console.error('Erro na requisição `post` para o recurso: ' + err);
        res.status(500).json({ error: '' + err }).end();
      });
  });

// Define a rota PUT para devolver um empréstimo pelo ID
router.put('/devolver/:id', function (req, res) {
  const emprestimoId = req.params.id;
  const data_devolucao = new Date();
  const dataDevolucaoFormatted = formatarData(data_devolucao); // Data da devolução no momento do retorno

  _ModelLoans.putLoans(emprestimoId, dataDevolucaoFormatted)
    .then(resultJSON => {
      res.status(200).json("Devolução realizada com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `Devolução` para o recurso: ' + err);
      res.status(500).json({ error: 'Erro na requisição na Devolução para o recurso:' + err }).end();
    });
});

// Define a rota DELETE para deletar um empréstimo pelo ID
router.delete('/:id', (req, res) => {
  const emprestimoId = req.params.id;
  _ModelLoans.deleteLoans(emprestimoId)
    .then(resultJSON => {
      res.status(202).json("Empréstimo deletado com sucesso!").end();
    })
    .catch(err => {
      console.error('Erro na requisição `delete` para o recurso: ' + err);
      res.status(500).json({ error: 'Erro na requisição `delete` para o recurso: ' + err }).end();
    });
});

// Define a rota GET para gerar um relatório
router.get('/relatorio', async (req, res) => {
  try {
    const resultJSON = await _ModelLoans.getBooksAndUsersReports();
    res.status(200).json(resultJSON).end();
  } catch (err) {
    console.error('Erro ao gerar o relatório :', err);
    res.status(500).json({ error: 'Erro ao gerar o relatório :' + err }).end();
  }
});

// Exporta o roteador
module.exports = router;
