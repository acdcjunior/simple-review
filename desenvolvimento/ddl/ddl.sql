CREATE DATABASE u910267182_quali;

CREATE USER 'u910267182_user'@'%%' IDENTIFIED BY 'Y=w95aHm8j12pAsW:2';
GRANT ALL ON u910267182_quali.* TO 'u910267182_user'@'%%';

CREATE TABLE `u910267182_quali`.`review_status` (
  `id` int(10) NOT NULL,
  `nome` varchar(50) NULL,
  PRIMARY KEY  (`id`)
);
INSERT into `u910267182_quali`.`review_status` values (1, 'PENDENTE');
INSERT into `u910267182_quali`.`review_status` values (2, 'REVISADO');

CREATE TABLE `u910267182_quali`.`code_review` (
  `sha` varchar(50) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `author_email` varchar(100) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `review_status` int(10) NOT NULL DEFAULT 1,
  PRIMARY KEY  (`sha`)
);
ALTER TABLE `u910267182_quali`.`code_review` ADD CONSTRAINT `fk_review_status` FOREIGN KEY (`review_status`) REFERENCES `u910267182_quali`.`review_status` (`id`)

CREATE TABLE `u910267182_quali`.`committer` (
  `email` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `avatar_url` varchar(500) NOT NULL,
  PRIMARY KEY  (`email`)
);