<?php
    require_once('mysql.php');

    class User {
        public function __construct($data) {
            $this->id = $data['id'];
            $this->username = $data['username'];
            $this->password = $data['password'];
            $this->salt = $data['salt'];
        }

        public function authenticated($password) {
            return hashData($password, $this->salt) === $this->password;
        }

        public function toJSON() {
            return json_encode(array('id' => $this->id, 'username' => $this->username));
        }

        public static function createUser($username, $password) {
            $salt = generateSalt();

            query('INSERT INTO {prefix}_user (id, username, password, salt) VALUES (NULL, {user}, {password}, {salt});',
                array('user' => $username, 'password' => hashData($password, $salt), 'salt' => $salt));

            return User::getById(mysql_insert_id());
        }

        public static function getById($id) {
            $data = fetchOne('SELECT * FROM {prefix}_user WHERE id = {id}', array('id' => $id));

            return $data === false ? false : new User($data);
        }

        public static function getByUsername($username) {
            $data = fetchOne('SELECET * FROM {prefix}_user WHERE username = {username}', array('username' => $username));

            return $data === false ? false : new User($data);
        }
    }
?>