<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

mysqli_report(MYSQLI_REPORT_ALL);

$host = gethostname();
$db = new mysqli("mysql.hostinger.com.br", "u910267182_user", "Y=w95aHm8j12pAsW:2", 'u910267182_quali');

if (mysqli_connect_errno()) {
    die("Connect failed: ". mysqli_connect_error());
}