<?php
/**
 * Created by PhpStorm.
 * User: colinjlacy
 * Date: 7/7/14
 * Time: 10:18 AM
 */

namespace classes;


class Data {

    private function set_concection() {
        $db = "lists";
        $usr = "root";
        $psd = 'root';
        $hst = 'localhost';

        $con = mysqli_connect($hst, $usr, $psd, $db);

        return $con;
    }

    // pass a MySQLi SELECT command string to the database and return the result rows.
    public function select($sql) {

        $con = $this->set_concection();

        // test the connection, and if no connection...
        if(!$con) {

            // let somebody know
            die('Could not connect: ' . mysqli_error($con));

        }

        return mysqli_query($con, $sql);

    }

    // pass a MySQLi INSERT command string to the database and return the inserted row ID.
    public function insert($sql) {

        $con = $this->set_concection();

        // test the connection, and if no connection...
        if(!$con) {

            // let somebody know
            die('Could not connect: ' . mysqli_error($con));

        }

        mysqli_query($con, $sql);

        return mysqli_insert_id($con);

    }

    // pass a MySQLi UPDATE command string to the database and return the inserted row ID.
    public function update($sql) {

        $con = $this->set_concection();

        // test the connection, and if no connection...
        if(!$con) {

            // let somebody know
            die('Could not connect: ' . mysqli_error($con));

        }

        return mysqli_query($con, $sql);

    }
}