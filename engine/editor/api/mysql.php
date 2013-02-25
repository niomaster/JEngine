<?php
    error_reporting(0);

    // TODO: create user.
    mysql_connect('localhost', 'jengine', '<placeholder>') or mysqlError();

    function query($query, $params = array()) {
        $params['prefix'] = 'jengine';

        foreach($params as $key => $replacement) {
            $query = str_replace('{' . $key . '}', '"' . mysql_real_escape_string($replacement) . '"', $query);
        }

        return mysql_query($query);
    }

    function fetchOne($query, $params = array()) {
        $result = query($query, $params);

        if($result === false) {
            return false;
        }

        return mysql_fecth_assoc($result);
    }

    function fetchAll($query, $params = array()) {
        $result = query($query, $params);

        if($result === false) {
            return false;
        }

        $all = array();

        while($row = mysql_fetch_assoc($result)) {
            $all[] = $row;
        }

        return $all;
    }

    function hashData($data, $salt) {
        return hash('sha512', $data . $salt);
    }

    function generateSalt() {
        return hashData(microtime(), '#yoloswagg');
    }

    function error($error) {
        //die(json_encode(array('error' => ($error))));
    }

    function mysqlError() {
        error('MySQL Error: ' . mysql_error());
    }

    function param($param) {
        if(isset($_GET[$param])) {
            return $_GET[$param];
        } else if(isset($_POST[$param])) {
            return $_POST[$param];
        } else {
            error('Parameter ' . $param . ' not given.');
        }
    }
?>