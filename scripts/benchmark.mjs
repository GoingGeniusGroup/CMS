import { spawn } from "child_process";
import { request } from "http";
import { homedir } from "os";

const PORT = 3999;
const BASE = `http://localhost:${PORT}`;

const PAGES = [
  // Admin pages (trigger server actions on load)
  { name: "Dashboard", path: "/" },
  { name: "Customer List", path: "/customer" },
  { name: "Projects", path: "/projects" },
  { name: "Team", path: "/team" },
  { name: "Services", path: "/services" },
  { name: "Careers", path: "/careers" },
  { name: "Invoices", path: "/invoices" },
  { name: "Blog", path: "/blog" },
  { name: "Pages", path: "/pages" },
  { name: "Category", path: "/category" },
  { name: "Settings General", path: "/settings/general" },
  { name: "Settings Contact", path: "/settings/contact" },
  { name: "Settings Email", path: "/settings/email" },
  { name: "Settings Social", path: "/settings/social" },
  { name: "Settings Appearance", path: "/settings/appearance" },
  { name: "Settings SEO", path: "/settings/seo" },
  { name: "Settings Popup", path: "/settings/popup" },
  { name: "Settings Cookies", path: "/settings/cookies" },
  { name: "Settings Security", path: "/settings/security" },
  // Public pages
  { name: "Home", path: "/home" },
];

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    request(url, { timeout: 30000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({ status: res.statusCode, time: Date.now() - start, size: data.length });
      });
    })
      .on("error", reject)
      .on("timeout", function () { this.destroy(); reject(new Error("Timeout")); })
      .end();
  });
}

async function waitForServer(url, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await fetchPage(url);
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Server did not start in time");
}

async function main() {
  console.log("\n========================================");
  console.log("  API / Server Action Response Times");
  console.log("========================================\n");

  const server = spawn("npm", ["run", "dev", "--", "-p", String(PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: String(PORT) },
    shell: true,
  });

  let serverOutput = "";
  server.stdout.on("data", (d) => { serverOutput += d.toString(); });
  server.stderr.on("data", (d) => { serverOutput += d.toString(); });

  try {
    console.log(" Starting dev server...");
    await waitForServer(`${BASE}/home`, 40, 1500);
    console.log(" Server ready.\n");

    const results = [];
    for (const page of PAGES) {
      process.stdout.write(`  ${page.name.padEnd(25)}... `);
      try {
        const result = await fetchPage(`${BASE}${page.path}`);
        const ok = result.status >= 200 && result.status < 400;
        results.push({ ...page, ...result, ok });
        console.log(`${ok ? "✓" : "✗"} ${result.time}ms (${result.size.toLocaleString()} bytes)`);
      } catch (err) {
        results.push({ ...page, ok: false, time: -1, status: 0, size: 0 });
        console.log(`✗ ERROR: ${err.message}`);
      }
    }

    console.log("\n----------------------------------------");
    console.log("  Results Summary");
    console.log("----------------------------------------\n");

    const sorted = [...results].filter((r) => r.ok).sort((a, b) => b.time - a.time);

    console.log("  Fastest:");
    sorted.slice(-5).reverse().forEach((r) => {
      console.log(`    ${r.name.padEnd(25)} ${r.time}ms`);
    });

    console.log("\n  Slowest:");
    sorted.slice(0, 5).forEach((r) => {
      console.log(`    ${r.name.padEnd(25)} ${r.time}ms`);
    });

    const avg = sorted.reduce((s, r) => s + r.time, 0) / sorted.length;
    const max = sorted[0]?.time || 0;
    const min = sorted[sorted.length - 1]?.time || 0;
    console.log(`\n  Average: ${Math.round(avg)}ms`);
    console.log(`  Min: ${min}ms`);
    console.log(`  Max: ${max}ms`);
    console.log(`  Total pages: ${results.length}`);
    console.log(`  Successful: ${sorted.length}`);
    console.log(`  Failed: ${results.length - sorted.length}`);

  } finally {
    server.kill("SIGTERM");
    // Force kill after 3s
    setTimeout(() => { server.kill("SIGKILL"); process.exit(0); }, 3000);
  }
}

main();
