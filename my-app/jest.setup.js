require("@testing-library/jest-dom");

// Polyfill Request API for Next.js server modules in jsdom
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = typeof input === "string" ? input : input.url;
    this.method = init.method || "GET";
    this.headers = new Headers(init.headers || {});
    this.body = init.body || null;
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "";
    this.headers = new Headers(init.headers || {});
    this.ok = this.status >= 200 && this.status < 300;
  }

  json() {
    return Promise.resolve(this.body ? JSON.parse(this.body) : null);
  }

  static json(data, init = {}) {
    const headers = new Headers(init.headers || {});
    headers.set("content-type", "application/json");
    return new Response(JSON.stringify(data), {
      ...init,
      headers,
    });
  }
};

// 检测数据库连接是否可用
global.DB_AVAILABLE = false;
const { execSync } = require("child_process");
try {
  execSync("mysql -u root -e 'SELECT 1' 2>/dev/null", { timeout: 3000 });
  global.DB_AVAILABLE = true;
} catch {
  global.DB_AVAILABLE = false;
  console.warn("\n[test:setup] 数据库连接不可用，数据库集成测试将被跳过。请确保 MySQL 已启动且配置正确。\n");
}
