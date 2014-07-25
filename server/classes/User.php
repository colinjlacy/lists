<?php
/**
 * Created by PhpStorm.
 * User: colinjlacy
 * Date: 7/7/14
 * Time: 10:15 AM
 */

namespace classes;

require_once "Data.php";

class User extends Data {

    public function set_user($google_id, $email, $display_name) {

        // create a query that checks whether or not the user exists in the database
        $sql = "SELECT * FROM Users WHERE google_id = $google_id";

        // make the database connection
        $test_result = $this->select($sql);

        // set an empty variable that will contain test results
        $exists = mysqli_fetch_assoc($test_result);

        // if the result of the string is false
        if (!$exists) {

            // create the query that will insert the Google ID and email address into the database
            $insert = "INSERT INTO Users (google_id, email, display_name) VALUES ($google_id, '$email', '$display_name')";

            // connect to the database
            $user_added = $this->insert($insert);

            // if that worked
            if ($user_added) {

                // get the lists shared with them from the holding database
                $add_shared_lists = $this->get_shared_lists($email, $user_added);

                if ($add_shared_lists) {

                    // you're done here
                    return true;

                } else {

                    // let them know something went wrong
                    return false;

                }


            } else {

                // if not, let someone know
                return "something went wrong while inserting the user into the database";

            }

        } else {

            // you're done here
            return "User data retrieved! Google ID:" . $exists['google_id'] . "; Email: " . $exists['email'];

        }

    }

    private function get_shared_lists($email, $id) {

        $select = "SELECT * FROM Shared WHERE email = '$email'";

        $get_shared = $this->select($select);

        if (!$get_shared) {

            return "Something went terribly wrong";

        } else {

            $sharedListArray = [];

            // loop through each row in the returned object
            while($row = $get_shared -> fetch_assoc()) {

                // and insert it into the blank array
                $sharedListArray[] = $row['list_id'];

            }

            $serializedSharedListArray = serialize($sharedListArray);

            $update = "UPDATE Users SET edit_access = '$serializedSharedListArray' WHERE email = '$email' and id = $id";

            $insert_shared = $this->update($update);

            if ($insert_shared) {

                $delete = "DELETE FROM Shared WHERE email = '$email'";

                $deleted_holding = $this->select($delete);

                if ($deleted_holding) {

                    return true;

                } else {

                    return false;

                }

            } else {

                return false;

            }

        }

    }

}