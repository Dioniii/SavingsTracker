<?php
include('connect.php');
include('loginRegister.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
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