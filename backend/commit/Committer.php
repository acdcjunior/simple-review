<?php

class Committer
{
    public $email;
    public $name;
    public $avatar_url;

    public function __construct($email, $name, $avatar_url)
    {
        $this->_id = $email;
        $this->type = 'committer';

        $this->email = $email;
        $this->name = $name;
        $this->avatar_url = $avatar_url;
    }

}