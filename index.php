<?php
include 'config.php';
include 'includes/header.php';

$result = $conn->query("SELECT * FROM products");
?>
<h2> Bảng Tồn Kho</h2>
<table border="1" cellpadding="8">
    <tr>
        <th>ID</th>
        <th>Tên sản phẩm</th>
        <th>Mã SKU</th>
        <th>Số lượng</th>
        <th>Giá</th>
    </tr>
    <?php while($row = $result->fetch_assoc()): ?>
    <tr>
        <td><?= $row['id'] ?></td>
        <td><?= $row['name'] ?></td>
        <td><?= $row['sku'] ?></td>
        <td><?= $row['quantity'] ?></td>
        <td><?= $row['price'] ?></td>
    </tr>
    <?php endwhile; ?>
</table>
<?php include 'includes/footer.php'; ?>
