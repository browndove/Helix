/**
 * Helix onboarding API client.
 * Set window.HELIX_API_BASE before loading (e.g. http://localhost:8000/api/v1).
 */
(function (global) {
  "use strict";

  function base() {
    const b = global.HELIX_API_BASE;
    return b ? String(b).replace(/\/$/, "") : "";
  }

  function enabled() {
    return !!base();
  }

  async function request(path, options = {}) {
    const url = `${base()}${path}`;
    const headers = { ...(options.headers || {}) };
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
      const msg = data?.detail?.message || data?.detail || res.statusText;
      const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  const api = {
    enabled,
    async createSubmission(payload) {
      return request("/onboarding/submissions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async updateSubmission(id, patch) {
      return request(`/onboarding/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    },
    async replaceSubmission(id, payload) {
      return request(`/onboarding/submissions/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    async submit(id) {
      return request(`/onboarding/submissions/${id}/submit`, { method: "POST" });
    },
    async importPayload(payload) {
      return request("/onboarding/submissions/import", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async uploadFile(id, uploadKey, file) {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/onboarding/submissions/${id}/files/${uploadKey}`, {
        method: "POST",
        body: fd,
      });
    },
    async deleteFile(id, uploadKey) {
      return request(`/onboarding/submissions/${id}/files/${uploadKey}`, {
        method: "DELETE",
      });
    },
  };

  global.HelixOnboardingApi = api;
})(window);
