<?php
session_start();
include('logout.php');

if (!isset($_SESSION['loginemail'])) {
    header('Location: index.php');
    exit();
}

$firstName = $_SESSION['firstName'];
$lastName = $_SESSION['lastName'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saving Tracker</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <ul>
        <li><a href="#home"><?php echo "Welcome, $firstName $lastName!"; ?></a></li>
        <li style="float:right">
            <form action="main.php" method="post">
                <input type="submit" name="logout" value="Logout" class="logout">
            </form>
        </li>

    </ul>
    <form action="main.php" method="post">

        <label>Account Name</label><br>
        <input type="text" name="accountName">
        <input type="submit" name="submitAccount" value="Create Account"><br>




    </form>

</body>

</html>