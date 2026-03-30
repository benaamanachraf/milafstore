<?php
// ============================================
// api/stats.php - Statistiques dashboard
// ============================================

require_once '../config/database.php';

$conn = getConnection();

$stats = [];

// Chiffre d'affaires (commandes confirmées)
$r = $conn->query("SELECT COALESCE(SUM(total),0) AS ca FROM commandes WHERE statut='confirmée'");
$stats['chiffre_affaires'] = (float)$r->fetch_assoc()['ca'];

// Nombre de produits
$r = $conn->query("SELECT COUNT(*) AS total FROM produits");
$stats['nb_produits'] = (int)$r->fetch_assoc()['total'];

// Nombre de commandes + en attente
$r = $conn->query("SELECT COUNT(*) AS total FROM commandes");
$stats['nb_commandes'] = (int)$r->fetch_assoc()['total'];

$r = $conn->query("SELECT COUNT(*) AS total FROM commandes WHERE statut='en attente'");
$stats['commandes_en_attente'] = (int)$r->fetch_assoc()['total'];

// Nombre de clients
$r = $conn->query("SELECT COUNT(*) AS total FROM clients");
$stats['nb_clients'] = (int)$r->fetch_assoc()['total'];

// 5 dernières commandes
$r = $conn->query("
    SELECT c.reference, c.total, c.statut, c.date_commande,
           cl.nom AS client_nom
    FROM commandes c
    JOIN clients cl ON c.client_id = cl.id
    ORDER BY c.created_at DESC
    LIMIT 5
");
$stats['dernieres_commandes'] = $r->fetch_all(MYSQLI_ASSOC);

echo json_encode($stats);
$conn->close();
