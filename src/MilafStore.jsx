import { useState, useEffect } from "react";

// ── Data initiale ──────────────────────────────────────────────
const INIT_PRODUCTS = [
  { id: 1, nom: "T-shirt coton bio", cat: "Vêtements", prix: 149, stock: 42 },
  { id: 2, nom: "Sneakers urban", cat: "Chaussures", prix: 399, stock: 15 },
  { id: 3, nom: "Casquette logo", cat: "Accessoires", prix: 89, stock: 60 },
  { id: 4, nom: "Écouteurs BT", cat: "Électronique", prix: 299, stock: 8 },
  { id: 5, nom: "Veste bomber", cat: "Vêtements", prix: 549, stock: 20 },
];

const INIT_ORDERS = [
  { id: "CMD-001", client: "Amine Bensalem", produit: "T-shirt coton bio", total: 149, date: "2025-03-20", statut: "confirmée" },
  { id: "CMD-002", client: "Sara El Alaoui", produit: "Sneakers urban", total: 399, date: "2025-03-21", statut: "en attente" },
  { id: "CMD-003", client: "Youssef Tazi", produit: "Écouteurs BT", total: 299, date: "2025-03-22", statut: "confirmée" },
  { id: "CMD-004", client: "Nora Benali", produit: "Veste bomber", total: 549, date: "2025-03-23", statut: "en attente" },
  { id: "CMD-005", client: "Karim Idrissi", produit: "Casquette logo", total: 89, date: "2025-03-25", statut: "annulée" },
];

const INIT_CLIENTS = [
  { nom: "Amine Bensalem", email: "amine@gmail.com", tel: "06 12 34 56 78", cmds: 3, total: 687 },
  { nom: "Sara El Alaoui", email: "sara@gmail.com", tel: "06 98 76 54 32", cmds: 1, total: 399 },
  { nom: "Youssef Tazi", email: "youssef@gmail.com", tel: "06 55 44 33 22", cmds: 2, total: 448 },
  { nom: "Nora Benali", email: "nora@gmail.com", tel: "06 77 88 99 00", cmds: 1, total: 549 },
  { nom: "Karim Idrissi", email: "karim@gmail.com", tel: "06 11 22 33 44", cmds: 1, total: 89 },
];

const CATEGORIES = ["Vêtements", "Chaussures", "Accessoires", "Électronique", "Maison"];

// ── Utilitaires ────────────────────────────────────────────────
const initials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const statusStyle = (s) => {
  if (s === "confirmée") return { background: "#dcfce7", color: "#166534" };
  if (s === "en attente") return { background: "#fef9c3", color: "#854d0e" };
  return { background: "#fee2e2", color: "#991b1b" };
};

// ── Styles communs ─────────────────────────────────────────────
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 14,
    color: "#111",
    background: "#f8f8f6",
  },
  sidebar: {
    width: 210,
    background: "#fff",
    borderRight: "1px solid #e5e5e5",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "20px 20px 16px",
    fontSize: 17,
    fontWeight: 700,
    borderBottom: "1px solid #e5e5e5",
    letterSpacing: "-0.3px",
  },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto" },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e5e5e5",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 15,
    fontWeight: 500,
  },
  content: { padding: 24, flex: 1 },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    overflow: "hidden",
    marginBottom: 20,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e5e5e5",
    padding: "14px 16px",
  },
  badge: {
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    background: "#dcfce7",
    color: "#166534",
    fontWeight: 500,
  },
  pill: (active) => ({
    fontSize: 11,
    padding: "2px 9px",
    borderRadius: 20,
    fontWeight: 500,
    display: "inline-block",
    ...(active
      ? { background: "#e0f2fe", color: "#0369a1" }
      : { background: "#f1f5f9", color: "#64748b" }),
  }),
  th: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 500,
    color: "#888",
    padding: "10px 14px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fafafa",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#e0f2fe",
    color: "#0369a1",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 600,
    marginRight: 8,
    flexShrink: 0,
  },
  btn: (variant = "default") => ({
    fontSize: 12,
    padding: "6px 13px",
    borderRadius: 8,
    border: "1px solid",
    cursor: "pointer",
    fontWeight: 500,
    ...(variant === "primary"
      ? { background: "#0369a1", color: "#fff", borderColor: "#0369a1" }
      : variant === "danger"
      ? { background: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" }
      : { background: "#fff", color: "#333", borderColor: "#e0e0e0" }),
  }),
  input: {
    width: "100%",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    color: "#111",
  },
  label: { fontSize: 12, color: "#666", marginBottom: 4, display: "block" },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    width: 360,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
};

