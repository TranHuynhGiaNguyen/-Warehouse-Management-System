<?php
// models/Product.php
class Product {
    private $db;
    private $table = 'products';

    public function __construct($database) {
        $this->db = $database->getConnection();
    }

    public function getAll() {
        $query = "SELECT p.*, c.name as category_name, 
                         COALESCE(i.quantity, 0) as current_stock
                  FROM {$this->table} p 
                  LEFT JOIN categories c ON p.category_id = c.id
                  LEFT JOIN inventory i ON p.id = i.product_id
                  ORDER BY p.name";

        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (category_id, name, sku, description, unit_price, unit, min_stock) 
                  VALUES (:category_id, :name, :sku, :description, :unit_price, :unit, :min_stock)";

        $stmt = $this->db->prepare($query);
        return $stmt->execute($data);
    }

    public function update($id, $data) {
        $query = "UPDATE {$this->table} 
                  SET category_id = :category_id, name = :name, sku = :sku, 
                      description = :description, unit_price = :unit_price, 
                      unit = :unit, min_stock = :min_stock
                  WHERE id = :id";

        $data['id'] = $id;
        $stmt = $this->db->prepare($query);
        return $stmt->execute($data);
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute(['id' => $id]);
    }
}