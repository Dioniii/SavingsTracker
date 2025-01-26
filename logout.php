
<?php
if (isset($_POST['logout'])) {
    echo "Logout Successful";
    session_destroy();
    header("Location: index.php");
}

?>