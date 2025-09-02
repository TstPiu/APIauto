import {test, expect} from "@playwright/test";
import {validUser, invalidUsers, missingFieldUsers} from "./userData.js";
import {validation} from "./validation.js";
const {
  initApi,
  generateMissingFieldCases,
  nullValueCases,
  onlySpaceValueCases,
} = require("../utils/apiGenerators.js");
const fs = require("fs");
const path = require("path");

let token;
let api;

const userDefaults = {
  email: "alice@example.com",
  password: "P@ssw0rd",
};

const userCreateDefaults = {
  name: "Alice",
  email: "alice@example.com",
  password: "P@ssw0rd",
  role: "admin",
};

// Helper: normalize message from various shapes (object, JSON-string, error string)
function normalizeMessage(raw) {
  if (raw == null) return null;
  let msg = raw;
  if (typeof msg === "object") {
    // Prefer explicit message property if present
    if (msg.message) msg = msg.message;
    else msg = JSON.stringify(msg);
  }
  if (typeof msg !== "string") msg = String(msg);
  msg = msg.trim();

  // If message looks like a JSON string, try parsing and extracting .message
  try {
    if (
      (msg.startsWith("{") && msg.endsWith("}")) ||
      (msg.startsWith('"') && msg.endsWith('"'))
    ) {
      const parsed = JSON.parse(msg);
      if (parsed && typeof parsed === "object" && parsed.message)
        msg = parsed.message;
    }
  } catch (e) {
    // ignore
  }

  // Unescape escaped quotes
  msg = msg.replace(/\\"/g, '"');
  // Remove quoted field names: "name" is required -> name is required
  msg = msg.replace(/"([^"\n]+)"/g, "$1");

  // Remove stack traces - anything after a newline
  msg = msg.split("\\n")[0].split("\n")[0];

  return msg.trim();
}

// Create aggregated report and throw if failures exist
const createReportAndThrow = (title, results) => {
  //delete old reports
  const outDir = path.join(process.cwd(), "tests", "User");
  if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    for (const file of files) {
      if (file.startsWith("Report_") && file.endsWith(".json")) {
        fs.unlinkSync(path.join(outDir, file));
      }
    }
  }

  // analyze results

  const failures = results.filter((r) => !r.passed);
  const timestamp = new Date().toISOString();

  const report = {
    title,
    timestamp,
    totalCases: results.length,
    failures: failures.length,
    cases: results.map((r) => ({
      testCase: r.desc,
      expected: r.expected ?? {status: null, message: null},
      actual: {
        status: r.status ?? null,
        message: normalizeMessage(r.body ?? r.error ?? null),
      },
      passed: r.passed,
      error: r.error ?? null,
      data: r.data ?? null,
    })),
    faultyCases: failures.map((r) => ({
      testCase: r.desc,
      expected: r.expected ?? {status: null, message: null},
      actual: {
        status: r.status ?? null,
        message: normalizeMessage(r.body ?? r.error ?? null),
      },
      error: r.error ?? null,
      data: r.data ?? null,
    })),
  };

  // ensure directory exists and write report
  const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_");
  const fileName = `Report_${safeTitle}_${Date.now()}.json`;
  const outPath = path.join(outDir, fileName);
  fs.mkdirSync(outDir, {recursive: true});
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Aggregate JSON report saved to: ${outPath}`);

  if (failures.length) {
    throw new Error(
      `${title}: ${failures.length} / ${results.length} case(s) failed. See report at ${outPath}`
    );
  }
};

// helper to run missing-field cases for any endpoint using the api helpers
async function runCases({title, cases, callApi, expectedStatus = 422}) {
  const results = [];
  for (const c of cases) {
    const desc = c.desc || JSON.stringify(c.data || c);
    try {
      const r = await callApi(c.data);
      let body;
      try {
        body = await r.json();
      } catch {
        body = await r.text();
      }

      const normalizedBody = normalizeMessage(body);
      const passed =
        r.status() === expectedStatus &&
        (normalizedBody ? normalizedBody.includes(c.message) : false);

      results.push({
        desc,
        data: c.data,
        status: r.status(),
        body,
        passed,
        expected: {status: expectedStatus, message: c.message},
      });
    } catch (error) {
      results.push({
        desc,
        data: c.data,
        error: error.message,
        passed: false,
        expected: {status: expectedStatus, message: c.message},
      });
    }
  }
  createReportAndThrow(title, results);
}

test("Get Token after user login", async ({request, baseURL}) => {
  const response = await request.post(`${baseURL}/users/login`, {
    data: {
      email: validUser.email,
      password: validUser.password,
    },
  });
  await validation.input.isValidLogin({response});
  const body = await response.json();
  token = body.token;
});

// Create user missing-field aggregate
test("Create User with Missing Fields (aggregate report)", async ({
  request,
  baseURL,
}) => {
  api = initApi(request, baseURL);
  // Ensure token exists like your other tests expect
  expect(validation.Token).toBeTruthy();

  const missingCases = generateMissingFieldCases(userCreateDefaults, [
    "name",
    "email",
    "password",
    "role",
  ]);

  await runCases({
    title: "Create User with Missing Fields",
    cases: missingCases,
    callApi: (data) => api.createUser(data, token),
    expectedStatus: 422,
  });
});

test.only("Login all test cases", async ({request, baseURL}) => {
  api = initApi(request, baseURL);
  const missingCases = generateMissingFieldCases(userDefaults, [
    "email",
    "password",
  ]);

  const emptyCases = nullValueCases(userDefaults);

  const spaceCases = onlySpaceValueCases(userDefaults);

  const allCases = [...missingCases, ...emptyCases, ...spaceCases];

  await runCases({
    title: "Login with Missing Fields",
    cases: allCases,
    callApi: (data) => api.login(data),
    expectedStatus: 422,
  });
});
