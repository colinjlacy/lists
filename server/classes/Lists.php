<?php
/**
 * Created by PhpStorm.
 * User: colinjlacy
 * Date: 7/7/14
 * Time: 12:47 PM
 */

namespace classes;

require_once "Data.php";

class Lists extends Data {

    public function get_lists($google_id) {

        // create a query that retrieves all lists from the database
        $sql = "SELECT * FROM Lists WHERE google_id = $google_id";

        // execute the query and save the returned object
        $list_query = $this->select($sql);

        // if no returned object
        if(!$list_query) {

            // let somebody know
            die('Could not retrieve list data');

        // if there is a returned object
        } else {

            // create a blank array
            $dataToBeEncoded = array();

            // loop through each row in the returned object
            while($row = $list_query -> fetch_assoc()) {

                // and insert it into the blank array
                $dataToBeEncoded[] = $row;

            }

            // then return a json_encoded version of the data to the app
            return $dataToBeEncoded;

        }

    }

    public function get_shared_lists($google_id) {

        // create a query that retrieves the User's info from the database
        $sql = "SELECT * FROM Users WHERE google_id = $google_id";

        // execute the query and save the returned User object
        $user = $this->select($sql);

        // if no returned object
        if(!$user) {

            // let somebody know
            die('Could not retrieve user data');

        // if there is a returned object
        } else {

            // create a blank array which will store the shared lists
            $dataToBeEncoded = array();

            // store the value of the unserialized shared list array
            $user_info = mysqli_fetch_assoc($user);
            $shared_lists = unserialize($user_info['edit_access']);

//            return $shared_lists;

            // loop through the share list IDs
            foreach($shared_lists as $list_id) {

                // run the database search for the current list
                $list = $this->simple_list_select($list_id);

                if ($list != null) {

                    // add the current list to the array that will be returned
                    array_push($dataToBeEncoded, $list);

                }

            }

            // then return a json_encoded version of the data to the app
            return $dataToBeEncoded;

        }

    }

    private function simple_list_select($id) {

        // write the database search inquiry
        $select = "SELECT * FROM Lists WHERE id = '$id'";

        // search the database for this list
        $result = $this->select($select);

        if (!$result) {

            // if no connection made, let someone know
            return "Could not access list bia simple select";

        } else {

            // else save the associative array of the result
            $row = mysqli_fetch_assoc($result);

            // and return it
            return $row;
        }

    }

    public function check_id($google_id, $list_id) {

        $exists = "SELECT 1 FROM Lists WHERE id = $list_id AND google_id = '$google_id'";

        $exists_query = $this->select($exists);

        $test_result = mysqli_fetch_assoc($exists_query);

        if (!$test_result) {

            print_r($exists_query);
            // let somebody know
            die("Could not authenticate ownership for list:" . $list_id . " with id: " . $google_id);

        } else {

            return true;

        }
    }

    public function get_items($list_id) {

        // create a query that checks whether or not the user exists in the database
        $sql = "SELECT * FROM List_Items WHERE list_id = '$list_id'";

        // execute the query and save the returned object
        $list_query = $this->select($sql);

        // if no returned object
        if(!$list_query) {

            // let somebody know
            die('Could not retrieve data ' . mysqli_error($con));

            // if there is a returned object
        } else {

            // create a blank array
            $dataToBeEncoded = array();

            // loop through each row in the returned object
            while($row = $list_query -> fetch_assoc()) {

                // and insert it into the blank array
                $dataToBeEncoded[] = $row;

            }

            // then return a json_encoded version of the data to the app
            return json_encode($dataToBeEncoded);

        }

    }

    public function create_list($google_id, $title, $category, $items) {

        // determine if we're going to be adding a category to this list
        if (isset($category)) {

            // if there is a category set, map it to the insert values
            $insert = "INSERT INTO Lists (google_id, title, category) VALUES ($google_id, '$title', '$category')";

        } else {

            // if not, map insert values without it
            $insert = "INSERT INTO Lists (google_id, title) VALUES ($google_id, '$title')";

        }

        $insert_list = $this->insert($insert);

        if(!$insert_list) {

            // let somebody know
            die('Could not insert list');

        // if there is a returned object
        } else {

            // use the list's database id to execute the add_items() function
            $this->add_items($insert_list, $items);

            return $insert_list;

        }

    }

    public function edit_list($list_id, $items) {

        // delete the old list items for this list
        $this->delete_items($list_id);

        // add the new list items to the database
        $this->add_items($list_id, $items);

        // return the list ID
        return $list_id;

    }

    public function delete_items($list_id) {
        // create a query that will delete the old list items
        $delete = "DELETE FROM List_Items WHERE list_id = $list_id";

        // run the query
        $delete_result = $this->select($delete);

        // if it didn't work...
        if (!$delete_result) {

            // Let someone know
            die("Could not delete list items from " . $list_id);

        }

    }

    public function delete_list($list_id) {

        // create a query that will delete the list from the database
        $delete = "DELETE FROM Lists WHERE id = $list_id";

        // run the query
        $delete_result = $this->select($delete);

        // if it didn't work...
        if (!$delete_result) {

            // Let someone know
            die("Could not delete old items from " . $list_id);

        } else {

            // delete the list items that went along with that list
            $this->delete_items($list_id);

            // return a true
            return true;

        }
    }

    public function add_items($list_id, $items) {

        // create the database query that will insert list items into the database
        $insert = "INSERT INTO List_Items (list_id, name, done) VALUES ";

        // set an iterator as 1 (not 0 because I want the loop to match the count - not index - of the array item)
        $i = 1;

        // get the count of items
        $count = count($items);

        // loop through the items, adding each to the query string
        foreach($items as $item) {

            // escape any gamebreaking characters
            $name = mysql_real_escape_string($item['name']);
            $done = isset($item['done']) ? $item['done'] : false;

            // append item info to the query, along with the relational grocery_list id
            $insert .= "('$list_id', '$name', '$done')";

            // if the incremented value is still less than the count of the items array, add some string glue
            if ($i < $count) {
                $insert .= ", ";
            }

            // increment
            $i++;

        }

        $insert_items = $this->insert($insert);

        if(!$insert_items) {

            print_r($items);

            // let somebody know
            die('Could not insert items');

            // if there is a returned object
        }

    }

}