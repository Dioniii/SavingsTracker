<?php
session_start(); // Start or resume the session

if (!isset($_SESSION['loginemail'])) {
    // Redirect to login page if user is not logged in
    header('Location: index.php');
    exit();
}

$firstName = $_SESSION['firstName'];
$lastName = $_SESSION['lastName'];

echo "Welcome, $firstName $lastName!";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>


    <form action="main.php" method="post">
        <input type="submit" name="logout" value="Logout">
    </form>

</body>

</html>


<?php
if (isset($_POST['logout'])) {
    echo "Logout Successful";
    session_destroy();
    header("Location: index.php");
}

?>