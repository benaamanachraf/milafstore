import { useState } from "react";

// ── Données produits ───────────────────────────────────────────
const PRODUCTS = [
  { id: 1, nom: "T-shirt coton bio",  cat: "Vêtements",    prix: 149, stock: 42, icon: "👕" },
  { id: 2, nom: "Sneakers urban",     cat: "Chaussures",   prix: 399, stock: 15, icon: "👟" },
  { id: 3, nom: "Casquette logo",     cat: "Accessoires",  prix: 89,  stock: 60, icon: "🧢" },
  { id: 4, nom: "Écouteurs BT",       cat: "Électronique", prix: 299, stock: 8,  icon: "🎧" },
  { id: 5, nom: "Veste bomber",       cat: "Vêtements",    prix: 549, stock: 20, icon: "🧥" },
  { id: 6, nom: "Sac à dos",          cat: "Accessoires",  prix: 199, stock: 25, icon: "🎒" },
  { id: 7, nom: "Montre sport",       cat: "Accessoires",  prix: 349, stock: 12, icon: "⌚" },
  { id: 8, nom: "Jean slim",          cat: "Vêtements",    prix: 249, stock: 30, icon: "👖" },
];

const LIVRAISON = 30;
const CATEGORIES = ["Tous", ...new Set(PRODUCTS.map((p) => p.cat))];

