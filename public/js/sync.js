// Anonymous progress sync — client.
// Stores a short code in localStorage and pulls/pushes JSON to /api/sync.
// Falls back to localStorage-only if the API is unreachable.

(function () {
  const CODE_KEY = "sync-code";
  const TS_KEY = "progress-ts";
  const WORDS = ["PINA","GATTO","SOLE","LUNA","FIORE","MARE","STELLA","NUVOLA","DRAGO","TIGRE","FATA","RANA"];

  function generateCode() {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    const n = Math.floor(1000 + Math.random() * 9000);
    return `${w}-${n}`;
  }

  function get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function set(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }

  async function pull(code) {
    try {
      const r = await fetch(`/api/sync?code=${encodeURIComponent(code)}`, { method: "GET" });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  async function push(code, data) {
    const ts = Date.now();
    try {
      const r = await fetch(`/api/sync?code=${encodeURIComponent(code)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, ts }),
      });
      if (r.ok) {
        set(TS_KEY, String(ts));
        return true;
      }
    } catch {}
    return false;
  }

  const Sync = {
    code: get(CODE_KEY),

    getCode() { return this.code; },
    isLinked() { return !!this.code; },

    setCode(code) {
      const c = String(code || "").trim().toUpperCase();
      if (!/^[A-Z0-9-]{3,20}$/.test(c)) throw new Error("invalid_code");
      this.code = c;
      set(CODE_KEY, c);
      return c;
    },

    ensureCode() {
      if (!this.code) {
        const c = generateCode();
        this.setCode(c);
      }
      return this.code;
    },

    disconnect() {
      this.code = null;
      try { localStorage.removeItem(CODE_KEY); } catch {}
    },

    // Pull cloud → if newer than local, return data to apply; else null
    async pullIfNewer() {
      if (!this.code) return null;
      const cloud = await pull(this.code);
      if (!cloud) return null;
      const localTs = parseInt(get(TS_KEY) || "0", 10);
      if ((cloud.ts || 0) > localTs) return cloud.data;
      return null;
    },

    // Debounced push
    _pushTimer: null,
    schedulePush(getData) {
      if (!this.code) return;
      clearTimeout(this._pushTimer);
      this._pushTimer = setTimeout(() => {
        push(this.code, getData()).catch(() => {});
      }, 1500);
    },

    // Force immediate push
    async pushNow(data) {
      if (!this.code) return false;
      return await push(this.code, data);
    },
  };

  window.Sync = Sync;
})();
