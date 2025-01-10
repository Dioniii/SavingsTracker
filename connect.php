<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "savingstracker";

// Create a connection
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die("Failed to connect to DB: " . $conn->connect_error);
}

// Connection is successful; no need to output anything.
