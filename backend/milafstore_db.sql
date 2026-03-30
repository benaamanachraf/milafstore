-- ============================================
-- MilafStore - Base de données MySQL
-- Projet académique e-commerce
-- ============================================

CREATE DATABASE IF NOT EXISTS milafstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE milafstore;

-- ── Table produits ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Table clients ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Table commandes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(20) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    statut ENUM('en attente', 'confirmée', 'annulée') DEFAULT 'en attente',
    date_commande DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- ── Table commande_produits (relation N-N) ────────────────────
CREATE TABLE IF NOT EXISTS commande_produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- ── Données de démonstration ──────────────────────────────────
INSERT INTO produits (nom, categorie, prix, stock, description) VALUES
('T-shirt coton bio', 'Vêtements', 149.00, 42, 'T-shirt 100% coton biologique, coupe droite'),
('Sneakers urban', 'Chaussures', 399.00, 15, 'Sneakers tendance pour usage quotidien'),
('Casquette logo', 'Accessoires', 89.00, 60, 'Casquette brodée avec logo MilafStore'),
('Écouteurs BT', 'Électronique', 299.00, 8, 'Écouteurs sans fil Bluetooth 5.0'),
('Veste bomber', 'Vêtements', 549.00, 20, 'Veste bomber légère, style streetwear');

INSERT INTO clients (nom, email, telephone, adresse) VALUES
('Amine Bensalem', 'amine@gmail.com', '06 12 34 56 78', 'Casablanca, Maroc'),
('Sara El Alaoui', 'sara@gmail.com', '06 98 76 54 32', 'Rabat, Maroc'),
('Youssef Tazi', 'youssef@gmail.com', '06 55 44 33 22', 'Fès, Maroc'),
('Nora Benali', 'nora@gmail.com', '06 77 88 99 00', 'Marrakech, Maroc'),
('Karim Idrissi', 'karim@gmail.com', '06 11 22 33 44', 'Oujda, Maroc');

INSERT INTO commandes (reference, client_id, total, statut, date_commande) VALUES
('CMD-001', 1, 149.00, 'confirmée', '2025-03-20'),
('CMD-002', 2, 399.00, 'en attente', '2025-03-21'),
('CMD-003', 3, 299.00, 'confirmée', '2025-03-22'),
('CMD-004', 4, 549.00, 'en attente', '2025-03-23'),
('CMD-005', 5, 89.00, 'annulée', '2025-03-25');

INSERT INTO commande_produits (commande_id, produit_id, quantite, prix_unitaire) VALUES
(1, 1, 1, 149.00),
(2, 2, 1, 399.00),
(3, 4, 1, 299.00),
(4, 5, 1, 549.00),
(5, 3, 1, 89.00);
