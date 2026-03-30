import { useState } from "react";
import MilafStore from "./MilafStore";
import BoutiqueClient from "./BoutiqueClient";

// ── Comptes admin fixes ────────────────────────────────────────
const ADMINS = [
  { email: "admin@milafstore.ma", password: "admin123", role: "admin", nom: "Administrateur" },
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
    padding: "36px 32px",
    width: 380,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  logo: { fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#888", textAlign: "center", marginBottom: 24 },
  tabs: { display: "flex", borderBottom: "1px solid #e5e5e5", marginBottom: 24 },
  tab: (active) => ({
    flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13,
    fontWeight: active ? 500 : 400,
    color: active ? "#0369a1" : "#888",
    borderBottom: active ? "2px solid #0369a1" : "2px solid transparent",
    cursor: "pointer", marginBottom: -1,
  }),
  label: { fontSize: 12, color: "#666", marginBottom: 4, display: "block" },
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e0e0e0", fontSize: 13, marginBottom: 12,
    boxSizing: "border-box", color: "#111", background: "#fff", outline: "none",
  },
  btnPrimary: {
    width: "100%", padding: 11, borderRadius: 8, border: "none",
    background: "#0369a1", color: "#fff", fontSize: 14, fontWeight: 500,
    cursor: "pointer", marginTop: 4,
  },
  btnOutline: {
    width: "100%", padding: 11, borderRadius: 8,
    border: "1px solid #0369a1", background: "#fff",
    color: "#0369a1", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 8,
  },
  error: {
    fontSize: 12, color: "#dc2626", marginBottom: 12,
    padding: "8px 12px", background: "#fef2f2",
    borderRadius: 6, border: "1px solid #fecaca",
  },
  success: {
    fontSize: 12, color: "#166534", marginBottom: 12,
    padding: "8px 12px", background: "#dcfce7",
    borderRadius: 6, border: "1px solid #bbf7d0",
  },
  demoBox: {
    marginTop: 18, padding: "12px 14px",
    background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "14px 0", color: "#bbb", fontSize: 12,
  },
  dividerLine: { flex: 1, height: 1, background: "#e5e5e5" },
  roleBadge: (role) => ({
    fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500,
    background: role === "admin" ? "#ede9fe" : "#dcfce7",
    color: role === "admin" ? "#5b21b6" : "#166534",
  }),
};

// ── UserBar ────────────────────────────────────────────────────
const UserBar = ({ user, onLogout }) => (
  <div style={{
    position: "fixed", bottom: 16, right: 16, zIndex: 999,
    background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10,
    padding: "8px 14px", display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)", fontSize: 12,
  }}>
    <span style={s.roleBadge(user.role)}>{user.role}</span>
    <span style={{ color: "#555" }}>{user.nom}</span>
    <button onClick={onLogout} style={{
      fontSize: 11, padding: "3px 8px", borderRadius: 6,
      border: "1px solid #e0e0e0", background: "none", cursor: "pointer", color: "#dc2626",
    }}>Déconnexion</button>
  </div>
);

