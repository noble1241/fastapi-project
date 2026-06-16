import { html } from "https://esm.sh/htm/react";
import { useState } from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import Auth from "./components/Auth.js";
import BlogList from "./components/BlogList.js";

const TOKEN_KEY = "fastapi_blog_token";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");

  return html`
    <main>
      <${Auth}
        token=${token}
        onLogin=${setToken}
        onLogout=${() => setToken("")}
      />
      <${BlogList} token=${token} />
    </main>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
