<?php
$host = gethostname();
$db = new mysqli("mysql.hostinger.com.br", "u910267182_user", "Y=w95aHm8j12pAsW:2", 'u910267182_quali');

if (mysqli_connect_errno()) {
    die("Connect failed: ". mysqli_connect_error());
}


function rest($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
//    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
//    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'PRIVATE-TOKEN: zZKohysiaQwizBySUF2N'
    ));

    $result = curl_exec($curl);

    curl_close($curl);

    return json_decode($result);
}