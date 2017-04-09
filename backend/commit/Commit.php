<?php

class Commit
{
    const EMAILS_SERVIDORES = array('a@s', 'b@s', 'c@s');
    const EMAILS_ESTAGIARIOS = array('a@e', 'b@e', 'c@e');

    public $sha;
    public $message;
    public $author_email;
    public $created_at;
    public $revisor_email;
    public $revisado;
    public $historico;

    public function __construct($sha, $title, $message, $author_email, $created_at)
    {
        $this->_id = $sha;
        $this->type = 'commit';

        $this->sha = $sha;
        $this->title = $title;
        $this->message = $message;
        $this->author_email = $author_email;
        $this->created_at = $created_at;

        $this->revisor_email = $this->calcularRevisor();
        $this->revisado = false;
        $this->historico = array(
            "Revisor $this->revisor_email atribuído automaticamente pelo sistema."
        );
    }

    public function calcularRevisor()
    {
        if (in_array($this->author_email, self::EMAILS_SERVIDORES)) {
            return $this->sortearExceto(self::EMAILS_SERVIDORES, $this->author_email);
        }
        if (in_array($this->author_email, self::EMAILS_ESTAGIARIOS)) {
            return $this->sortearExceto(self::EMAILS_ESTAGIARIOS, $this->author_email);
        }
        $todosEmails = array_merge(self::EMAILS_SERVIDORES, self::EMAILS_ESTAGIARIOS);
        return $this->sortearExceto($todosEmails, $this->author_email);
    }

    public function sortearExceto($lista, $autor)
    {
        $removerAutor = function ($value) use ($autor) {
            return $value !== $autor;
        };

        $listaFiltrada = array_filter($lista, $removerAutor);

        $k = array_rand($listaFiltrada);
        return $listaFiltrada[$k];
    }

}