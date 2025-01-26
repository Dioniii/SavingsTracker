<?php
include('connect.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Savings Tracker</title>
</head>

<body>
    <form action="index.php" method="post">
        <h2>Register</h2>
        <label for="">First Name:</label> <br>
        <input type="text" name="firstName"><br>
        <label for="">Last Name:</label><br>
        <input type="text" name="lastName"><br>
        <label for="">Email:</label><br>
        <input type="text" name="email"><br>
        <label for="">Password:</label><br>
        <input type="password" name="password"><br> <br>
        <input type="submit" name="Registersubmit" value="Register">
    </form>
    <hr>


    <form action="index.php" method="post">
        <h2>Login</h2>
        <label for="">Email</label> <br>
        <input type="text" name="loginemail"><br>
        <label for="">Password</label> <br>
        <input type="password" name="loginPassword"><br> <br>
        <input type="submit" name="Loginsubmit" value="Login">
    </form>

</body>

</html>
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
?>