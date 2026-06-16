import { html } from "https://esm.sh/htm/react";
import { useState } from "https://esm.sh/react@18";
import { login, registerUser } from "../api.js";

const TOKEN_KEY = "fastapi_blog_token";

export default function Auth({ token, onLogin, onLogout }) {
  const [tab, setTab] = useState("login");

  return html`
    <section>
      <div class="tabs">
        <button class=${"tab" + (tab === "login" ? " active" : "")} type="button" onClick=${() => setTab("login")}>Login</button>
        <button class=${"tab" + (tab === "register" ? " active" : "")} type="button" onClick=${() => setTab("register")}>Register</button>
      </div>
      ${tab === "login"
        ? html`<${LoginForm} token=${token} onLogin=${onLogin} onLogout=${onLogout} />`
        : html`<${RegisterForm} onSuccess=${() => setTab("login")} />`}
    </section>
  `;
}

function LoginForm({ token, onLogin, onLogout }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "Signing in...", type: "" });
    try {
      const data = await login(email, password);
      localStorage.setItem(TOKEN_KEY, data.access_token);
      onLogin(data.access_token);
      setStatus({ message: "Logged in successfully.", type: "success" });
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    onLogout();
    setStatus({ message: "Logged out.", type: "success" });
  }

  return html`
    <h1>Login</h1>
    <form onSubmit=${handleSubmit}>
      <label>Email
        <input type="email" autoComplete="username" required value=${email} onInput=${(e) => setEmail(e.target.value)} />
      </label>
      <label>Password
        <input type="password" autoComplete="current-password" required value=${password} onInput=${(e) => setPassword(e.target.value)} />
      </label>
      <div class="row">
        <button type="submit" disabled=${loading}>Login</button>
        <button type="button" class="secondary" onClick=${handleLogout}>Logout</button>
      </div>
    </form>
    <p class=${"status " + status.type}>${status.message}</p>
    ${token ? html`<p class="token">Token: ${token}</p>` : null}
  `;
}

function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "Creating account...", type: "" });
    try {
      await registerUser(name, email, password);
      setName(""); setEmail(""); setPassword("");
      setStatus({ message: "Account created! Redirecting to login...", type: "success" });
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return html`
    <h1>Create Account</h1>
    <form onSubmit=${handleSubmit}>
      <label>Name
        <input type="text" autoComplete="name" required value=${name} onInput=${(e) => setName(e.target.value)} />
      </label>
      <label>Email
        <input type="email" autoComplete="email" required value=${email} onInput=${(e) => setEmail(e.target.value)} />
      </label>
      <label>Password
        <input type="password" autoComplete="new-password" required value=${password} onInput=${(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled=${loading}>Create Account</button>
    </form>
    <p class=${"status " + status.type}>${status.message}</p>
  `;
}
