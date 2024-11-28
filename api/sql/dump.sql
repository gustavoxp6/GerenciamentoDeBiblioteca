-- Active: 1730852531018@@127.0.0.1@3306@biblioteca
-- -----------------------------------------------------
-- Criação do usuario admin
-- Obs:. com servidor ativo, a criaçãodo do banco e do usuario deve ser no MySQL workbank e depois criar a conexão aqui no vscode.
-- Ou execute tudo no WorkBank.
-- -----------------------------------------------------
-- Cria um banco de dados chamado 'biblioteca'
create database biblioteca;
-- Cria um novo usuário chamado 'admin' com senha 'admin' e permite acesso de qualquer host
create user 'admin'@'%' identified WITH mysql_native_password by 'admin';

-- Concede todos os privilégios no banco de dados 'biblioteca' ao usuário 'admin'
grant all privileges on biblioteca.* to 'admin'@'%';

-- -----------------------------------------------------
-- Permissão de acesso para o usuario admin
-- Obs:. só funcionará aqui no Vscode, se o banco de dados já estiver criado.
-- -----------------------------------------------------

use biblioteca;
CREATE TABLE IF NOT EXISTS `biblioteca`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `endereco` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `biblioteca`.`livro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biblioteca`.`livro` (
  `idlivro` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(80) NOT NULL,
  `autor` VARCHAR(80) NOT NULL,
  `genero` VARCHAR(45) NOT NULL,
  `ano_publicacao` INT NOT NULL,
  PRIMARY KEY (`idlivro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `biblioteca`.`emprestimo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biblioteca`.`emprestimo` (
  `idemprestimo` INT NOT NULL AUTO_INCREMENT,
  `data_emprestimo` char(10) NOT NULL,
  `data_devolucao` char(10) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `livro_idlivro` INT NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  PRIMARY KEY (`idemprestimo`),
  INDEX `fk_emprestimo_livro_idx` (`livro_idlivro` ASC) VISIBLE,
  INDEX `fk_emprestimo_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_emprestimo_livro`
    FOREIGN KEY (`livro_idlivro`)
    REFERENCES `biblioteca`.`livro` (`idlivro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_emprestimo_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `biblioteca`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


select * from biblioteca.emprestimo;