// ── Composant Avatar ───────────────────────────────────────────
const Avatar = ({ name }) => (
  <span style={styles.avatar}>{initials(name)}</span>
);

// ── Composant NavItem ──────────────────────────────────────────
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 20px",
      width: "100%",
      background: active ? "#f0f9ff" : "transparent",
      border: "none",
      borderLeft: active ? "3px solid #0369a1" : "3px solid transparent",
      color: active ? "#0369a1" : "#555",
      fontWeight: active ? 600 : 400,
      fontSize: 13,
      cursor: "pointer",
      textAlign: "left",
    }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    {label}
  </button>
);

// ── Composant StatusBadge ──────────────────────────────────────
const StatusBadge = ({ statut }) => (
  <span
    style={{
      fontSize: 11,
      padding: "3px 9px",
      borderRadius: 20,
      fontWeight: 500,
      ...statusStyle(statut),
    }}
  >
    {statut}
  </span>
);

// ── Page Dashboard ─────────────────────────────────────────────
const Dashboard = ({ products, orders, clients }) => {
  const ca = orders
    .filter((o) => o.statut === "confirmée")
    .reduce((a, o) => a + o.total, 0);
  const pending = orders.filter((o) => o.statut === "en attente").length;
  const recent = [...orders].reverse().slice(0, 5);

  const stats = [
    { label: "Chiffre d'affaires", value: `${ca.toLocaleString("fr-MA")} MAD`, sub: "+12% ce mois" },
    { label: "Produits", value: products.length, sub: "en catalogue" },
    { label: "Commandes", value: orders.length, sub: `${pending} en attente` },
    { label: "Clients", value: clients.length, sub: "enregistrés" },
  ];

  return (
    <>
      <div style={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#22c55e", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e5e5", fontSize: 13, fontWeight: 500 }}>
          Dernières commandes
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Commande", "Client", "Produit", "Montant", "Statut"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td style={styles.td}>{o.id}</td>
                <td style={{ ...styles.td, display: "flex", alignItems: "center" }}>
                  <Avatar name={o.client} />{o.client}
                </td>
                <td style={styles.td}>{o.produit}</td>
                <td style={styles.td}>{o.total} MAD</td>
                <td style={styles.td}><StatusBadge statut={o.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ── Modal Produit ──────────────────────────────────────────────
const ProductModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(
    initial || { nom: "", cat: "Vêtements", prix: "", stock: "" }
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          {initial ? "Modifier le produit" : "Ajouter un produit"}
        </div>
        {[
          { label: "Nom du produit", key: "nom", type: "text", placeholder: "Ex: Chaussures sport" },
          { label: "Prix (MAD)", key: "prix", type: "number", placeholder: "250" },
          { label: "Stock", key: "stock", type: "number", placeholder: "10" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={styles.label}>{label}</label>
            <input
              style={styles.input}
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={set(key)}
            />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Catégorie</label>
          <select style={styles.input} value={form.cat} onChange={set("cat")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button style={styles.btn()} onClick={onClose}>Annuler</button>
          <button
            style={styles.btn("primary")}
            onClick={() => form.nom && onSave(form)}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page Produits ──────────────────────────────────────────────
const Produits = ({ products, setProducts }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | product object

  const filtered = products.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (modal === "add") {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), nom: form.nom, cat: form.cat, prix: Number(form.prix), stock: Number(form.stock) },
      ]);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === modal.id
            ? { ...p, nom: form.nom, cat: form.cat, prix: Number(form.prix), stock: Number(form.stock) }
            : p
        )
      );
    }
    setModal(null);
  };

  return (
    <>
      {modal && (
        <ProductModal
          initial={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <input
          style={{ ...styles.input, maxWidth: 220 }}
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.btn("primary")} onClick={() => setModal("add")}>
          + Ajouter un produit
        </button>
      </div>
      <div style={styles.card}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Nom", "Catégorie", "Prix", "Stock", "Actions"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#888" }}>Aucun produit trouvé</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{p.nom}</td>
                  <td style={styles.td}><span style={styles.pill(true)}>{p.cat}</span></td>
                  <td style={styles.td}>{p.prix} MAD</td>
                  <td style={{ ...styles.td, color: p.stock <= 10 ? "#d97706" : "#111" }}>{p.stock}</td>
                  <td style={{ ...styles.td }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...styles.btn(), fontSize: 11, padding: "4px 10px" }} onClick={() => setModal(p)}>
                        Modifier
                      </button>
                      <button
                        style={{ ...styles.btn("danger"), fontSize: 11, padding: "4px 10px" }}
                        onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                      >
                        Suppr.
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ── Page Commandes ─────────────────────────────────────────────
const Commandes = ({ orders, setOrders }) => {
  const confirm = (id) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, statut: "confirmée" } : o))
    );

  return (
    <div style={styles.card}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["#", "Client", "Produit", "Total", "Date", "Statut", "Action"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={{ ...styles.td, fontSize: 12, color: "#888" }}>{o.id}</td>
              <td style={{ ...styles.td }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar name={o.client} />{o.client}
                </div>
              </td>
              <td style={styles.td}>{o.produit}</td>
              <td style={{ ...styles.td, fontWeight: 500 }}>{o.total} MAD</td>
              <td style={{ ...styles.td, color: "#888", fontSize: 12 }}>{o.date}</td>
              <td style={styles.td}><StatusBadge statut={o.statut} /></td>
              <td style={styles.td}>
                {o.statut === "en attente" ? (
                  <button style={{ ...styles.btn("primary"), fontSize: 11, padding: "4px 10px" }} onClick={() => confirm(o.id)}>
                    Confirmer
                  </button>
                ) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Page Clients ───────────────────────────────────────────────
const Clients = ({ clients }) => (
  <div style={styles.card}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Client", "Email", "Téléphone", "Commandes", "Total dépensé"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c.email}>
            <td style={{ ...styles.td }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar name={c.nom} />{c.nom}
              </div>
            </td>
            <td style={{ ...styles.td, color: "#666" }}>{c.email}</td>
            <td style={{ ...styles.td, color: "#666" }}>{c.tel}</td>
            <td style={styles.td}>{c.cmds}</td>
            <td style={{ ...styles.td, fontWeight: 500 }}>{c.total.toLocaleString("fr-MA")} MAD</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── App principale ─────────────────────────────────────────────
const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "produits", label: "Produits", icon: "📦" },
  { id: "commandes", label: "Commandes", icon: "🛒" },
  { id: "clients", label: "Clients", icon: "👤" },
];

export default function MilafStore() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [clients] = useState(INIT_CLIENTS);

  const currentPage = PAGES.find((p) => p.id === page);

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          Milaf<span style={{ color: "#0369a1" }}>Store</span>
        </div>
        <nav style={{ paddingTop: 8 }}>
          {PAGES.map((p) => (
            <NavItem
              key={p.id}
              icon={p.icon}
              label={p.label}
              active={page === p.id}
              onClick={() => setPage(p.id)}
            />
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.topbar}>
          <span>{currentPage?.label}</span>
          <span style={styles.badge}>Admin</span>
        </header>
        <main style={styles.content}>
          {page === "dashboard" && (
            <Dashboard products={products} orders={orders} clients={clients} />
          )}
          {page === "produits" && (
            <Produits products={products} setProducts={setProducts} />
          )}
          {page === "commandes" && (
            <Commandes orders={orders} setOrders={setOrders} />
          )}
          {page === "clients" && <Clients clients={clients} />}
        </main>
      </div>
    </div>
  );
}
