<?php
    require_once('User.php');

    User::createUser(param('username'), param('password'));

    
?>