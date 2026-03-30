<?php
// ============================================
// api/clients.php - Gestion des clients
// ============================================

require_once '../config/database.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {

    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("
                SELECT cl.*,
                       COUNT(c.id) AS nb_commandes,
                       COALESCE(SUM(c.total), 0) AS total_depense
                FROM clients cl
                LEFT JOIN commandes c ON cl.id = c.client_id
                WHERE cl.id = ?
                GROUP BY cl.id
            ");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode($stmt->get_result()->fetch_assoc());
        } else {
            $result = $conn->query("
                SELECT cl.*,
                       COUNT(c.id) AS nb_commandes,
                       COALESCE(SUM(c.total), 0) AS total_depense
                FROM clients cl
                LEFT JOIN commandes c ON cl.id = c.client_id
                GROUP BY cl.id
                ORDER BY total_depense DESC
            ");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['nom']) || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nom et email requis']);
            break;
        }

        $stmt = $conn->prepare(
            "INSERT INTO clients (nom, email, telephone, adresse) VALUES (?, ?, ?, ?)"
        );
        $tel  = $data['telephone'] ?? '';
        $adr  = $data['adresse']   ?? '';
        $stmt->bind_param("ssss", $data['nom'], $data['email'], $tel, $adr);
        $stmt->execute();

        http_response_code(201);
        echo json_encode(['id' => $conn->insert_id, 'message' => 'Client ajouté']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}

$conn->close();
