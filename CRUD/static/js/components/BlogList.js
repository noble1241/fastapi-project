import { html } from "https://esm.sh/htm/react";
import { useState, useEffect, useCallback } from "https://esm.sh/react@18";
import { fetchBlogs, createBlog, deleteBlog, updateBlog } from "../api.js";

export default function BlogList({ token }) {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadBlogs = useCallback(async () => {
    if (!token) {
      setBlogs([]);
      setStatus({ message: "Login first to load protected blogs.", type: "" });
      return;
    }
    setStatus({ message: "Loading blogs...", type: "" });
    try {
      const data = await fetchBlogs(token);
      setBlogs(data);
      setStatus({ message: "Blogs loaded.", type: "success" });
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    }
  }, [token]);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  async function handleCreate(e) {
    e.preventDefault();
    setIsCreating(true);
    setStatus({ message: "Creating blog...", type: "" });
    try {
      await createBlog(token, title, body);
      setTitle(""); setBody("");
      setStatus({ message: "Blog created.", type: "success" });
      await loadBlogs();
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id) {
    setStatus({ message: "Deleting blog...", type: "" });
    try {
      await deleteBlog(token, id);
      setStatus({ message: "Blog deleted.", type: "success" });
      await loadBlogs();
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    }
  }

  async function handleUpdate(id, newTitle, newBody) {
    setStatus({ message: "Updating blog...", type: "" });
    try {
      await updateBlog(token, id, newTitle, newBody);
      setStatus({ message: "Blog updated.", type: "success" });
      await loadBlogs();
    } catch (err) {
      setStatus({ message: err.message, type: "error" });
    }
  }

  return html`
    <section>
      <h2>Protected Blogs</h2>
      <form onSubmit=${handleCreate}>
        <label>Title
          <input required value=${title} onInput=${(e) => setTitle(e.target.value)} />
        </label>
        <label>Body
          <textarea required value=${body} onInput=${(e) => setBody(e.target.value)} />
        </label>
        <div class="row">
          <button type="submit" disabled=${isCreating}>Create Blog</button>
          <button type="button" class="secondary" onClick=${loadBlogs}>Refresh</button>
        </div>
      </form>
      <p class=${"status " + status.type}>${status.message}</p>
      <div class="blogs">
        ${blogs.length
          ? blogs.map((blog, i) => html`
              <${BlogCard}
                key=${blog.id}
                blog=${blog}
                onDelete=${handleDelete}
                onUpdate=${handleUpdate}
              />`
            )
          : html`<p>${token ? "No blogs yet." : ""}</p>`}
      </div>
    </section>
  `;
}

function BlogCard({ blog, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(blog.title);
  const [editBody, setEditBody] = useState(blog.body);

  async function handleSave(e) {
    e.preventDefault();
    await onUpdate(blog.id, editTitle, editBody);
    setEditing(false);
  }

  return html`
    <article>
      <h3>${blog.title}</h3>
      <p>${blog.body}</p>
      ${editing ? html`
        <form class="edit-form" onSubmit=${handleSave}>
          <input required value=${editTitle} onInput=${(e) => setEditTitle(e.target.value)} />
          <textarea required value=${editBody} onInput=${(e) => setEditBody(e.target.value)} />
          <div class="article-actions">
            <button type="submit">Save</button>
            <button type="button" class="secondary" onClick=${() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ` : html`
        <div class="article-actions">
          <button type="button" class="secondary" onClick=${() => setEditing(true)}>Edit</button>
          <button type="button" class="danger" onClick=${() => onDelete(blog.id)}>Delete</button>
        </div>
      `}
    </article>
  `;
}
