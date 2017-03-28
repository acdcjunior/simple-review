<?php
require_once "connection.php";

function getResults($stmt) {
    // http://stackoverflow.com/a/12632827/1850609
    // http://stackoverflow.com/a/6241477/1850609

    // initialise some empty arrays
    $fields = $results = array();

    // Get metadata for field names
    $meta = $stmt->result_metadata();

    // This is the tricky bit dynamically creating an array of variables to use to bind the results
    while ($field = $meta->fetch_field()) {
        $var = $field->name;
        $$var = null;
        $fields[$var] = &$$var;
    }

    // Bind Results
    call_user_func_array(array($stmt,'bind_result'),$fields);

    // Fetch Results
    $i = 0;
    while ($stmt->fetch()) {
        $results[$i] = array();
        foreach($fields as $k => $v) {
            $results[$i][$k] = $v;
        }
        $i++;
    }
    return $results;
}

function setParams($stmt, $params) {
    if (sizeof($params) < 1) {
        return;
    }
    $types = '';
    foreach($params as $param) {
        if(is_int($param)) {
            $types .= 'i';              //integer
        } elseif (is_float($param)) {
            $types .= 'd';              //double
        } elseif (is_string($param)) {
            $types .= 's';              //string
        } else {
            $types .= 'b';              //blob and unknown
        }
    }
    array_unshift($params, $types);

    call_user_func_array(array($stmt,'bind_param'), refValues($params));
}

function refValues($arr){
    http://stackoverflow.com/a/16120923/1850609
    if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
    {
        $refs = array();
        foreach($arr as $key => $value) {
            $refs[$key] = &$arr[$key];
        }
        return $refs;
    }
    return $arr;
}

class Repo {

    public function __construct($mysqli)
    {
        $this->mysqli = $mysqli;
    }

    public function prepare() {
        $stmt = $this->mysqli->prepare("INSERT INTO testtable VALUES (?,?,?)");
        // prepare() can fail because of syntax errors, missing privileges, ....
        if ( false===$stmt ) {
            // and since all the following operations need a valid/ready statement object
            // it doesn't make sense to go on
            // you might want to use a more sophisticated mechanism than die()
            // but's it's only an example
            die('prepare() failed: ' . htmlspecialchars($this->mysqli->error));
        }
        return $stmt;
    }
}
function insert($sql, $params)
{
    global $db;
    $stmt = $db->prepare($sql);
    setParams($stmt, $params);
    $stmt->execute();
    $stmt->close();
}

function select($sql, $params)
{
    global $db;
    $stmt = $db->prepare($sql);
    setParams($stmt, $params);
    $stmt->execute();
    $results = getResults($stmt);
    $stmt->close();
    return $results;
}