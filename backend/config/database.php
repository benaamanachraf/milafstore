<?php
// ============================================
// config/database.php - Connexion MySQL
// ============================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Modifie selon ton serveur
define('DB_PASS', '');            // Modifie selon ton serveur
define('DB_NAME', 'milafstore');

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $conn->set_charset('utf8mb4');

    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'Connexion échouée : ' . $conn->connect_error]));
    }
    return $conn;
}

// Headers CORS pour React (frontend séparé)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
