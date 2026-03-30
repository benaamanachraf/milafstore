<?php
// ============================================
// api/commandes.php - Gestion des commandes
// ============================================

require_once '../config/database.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {

    // ── GET : lister les commandes avec client et produits ────
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("
                SELECT c.*, cl.nom AS client_nom, cl.email AS client_email,
                       GROUP_CONCAT(p.nom SEPARATOR ', ') AS produits
                FROM commandes c
                JOIN clients cl ON c.client_id = cl.id
                LEFT JOIN commande_produits cp ON c.id = cp.commande_id
                LEFT JOIN produits p ON cp.produit_id = p.id
                WHERE c.id = ?
                GROUP BY c.id
            ");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode($stmt->get_result()->fetch_assoc());
        } else {
            $result = $conn->query("
                SELECT c.*, cl.nom AS client_nom,
                       GROUP_CONCAT(p.nom SEPARATOR ', ') AS produits
                FROM commandes c
                JOIN clients cl ON c.client_id = cl.id
                LEFT JOIN commande_produits cp ON c.id = cp.commande_id
                LEFT JOIN produits p ON cp.produit_id = p.id
                GROUP BY c.id
                ORDER BY c.created_at DESC
            ");
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        }
        break;

    // ── POST : créer une commande ─────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['client_id']) || empty($data['produits'])) {
            http_response_code(400);
            echo json_encode(['error' => 'client_id et produits requis']);
            break;
        }

        // Calcul du total
        $total = 0;
        foreach ($data['produits'] as $item) {
            $stmt = $conn->prepare("SELECT prix FROM produits WHERE id = ?");
            $stmt->bind_param("i", $item['produit_id']);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $total += $row['prix'] * $item['quantite'];
        }

        // Référence unique
        $ref = 'CMD-' . strtoupper(substr(uniqid(), -6));
        $date = date('Y-m-d');

        $stmt = $conn->prepare(
            "INSERT INTO commandes (reference, client_id, total, statut, date_commande) VALUES (?, ?, ?, 'en attente', ?)"
        );
        $stmt->bind_param("sids", $ref, $data['client_id'], $total, $date);
        $stmt->execute();
        $cmd_id = $conn->insert_id;

        // Insérer les produits liés
        foreach ($data['produits'] as $item) {
            $stmt2 = $conn->prepare("SELECT prix FROM produits WHERE id = ?");
            $stmt2->bind_param("i", $item['produit_id']);
            $stmt2->execute();
            $row = $stmt2->get_result()->fetch_assoc();

            $stmt3 = $conn->prepare(
                "INSERT INTO commande_produits (commande_id, produit_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)"
            );
            $stmt3->bind_param("iiid", $cmd_id, $item['produit_id'], $item['quantite'], $row['prix']);
            $stmt3->execute();
        }

        http_response_code(201);
        echo json_encode(['id' => $cmd_id, 'reference' => $ref, 'total' => $total, 'message' => 'Commande créée']);
        break;

    // ── PUT : confirmer ou annuler une commande ───────────────
    case 'PUT':
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requis']); break; }

        $data = json_decode(file_get_contents('php://input'), true);
        $statuts_valides = ['en attente', 'confirmée', 'annulée'];

        if (!in_array($data['statut'] ?? '', $statuts_valides)) {
            http_response_code(400);
            echo json_encode(['error' => 'Statut invalide']);
            break;
        }

        $stmt = $conn->prepare("UPDATE commandes SET statut = ? WHERE id = ?");
        $stmt->bind_param("si", $data['statut'], $id);
        $stmt->execute();

        echo json_encode(['message' => 'Statut mis à jour']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}

$conn->close();
