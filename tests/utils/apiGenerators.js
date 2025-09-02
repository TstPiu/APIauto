// Generate cases with missing required fields
// requiredFields: array of keys (top-level)
// messageTemplate: optional function (missingKeys) => expectedMessage
export function generateMissingFieldCases(
  defaults = {},
  requiredFields = [],
  messageTemplate
) {
  const cases = [];
  requiredFields.forEach((field) => {
    const data = {...defaults};
    delete data[field];
    const desc = `missing ${field}`;
    const message = messageTemplate
      ? messageTemplate([field])
      : `${field} is required`;
    cases.push({desc, data, message});
  });

  // also generate multi-missing (2 fields) if there are at least 2 required
  if (requiredFields.length >= 2) {
    const [a, b] = requiredFields;
    const multi = {...defaults};
    delete multi[a];
    delete multi[b];
    const desc = `missing ${a} and ${b}`;
    const message = messageTemplate
      ? messageTemplate([a, b])
      : `${a} and ${b} are required`;
    cases.push({desc, data: multi, message});
  }
  return cases;
}

//Generate test cases for empty or space as value
export function nullValueCases(defaults = {}, fields = [], messageFormat) {
  const cases = [];
  fields.forEach((field) => {
    const data = {...defaults, [field]: null};
    const desc = `null ${field}`;
    const messageForNull = messageFormat
      ? messageFormat([field])
      : `${field} must not be null`;
    cases.push({desc, data, field, invalid: null, message: messageForNull});
  });
  return cases;
}

//Generate test cases for empty or space as value
export function onlySpaceValueCases(defaults = {}, fields = [], messageFormat) {
  const cases = [];
  fields.forEach((field) => {
    const data = {...defaults, [field]: "   "};
    const desc = `only space ${field}`;
    const messageForSpace = messageFormat
      ? messageFormat([field])
      : `${field} must not be only whitespace`;
    cases.push({desc, data, field, invalid: "   ", message: messageForSpace});
  });
  return cases;
}

// Generate invalid-value cases given a map of field -> invalidValues array
// invalidMap example: {email: ['no-at', '', null], password: ['', 'short']}
export function generateInvalidValueCases(defaults = {}, invalidMap = {}) {
  const cases = [];
  Object.entries(invalidMap).forEach(([field, invalidValues]) => {
    invalidValues.forEach((invalid) => {
      const data = {...defaults, [field]: invalid};
      const desc = `invalid ${field}: ${String(invalid)}`;
      cases.push({desc, data, field, invalid});
    });
  });
  return cases;
}

// Simple helpers to create API request functions bound to Playwright's request fixture
// call initApi(request, baseURL) in your tests to get helpers

const authHeaders = (token) =>
  token ? {Authorization: `Bearer ${token}`} : undefined;

export function initApi(request, baseURL) {
  const buildUrl = (path) =>
    `${baseURL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  return {
    login: async (payload, token) => {
      return request.post(buildUrl("/users/login"), {
        data: payload,
        headers: authHeaders(token),
      });
    },
    createUser: async (payload, token) => {
      return request.post(buildUrl("/admin/users"), {
        data: payload,
        headers: authHeaders(token),
      });
    },
    updateUser: async (id, payload, token) => {
      return request.put(buildUrl(`/admin/users/${id}`), {
        data: payload,
        headers: authHeaders(token),
      });
    },
    getAllUsers: async (query = "", token) => {
      const path = query ? `/admin/users?${query}` : "/admin/users";
      return request.get(buildUrl(path), {
        headers: authHeaders(token),
      });
    },
    getUser: async (id, token) => {
      return request.get(buildUrl(`/admin/users/${id}`), {
        headers: authHeaders(token),
      });
    },
    deleteUser: async (id, token) => {
      return request.delete(buildUrl(`/admin/users/${id}`), {
        headers: authHeaders(token),
      });
    },
  };
}

// Example usage (copy into a test file):
/*
import {test, expect} from '@playwright/test';
import {buildPayload, generateMissingFieldCases, generateInvalidValueCases, initApi} from './utils/apiGenerators.js';

const userDefaults = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'P@ssw0rd',
  role: 'user',
};

test('create user examples', async ({request, baseURL}) => {
  const api = initApi(request, baseURL);

  // simple create using defaults
  const res1 = await api.createUser(buildPayload(userDefaults));
  expect(res1.ok()).toBeTruthy();

  // missing field cases
  const missingCases = generateMissingFieldCases(userDefaults, ['name', 'email', 'password']);
  for (const c of missingCases) {
    const r = await api.createUser(c.data);
    expect(r.status()).toBe(422);
    const body = await r.json();
    expect(body.message).toContain(c.message);
  }

  // invalid values
  const invalids = generateInvalidValueCases(userDefaults, {email: ['no-at', ''], password: ['', 'short']});
  for (const c of invalids) {
    const r = await api.createUser(c.data);
    expect(r.status()).not.toBe(200);
  }
});
*/
