<?php
require_once __DIR__ . '/../includes/auth.php'; 
include __DIR__ . '/../config.php';

// Lấy ID sản phẩm từ URL
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id > 0) {
    // Xóa sản phẩm
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        // Chuyển hướng về trang danh sách với thông báo thành công
        header("Location: products.php?message=success");
    } else {
        // Chuyển hướng về trang danh sách với thông báo lỗi
        header("Location: products.php?message=error");
    }
} else {
    // ID không hợp lệ, chuyển về trang danh sách
    header("Location: products.php");
}

exit;
?>