<?php
$host = "localhost";
$user = "root";   // user 
$pass = "";       // mật khẩu 
$db   = "warehouse_db";  

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>
