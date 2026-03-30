<?php
// ============================================
// api/produits.php - CRUD Produits
// ============================================

require_once '../config/database.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {

    // ── GET : lister ou récupérer un produit ──────────────────
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM produits WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            echo json_encode($result ?: ['error' => 'Produit introuvable']);
        } else {
            $search = isset($_GET['q']) ? '%' . $_GET['q'] . '%' : '%';
            $stmt = $conn->prepare(
                "SELECT * FROM produits WHERE nom LIKE ? OR categorie LIKE ? ORDER BY created_at DESC"
            );
            $stmt->bind_param("ss", $search, $search);
            $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            echo json_encode($rows);
        }
        break;

    // ── POST : ajouter un produit ─────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['nom']) || empty($data['categorie']) || !isset($data['prix'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Champs requis manquants']);
            break;
        }

        $stmt = $conn->prepare(
            "INSERT INTO produits (nom, categorie, prix, stock, description) VALUES (?, ?, ?, ?, ?)"
        );
        $desc = $data['description'] ?? '';
        $stmt->bind_param(
            "ssdis",
            $data['nom'], $data['categorie'],
            $data['prix'], $data['stock'], $desc
        );
        $stmt->execute();

        http_response_code(201);
        echo json_encode(['id' => $conn->insert_id, 'message' => 'Produit ajouté avec succès']);
        break;

    // ── PUT : modifier un produit ─────────────────────────────
    case 'PUT':
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requis']); break; }

        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare(
            "UPDATE produits SET nom=?, categorie=?, prix=?, stock=?, description=? WHERE id=?"
        );
        $desc = $data['description'] ?? '';
        $stmt->bind_param(
            "ssdisi",
            $data['nom'], $data['categorie'],
            $data['prix'], $data['stock'], $desc, $id
        );
        $stmt->execute();

        echo json_encode(['message' => 'Produit mis à jour']);
        break;

    // ── DELETE : supprimer un produit ─────────────────────────
    case 'DELETE':
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requis']); break; }

        $stmt = $conn->prepare("DELETE FROM produits WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode(['message' => 'Produit supprimé']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}

$conn->close();
