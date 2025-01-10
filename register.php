<?php

include 'connect.php';

if (isset($_POST['signUp'])) {
    // Sanitize inputs
    $firstName = htmlspecialchars($_POST['fName']);
    $lastName = htmlspecialchars($_POST['lName']);
    $email = htmlspecialchars($_POST['email']);
    $password = $_POST['password'];

    // Secure password hashing
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Check if email already exists
    $checkEmail = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkEmail);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Email Address Already Exists!";
    } else {
        // Insert new user
        $insertQuery = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssss", $firstName, $lastName, $email, $passwordHash);

        if ($stmt->execute()) {
            header("Location: index.php");
            exit();
        } else {
            echo "Registration failed. Please try again later.";
        }
    }
    $stmt->close();
}

if (isset($_POST['signIn'])) {
    $email = htmlspecialchars($_POST['email']);
    $password = $_POST['password'];

    // Query user by email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['email'] = $row['email'];
            header("Location: homepage.php");
            exit();
        } else {
            echo "Incorrect Email or Password!";
        }
    } else {
        echo "User not found!";
    }
    $stmt->close();
}

$conn->close();
