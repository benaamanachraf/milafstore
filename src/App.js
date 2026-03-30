import { useState } from "react";
import MilafStore from "./MilafStore";
import BoutiqueClient from "./BoutiqueClient";

// ── Comptes autorisés ──────────────────────────────────────────
// Pour un vrai projet : remplace par une vérification API PHP
const USERS = [
  { email: "admin@milafstore.ma", password: "admin123", role: "admin", nom: "Administrateur" },
  { email: "client@gmail.com",    password: "client123", role: "client", nom: "Amine Bensalem" },
];

// ── Styles ─────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f8f6",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e5e5",
    padding: "40px 36px",
    width: 360,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 28,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    fontSize: 13,
    marginBottom: 14,
    boxSizing: "border-box",
    color: "#111",
    background: "#fff",
    outline: "none",
  },
  btnPrimary: {
    width: "100%",
    padding: "11px",
    borderRadius: 8,
    border: "none",
    background: "#0369a1",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: "#dc2626",
    marginBottom: 12,
    padding: "8px 12px",
    background: "#fef2f2",
    borderRadius: 6,
    border: "1px solid #fecaca",
  },
  demoBox: {
    marginTop: 20,
    padding: "12px 14px",
    background: "#f0f9ff",
    borderRadius: 8,
    border: "1px solid #bae6fd",
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  demoRow: {
    fontSize: 11,
    color: "#555",
    marginBottom: 4,
    display: "flex",
    justifyContent: "space-between",
  },
  roleBadge: (role) => ({
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 20,
    fontWeight: 500,
    background: role === "admin" ? "#ede9fe" : "#dcfce7",
    color: role === "admin" ? "#5b21b6" : "#166534",
  }),
};

// ── Composant Login ────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    // Simulation délai réseau (remplacer par fetch vers api/login.php)
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 600);
  };

  const fillDemo = (email, password) => {
    setEmail(email);
    setPassword(password);
    setError("");
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          Milaf<span style={{ color: "#0369a1" }}>Store</span>
        </div>
        <div style={s.subtitle}>Connectez-vous à votre espace</div>

        {/* Erreur */}
        {error && <div style={s.error}>{error}</div>}

        {/* Formulaire */}
        <label style={s.label}>Adresse email</label>
        <input
          style={s.input}
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <label style={s.label}>Mot de passe</label>
        <input
          style={s.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter →"}
        </button>

        {/* Comptes de démonstration */}
        <div style={s.demoBox}>
          <div style={s.demoTitle}>Comptes de démonstration</div>
          {USERS.map((u) => (
            <div
              key={u.email}
              style={{ ...s.demoRow, cursor: "pointer", padding: "4px 6px", borderRadius: 6 }}
              onClick={() => fillDemo(u.email, u.password)}
              title="Cliquer pour remplir"
            >
              <span>{u.email}</span>
              <span style={s.roleBadge(u.role)}>{u.role}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "#999", marginTop: 6 }}>
            Cliquer sur un compte pour le remplir automatiquement
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Barre utilisateur connecté ─────────────────────────────────
const UserBar = ({ user, onLogout }) => (
  <div style={{
    position: "fixed", bottom: 16, right: 16, zIndex: 999,
    background: "#fff", border: "1px solid #e5e5e5",
    borderRadius: 10, padding: "8px 14px",
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)", fontSize: 12,
  }}>
    <span style={s.roleBadge(user.role)}>{user.role}</span>
    <span style={{ color: "#555" }}>{user.nom}</span>
    <button
      onClick={onLogout}
      style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #e0e0e0", background: "none", cursor: "pointer", color: "#dc2626" }}
    >
      Déconnexion
    </button>
  </div>
);

// ── App principale ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin  = (u) => setUser(u);
  const handleLogout = ()  => setUser(null);

  // Non connecté → page de login
  if (!user) return <LoginPage onLogin={handleLogin} />;

  // Connecté → affiche la bonne interface selon le rôle
  return (
    <>
      {user.role === "admin"  && <MilafStore />}
      {user.role === "client" && <BoutiqueClient />}
      <UserBar user={user} onLogout={handleLogout} />
    </>
  );
}
