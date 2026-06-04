/**
 * Helix Admin API client.
 * Set window.HELIX_API_BASE before loading (e.g. http://localhost:8000/api/v1).
 */
(function (global) {
  "use strict";

  const TOKEN_KEY = "helix_admin_token";

  function base() {
    const b = global.HELIX_API_BASE;
    return b ? String(b).replace(/\/$/, "") : "";
  }

  function enabled() {
    return !!base();
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function request(path, options = {}) {
    const url = `${base()}${path}`;
    const headers = { ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { detail: text };
    }
    if (!res.ok) {
      const msg = data?.detail || res.statusText;
      const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const api = {
    enabled,
    getToken,
    setToken,
    async login(email, password) {
      const data = await request("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.access_token);
      return data;
    },
    logout() {
      setToken(null);
    },
    async getStats() {
      return request("/admin/stats");
    },
    async listSubmissions(params = {}) {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") q.set(k, v);
      });
      const qs = q.toString();
      return request(`/admin/submissions${qs ? `?${qs}` : ""}`);
    },
    async getSubmission(id) {
      return request(`/admin/submissions/${id}`);
    },
    async updateStatus(id, status) {
      return request(`/admin/submissions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
  };

  global.HelixAdminApi = api;
})(window);
