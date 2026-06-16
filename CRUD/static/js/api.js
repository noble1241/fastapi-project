export async function apiRequest(path, token, options = {}) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error((data && data.detail) ? data.detail : `Request failed with ${response.status}`);
  }
  return data;
}

export async function login(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || `Request failed with ${response.status}`);
  return data;
}

export async function registerUser(name, email, password) {
  const response = await fetch("/user/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || `Request failed with ${response.status}`);
  return data;
}

export const fetchBlogs    = (token) => apiRequest("/blog/", token);
export const createBlog    = (token, title, body) => apiRequest("/blog/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body }) });
export const deleteBlog    = (token, id) => apiRequest(`/blog/${id}`, token, { method: "DELETE" });
export const updateBlog    = (token, id, title, body) => apiRequest(`/blog/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body }) });
