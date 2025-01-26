<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST["Loginsubmit"])) {
        $email = filter_input(INPUT_POST, "loginemail", FILTER_SANITIZE_EMAIL);
        $password = filter_input(INPUT_POST, "loginPassword", FILTER_SANITIZE_SPECIAL_CHARS);

        if (empty($email)) {
            echo "Enter email";
        } elseif (empty($password)) {
            echo "Password needed";
        } else {
            $sql = "SELECT * FROM users WHERE email = '$email'";
            $result = mysqli_query($conn, $sql);

            if ($row = mysqli_fetch_assoc($result)) {

                if ($password == $row['password']) {

                    echo "Debug: Login successful. First Name: " . $row['firstName'];
                    $_SESSION['firstName'] = $row['firstName'];
                    $_SESSION['lastName'] = $row['lastName'];
                    $_SESSION['loginemail'] = $row['email'];
                    header('Location: main.php');
                    exit();
                } else {
                    echo "Invalid password. Please try again.";
                }
            } else {
                echo "No user found with this email.";
            }
        }
    }


    if (isset($_POST["Registersubmit"])) {
        $firstName = filter_input(INPUT_POST, "firstName", FILTER_SANITIZE_SPECIAL_CHARS);
        $lastName = filter_input(INPUT_POST, "lastName", FILTER_SANITIZE_SPECIAL_CHARS);
        $email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
        $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

        if (empty($firstName)) {
            echo "Please enter name";
        } elseif (empty($lastName)) {
            echo "Please enter lastname";
        } elseif (empty($email)) {
            echo "Please enter email";
        } elseif (empty($password)) {
            echo "Please enter password";
        } else {
            // Store password as plain text (not secure, for testing only)
            $sql = "INSERT INTO users (firstName, lastName, email, password) 
                    VALUES('$firstName','$lastName','$email','$password')";

            mysqli_query($conn, $sql);
            echo "Registered successfully";
        }
    }
}

mysqli_close($conn);