// ── Styles ─────────────────────────────────────────────────────
const s = {
  app:        { fontFamily: "'Segoe UI', sans-serif", fontSize: 14, color: "#111", background: "#f8f8f6", minHeight: "100vh" },
  header:     { background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54, position: "sticky", top: 0, zIndex: 10 },
  logo:       { fontSize: 17, fontWeight: 700 },
  nav:        { display: "flex", gap: 20, alignItems: "center" },
  page:       { padding: 24, maxWidth: 900, margin: "0 auto" },
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginTop: 16 },
  card:       { background: "#fff", borderRadius: 12, border: "1px solid #e5e5e5", overflow: "hidden", cursor: "pointer" },
  cardImg:    { height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, background: "#f8f8f6" },
  cardInfo:   { padding: 12 },
  cartItem:   { background: "#fff", borderRadius: 10, border: "1px solid #e5e5e5", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  summary:    { background: "#fff", borderRadius: 12, border: "1px solid #e5e5e5", padding: 16, marginTop: 16 },
  input:      { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13, boxSizing: "border-box", color: "#111", background: "#fff" },
  btnPrimary: { width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#0369a1", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", marginTop: 12 },
  btnAdd:     { fontSize: 11, padding: "5px 10px", borderRadius: 6, border: "none", background: "#0369a1", color: "#fff", cursor: "pointer" },
  pill: (active) => ({ fontSize: 12, padding: "4px 12px", borderRadius: 20, border: "1px solid", cursor: "pointer", background: active ? "#0369a1" : "#fff", color: active ? "#fff" : "#666", borderColor: active ? "#0369a1" : "#e0e0e0" }),
  navLink: (active) => ({ fontSize: 13, cursor: "pointer", padding: "4px 0", borderBottom: active ? "2px solid #0369a1" : "2px solid transparent", color: active ? "#111" : "#666", fontWeight: active ? 500 : 400 }),
  cartBtn:    { position: "relative", cursor: "pointer", background: "none", border: "1px solid #e0e0e0", borderRadius: 8, padding: "6px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 },
  badge:      { background: "#0369a1", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 },
  qtyBtn:     { width: 26, height: 26, borderRadius: 6, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  successBox: { textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, border: "1px solid #e5e5e5" },
  stepRow:    { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  step: (state) => ({ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: state === "active" ? "#0369a1" : state === "done" ? "#16a34a" : "#888", fontWeight: state === "active" ? 500 : 400 }),
  stepDot:    { width: 22, height: 22, borderRadius: "50%", border: "1.5px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 },
};

// ── Sous-composants ────────────────────────────────────────────
const Toast = ({ msg }) =>
  msg ? (
    <div style={{ position: "fixed", bottom: 20, right: 20, background: "#0369a1", color: "#fff", padding: "10px 16px", borderRadius: 8, fontSize: 13, zIndex: 999 }}>
      {msg}
    </div>
  ) : null;

const NavLink = ({ label, active, onClick }) => (
  <span style={s.navLink(active)} onClick={onClick}>{label}</span>
);

const FilterPill = ({ label, active, onClick }) => (
  <span style={s.pill(active)} onClick={onClick}>{label}</span>
);

const OrderSteps = ({ step }) => (
  <div style={s.stepRow}>
    {["Panier", "Coordonnées", "Confirmation"].map((label, i) => {
      const state = i + 1 < step ? "done" : i + 1 === step ? "active" : "idle";
      return (
        <>
          <div style={s.step(state)}>
            <div style={s.stepDot}>{state === "done" ? "✓" : i + 1}</div>
            <span>{label}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 0.5, background: "#e5e5e5" }} />}
        </>
      );
    })}
  </div>
);

// ── Page Boutique ──────────────────────────────────────────────
const Boutique = ({ onAdd }) => {
  const [filter, setFilter] = useState("Tous");
  const filtered = filter === "Tous" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);

  return (
    <div style={s.page}>
      <div style={{ fontSize: 15, fontWeight: 500 }}>Tous nos produits</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Livraison rapide partout au Maroc</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        {CATEGORIES.map((c) => <FilterPill key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />)}
      </div>
      <div style={s.grid}>
        {filtered.map((p) => (
          <div key={p.id} style={s.card}>
            <div style={s.cardImg}>{p.icon}</div>
            <div style={s.cardInfo}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{p.nom}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>{p.cat}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#0369a1" }}>{p.prix} MAD</span>
                <button style={s.btnAdd} onClick={() => onAdd(p)} disabled={p.stock === 0}>
                  {p.stock === 0 ? "Épuisé" : "+ Ajouter"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page Panier ────────────────────────────────────────────────
const Panier = ({ cart, onChangeQty, onCheckout }) => {
  const total = cart.reduce((a, i) => a + i.prix * i.qty, 0);

  if (cart.length === 0)
    return (
      <div style={{ ...s.page, textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🛒</div>
        <div style={{ color: "#888", fontSize: 13 }}>Votre panier est vide</div>
      </div>
    );

  return (
    <div style={s.page}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Mon panier</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>{cart.reduce((a, i) => a + i.qty, 0)} article(s)</div>
      {cart.map((item) => (
        <div key={item.id} style={s.cartItem}>
          <div style={{ fontSize: 28, width: 44, height: 44, background: "#f8f8f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{item.nom}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{item.prix} MAD / unité</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={s.qtyBtn} onClick={() => onChangeQty(item.id, -1)}>−</button>
            <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
            <button style={s.qtyBtn} onClick={() => onChangeQty(item.id, 1)}>+</button>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, minWidth: 70, textAlign: "right" }}>{item.prix * item.qty} MAD</span>
        </div>
      ))}
      <div style={s.summary}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 8 }}><span>Sous-total</span><span>{total} MAD</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 8 }}><span>Livraison</span><span>{LIVRAISON} MAD</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, borderTop: "1px solid #e5e5e5", paddingTop: 12, marginTop: 4 }}><span>Total</span><span>{total + LIVRAISON} MAD</span></div>
        <button style={s.btnPrimary} onClick={onCheckout}>Passer la commande →</button>
      </div>
    </div>
  );
};

// ── Page Commande ──────────────────────────────────────────────
const Commande = ({ cart, onSuccess }) => {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", adresse: "", ville: "", cp: "", paiement: "Paiement à la livraison" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const total = cart.reduce((a, i) => a + i.prix * i.qty, 0);

  const submit = () => {
    if (!form.nom || !form.email || !form.tel || !form.adresse) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    onSuccess(form);
  };

  if (cart.length === 0)
    return <div style={{ ...s.page, textAlign: "center", paddingTop: 60, color: "#888", fontSize: 13 }}>Votre panier est vide.</div>;

  return (
    <div style={s.page}>
      <OrderSteps step={2} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Vos coordonnées</div>
          {[["nom","Nom complet","Ex: Amine Bensalem"],["email","Email","amine@gmail.com"],["tel","Téléphone","06 12 34 56 78"],["adresse","Adresse de livraison","123 Rue Mohammed V"]].map(([k,label,ph])=>(
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#666", marginBottom: 4, display: "block" }}>{label}</label>
              <input style={s.input} placeholder={ph} value={form[k]} onChange={set(k)} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#666", marginBottom: 4, display: "block" }}>Ville</label>
              <input style={s.input} placeholder="Casablanca" value={form.ville} onChange={set("ville")} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#666", marginBottom: 4, display: "block" }}>Code postal</label>
              <input style={s.input} placeholder="20000" value={form.cp} onChange={set("cp")} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#666", marginBottom: 4, display: "block" }}>Mode de paiement</label>
            <select style={s.input} value={form.paiement} onChange={set("paiement")}>
              <option>Paiement à la livraison</option>
              <option>Virement bancaire</option>
            </select>
          </div>
          {error && <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{error}</div>}
          <button style={s.btnPrimary} onClick={submit}>Confirmer la commande →</button>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Récapitulatif</div>
          {cart.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: "1px solid #f0f0f0", color: "#666" }}>
              <span>{i.icon} {i.nom} ×{i.qty}</span>
              <span>{i.prix * i.qty} MAD</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, paddingTop: 10, color: "#0369a1" }}>
            <span>Total + livraison</span>
            <span>{total + LIVRAISON} MAD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page Confirmation ──────────────────────────────────────────
const Confirmation = ({ ref_, onContinue }) => (
  <div style={s.page}>
    <OrderSteps step={3} />
    <div style={s.successBox}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Commande confirmée !</div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Référence : <strong>{ref_}</strong></div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 24 }}>Vous recevrez une confirmation par email.<br />Livraison estimée : 2–4 jours ouvrables.</div>
      <button style={{ ...s.btnAdd, fontSize: 13, padding: "8px 20px" }} onClick={onContinue}>Continuer mes achats</button>
    </div>
  </div>
);

// ── App principale ─────────────────────────────────────────────
export default function BoutiqueClient() {
  const [page, setPage] = useState("boutique");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [orderRef, setOrderRef] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const addToCart = (p) => {
    setCart((prev) => {
      const ex = prev.find((x) => x.id === p.id);
      return ex ? prev.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...prev, { ...p, qty: 1 }];
    });
    showToast(p.nom + " ajouté au panier !");
  };

  const changeQty = (id, delta) => {
    setCart((prev) => prev.map((x) => x.id === id ? { ...x, qty: x.qty + delta } : x).filter((x) => x.qty > 0));
  };

  const handleSuccess = () => {
    const ref = "CMD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrderRef(ref);
    setCart([]);
    setPage("confirmation");
  };

  const cartTotal = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.logo}>Milaf<span style={{ color: "#0369a1" }}>Store</span></div>
        <nav style={s.nav}>
          {["boutique", "panier", "commande"].map((p) => (
            <NavLink key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} active={page === p} onClick={() => setPage(p)} />
          ))}
        </nav>
        <button style={s.cartBtn} onClick={() => setPage("panier")}>
          🛒 Panier
          <span style={s.badge}>{cartTotal}</span>
        </button>
      </header>

      {page === "boutique"      && <Boutique onAdd={addToCart} />}
      {page === "panier"        && <Panier cart={cart} onChangeQty={changeQty} onCheckout={() => setPage("commande")} />}
      {page === "commande"      && <Commande cart={cart} onSuccess={handleSuccess} />}
      {page === "confirmation"  && <Confirmation ref_={orderRef} onContinue={() => setPage("boutique")} />}

      <Toast msg={toast} />
    </div>
  );
}
