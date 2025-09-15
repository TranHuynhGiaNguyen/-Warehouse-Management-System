<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['user_id']) || empty($_SESSION['loggedin'])) {
    header("Location: /WarehouseManagement/login.php");
    exit();
}
?>