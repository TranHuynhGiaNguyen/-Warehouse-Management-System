<?php
// controllers/ProductController.php
require_once '../models/Product.php';
require_once '../utils/Response.php';

class ProductController {
    private $product;

    public function __construct($database) {
        $this->product = new Product($database);
    }

    public function index() {
        try {
            $products = $this->product->getAll();
            Response::json(['success' => true, 'data' => $products]);
        } catch (Exception $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            // Validation
            if (!isset($data['name']) || !isset($data['sku'])) {
                Response::json(['success' => false, 'message' => 'Name and SKU are required'], 400);
                return;
            }

            $result = $this->product->create($data);
            if ($result) {
                Response::json(['success' => true, 'message' => 'Product created successfully']);
            } else {
                Response::json(['success' => false, 'message' => 'Failed to create product'], 500);
            }
        } catch (Exception $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
