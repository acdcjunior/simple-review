<?php

$couchOptions['host'] = "192.168.1.195";
$couchOptions['port'] = 5984;

class CouchSimple {

    private $host;
    private $port;
    private $user;
    private $pass;
    private $body;

    function __construct() {
        global $couchOptions;
        foreach($couchOptions AS $key => $value) {
            $this->$key = $value;
        }
    }

    function send($method, $url, $post_data = NULL) {
        $s = fsockopen($this->host, $this->port, $errno, $errstr);
        if(!$s) {
            echo "$errno: $errstr\n";
            return false;
        }

        $request = "$method $url HTTP/1.0\r\nHost: $this->host\r\n";

        if ($this->user) {
            $request .= "Authorization: Basic ".base64_encode("$this->user:$this->pass")."\r\n";
        }

        if($post_data) {
            $request .= "Content-type: application/json\r\n";
            $request .= "Content-Length: ".strlen($post_data)."\r\n\r\n";
            $request .= "$post_data\r\n";
        }
        else {
            $request .= "\r\n";
        }

        fwrite($s, $request);
        $response = "";

        while(!feof($s)) {
            $response .= fgets($s);
        }

        list($this->headers, $this->body) = explode("\r\n\r\n", $response);
        return $this->body;
    }
}