// ── Page Auth ──────────────────────────────────────────────────
const AuthPage = ({ onLogin }) => {
  const [tab, setTab]         = useState("login");
  const [clients, setClients] = useState([
    { email: "client@gmail.com", password: "client123", role: "client", nom: "Amine Bensalem" },
  ]);

  // Login
  const [lEmail, setLEmail]     = useState("");
  const [lPass, setLPass]       = useState("");
  const [lError, setLError]     = useState("");
  const [lLoading, setLLoading] = useState(false);

  // Register
  const [rNom, setRNom]         = useState("");
  const [rEmail, setREmail]     = useState("");
  const [rPass, setRPass]       = useState("");
  const [rConfirm, setRConfirm] = useState("");
  const [rTel, setRTel]         = useState("");
  const [rError, setRError]     = useState("");
  const [rSuccess, setRSuccess] = useState("");
  const [rLoading, setRLoading] = useState(false);

  const switchTab = (t) => { setTab(t); setLError(""); setRError(""); setRSuccess(""); };

  // ── Connexion ────────────────────────────────────────────────
  const handleLogin = () => {
    setLError("");
    if (!lEmail || !lPass) { setLError("Veuillez remplir tous les champs."); return; }
    setLLoading(true);
    setTimeout(() => {
      const user = [...ADMINS, ...clients].find(
        (u) => u.email === lEmail && u.password === lPass
      );
      if (user) { onLogin(user); }
      else { setLError("Email ou mot de passe incorrect."); setLLoading(false); }
    }, 500);
  };

  // ── Inscription ──────────────────────────────────────────────
  const handleRegister = () => {
    setRError(""); setRSuccess("");
    if (!rNom || !rEmail || !rPass || !rConfirm) {
      setRError("Veuillez remplir tous les champs obligatoires."); return;
    }
    if (rPass.length < 6) {
      setRError("Le mot de passe doit contenir au moins 6 caractères."); return;
    }
    if (rPass !== rConfirm) {
      setRError("Les mots de passe ne correspondent pas."); return;
    }
    if ([...ADMINS, ...clients].find((u) => u.email === rEmail)) {
      setRError("Cet email est déjà utilisé."); return;
    }
    setRLoading(true);
    setTimeout(() => {
      const newUser = { email: rEmail, password: rPass, role: "client", nom: rNom, tel: rTel };
      setClients((prev) => [...prev, newUser]);
      setRSuccess("Compte créé ! Redirection vers la connexion...");
      setRLoading(false);
      setTimeout(() => { switchTab("login"); setLEmail(rEmail); }, 1500);
    }, 600);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Milaf<span style={{ color: "#0369a1" }}>Store</span></div>
        <div style={s.subtitle}>
          {tab === "login" ? "Connectez-vous à votre espace" : "Créez votre compte client"}
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          <div style={s.tab(tab === "login")}    onClick={() => switchTab("login")}>Se connecter</div>
          <div style={s.tab(tab === "register")} onClick={() => switchTab("register")}>S'inscrire</div>
        </div>

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <>
            {lError && <div style={s.error}>{lError}</div>}

            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="votre@email.com"
              value={lEmail} onChange={(e) => setLEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

            <label style={s.label}>Mot de passe</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={lPass} onChange={(e) => setLPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

            <button style={{ ...s.btnPrimary, opacity: lLoading ? 0.7 : 1 }}
              onClick={handleLogin} disabled={lLoading}>
              {lLoading ? "Connexion..." : "Se connecter →"}
            </button>

            <div style={s.divider}>
              <div style={s.dividerLine} /><span>Pas encore de compte ?</span><div style={s.dividerLine} />
            </div>
            <button style={s.btnOutline} onClick={() => switchTab("register")}>
              Créer un compte →
            </button>

            {/* Démo */}
            <div style={s.demoBox}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#0369a1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Comptes démo
              </div>
              {[...ADMINS, { email: "client@gmail.com", password: "client123", role: "client" }].map((u) => (
                <div key={u.email}
                  onClick={() => { setLEmail(u.email); setLPass(u.password); setLError(""); }}
                  style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", padding: "4px 6px", borderRadius: 6, cursor: "pointer", marginBottom: 2 }}>
                  <span>{u.email}</span>
                  <span style={s.roleBadge(u.role)}>{u.role}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>Cliquer pour remplir automatiquement</div>
            </div>
          </>
        )}

        {/* ── INSCRIPTION ── */}
        {tab === "register" && (
          <>
            {rError   && <div style={s.error}>{rError}</div>}
            {rSuccess && <div style={s.success}>{rSuccess}</div>}

            <label style={s.label}>Nom complet <span style={{ color: "#dc2626" }}>*</span></label>
            <input style={s.input} type="text" placeholder="Ex: Sara El Alaoui"
              value={rNom} onChange={(e) => setRNom(e.target.value)} />

            <label style={s.label}>Email <span style={{ color: "#dc2626" }}>*</span></label>
            <input style={s.input} type="email" placeholder="sara@gmail.com"
              value={rEmail} onChange={(e) => setREmail(e.target.value)} />

            <label style={s.label}>Téléphone</label>
            <input style={s.input} type="tel" placeholder="06 12 34 56 78"
              value={rTel} onChange={(e) => setRTel(e.target.value)} />

            <label style={s.label}>Mot de passe <span style={{ color: "#dc2626" }}>*</span></label>
            <input style={s.input} type="password" placeholder="Minimum 6 caractères"
              value={rPass} onChange={(e) => setRPass(e.target.value)} />

            <label style={s.label}>Confirmer le mot de passe <span style={{ color: "#dc2626" }}>*</span></label>
            <input style={s.input} type="password" placeholder="Répétez le mot de passe"
              value={rConfirm} onChange={(e) => setRConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()} />

            <button style={{ ...s.btnPrimary, opacity: rLoading ? 0.7 : 1 }}
              onClick={handleRegister} disabled={rLoading}>
              {rLoading ? "Création du compte..." : "Créer mon compte →"}
            </button>

            <div style={s.divider}>
              <div style={s.dividerLine} /><span>Déjà un compte ?</span><div style={s.dividerLine} />
            </div>
            <button style={s.btnOutline} onClick={() => switchTab("login")}>
              Se connecter →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── App principale ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <>
      {user.role === "admin"  && <MilafStore />}
      {user.role === "client" && <BoutiqueClient />}
      <UserBar user={user} onLogout={() => setUser(null)} />
    </>
  );
}
