// Unified payloads using { name, email, password, role }
export const validUsers = [
  {
    name: "Prashant",
    email: "prashant@yopmail.com",
    password: "Prashant",
    role: "admin",
    desc: "Primary valid admin user",
  },
  {
    name: "Content User",
    email: "content@yopmail.com",
    password: "Content123",
    role: "content-team",
    desc: "Primary valid content-team user",
  },
];
export const validUser = validUsers[0]; // Default valid user for simple tests

export const invalidUsers = [
  {
    desc: "Invalid email format",
    data:
      // wrong email
      {
        name: "Wrong",
        email: "wronguser",
        password: "Password@123",
        role: "content-team",
      },
    message: "Invalid email format",
  },
  {
    desc: "Invalid password",
    data:
      // wrong password
      {
        name: "Piu",
        email: "prashant@yopmail.com",
        password: "wrong",
        role: "admin",
      },
    message: "Invalid password",
  },
  // empty email
  {
    name: "NoEmail",
    email: "",
    password: "Password@123",
    role: "content-team",
    desc: "Empty email",
  },
  // empty password
  {
    name: "NoPass",
    email: "piu@yopmail.com",
    password: "",
    role: "admin",
    desc: "Empty password",
  },
  // role empty
  {
    name: "EmptyRole",
    email: "piu@yopmail.com",
    password: "Password@123",
    role: "",
    desc: "Empty role",
  },
  // name empty
  {
    name: "",
    email: "piu@yopmail.com",
    password: "Password@123",
    role: "admin",
    desc: "Empty name",
  },
  //space only in email
  {
    name: "SpaceEmail",
    email: "   ",
    password: "Password@123",
    role: "admin",
    desc: "Spaces only in email",
  },
  //space only in password
  {
    name: "SpacePass",
    email: "piu@yopmail.com",
    password: "        ",
    role: "admin",
    desc: "Spaces only in password",
  },
  // space  only in name
  {
    name: "   ",
    email: "piu@yopmail.com",
    password: "Password@123",
    role: "admin",
    desc: "Spaces only in name",
  },
  //space only in role
  {
    name: "SpaceRole",
    email: "piu@yopmail.com",
    password: "Password@123",
    role: "   ",
    desc: "Spaces only in role",
  },
];

export const missingFieldLogin = [
  {
    data:
      // missing all fields
      {},
    desc: "Completely missing fields",
    message: "email is required",
  },
  {
    data:
      // missing password
      {email: "missingpassword@yopmail.com"},
    desc: "Missing password",
    message: "password is required",
  },
];

export const edgeCaseUsers = [
  // short email + password
  {
    name: "Tiny",
    email: "a@b.c",
    password: "p",
    role: "content-team",
    desc: "Very short email & password",
  },
  // extremely long email local part
  {
    name: "LongLocal",
    email: "".padEnd(1024, "a") + "@example.com",
    password: "P@ssw0rd",
    role: "content-team",
    desc: "Extremely long email",
  },
  // unicode email and password
  {
    name: "用户",
    email: "user@例子.测试",
    password: "UnicodePwd✓",
    role: "content-team",
    desc: "Unicode/IDN email & password",
  },
  // spaces in values
  {
    name: "With Spaces",
    email: "user with spaces@example.com",
    password: "pass with spaces",
    role: "content-team",
    desc: "Spaces in email/password",
  },
  // trailing spaces
  {
    name: "Trailing",
    email: "leading@space.com ",
    password: "pass",
    role: "content-team",
    desc: "Trailing space in email",
  },
  // newline in email
  {
    name: "NewLine",
    email: "\nnew\nline@example.com",
    password: "pwd",
    role: "content-team",
    desc: "Newline char in email",
  },
  // emoji
  {
    name: "Emoji 😀",
    email: "emoji😀@example.com",
    password: "👍👍👍",
    role: "content-team",
    desc: "Emoji in email/password",
  },
  // control characters
  {
    name: "Binary\x00Name",
    email: "\x00\x01@example.com",
    password: "p\x00w",
    role: "content-team",
    desc: "Binary/control chars",
  },
  // XSS attempt
  {
    name: "<script>",
    email: "<script>alert(1)</script>@x.com",
    password: "<img/>",
    role: "content-team",
    desc: "XSS attempt",
  },
  // SQL injection
  {
    name: "SQLi",
    email: "' OR '1'='1'@x.com",
    password: "' OR '1'='1'",
    role: "content-team",
    desc: "SQL injection",
  },
  // extremely long password
  {
    name: "Stress",
    email: "normal@domain.com",
    password: "A".repeat(2048),
    role: "content-team",
    desc: "Extremely long password",
  },
];

export const typeMismatchUsers = [
  {
    name: null,
    email: null,
    password: null,
    role: "content-team",
    desc: "All null",
  },
  {
    name: undefined,
    email: undefined,
    password: undefined,
    role: "admin",
    desc: "All undefined",
  },
  {
    name: 12345,
    email: 12345,
    password: 67890,
    role: "content-team",
    desc: "Numeric types",
  },
  {
    name: true,
    email: true,
    password: false,
    role: "admin",
    desc: "Boolean types",
  },
  {
    name: {first: "A"},
    email: {e: "a@b.com"},
    password: ["arr"],
    role: "content-team",
    desc: "Object/Array types",
  },
];

export const missingFieldUsers = [
  {
    data:
      // completely empty (no keys)
      {},
    desc: "Completely missing fields",
    message: "name is required",
  },
  {
    data:
      // missing password
      {
        name: "OnlyEmail",
        email: "onlyemail@yopmail.com",
        role: "content-team",
      },
    desc: "Missing password",
    message: "password is required",
  },
  {
    data:
      // missing email
      {
        name: "OnlyPass",
        password: "onlyPassword",
        role: "admin",
      },
    desc: "Missing email",
    message: "email is required",
  },
  {
    data:
      // missing role
      {
        name: "NoRole",
        email: "norole@yopmail.com",
        password: "password",
      },
    desc: "Missing role",
    message: "role is required",
  },
];

export const maliciousEncoded = [
  {
    name: "attacker",
    email: encodeURIComponent("' OR 1=1 --"),
    password: encodeURIComponent("password"),
    role: encodeURIComponent("content-team"),
    desc: "URL-encoded SQLi",
  },
  {
    name: "adminBase64",
    email:
      typeof btoa !== "undefined"
        ? btoa("admin@example.com")
        : "YWRtaW5AZXhhbXBsZS5jb20=",
    password: "cGFzc3dvcmQ=",
    role: "admin",
    desc: "Base64-encoded values",
  },
];

// Aggregate for data-driven tests
export const allTestPayloads = [
  ...validUsers,
  ...invalidUsers,
  ...edgeCaseUsers,
  ...typeMismatchUsers,
  ...missingFieldUsers,
  ...maliciousEncoded,
];
