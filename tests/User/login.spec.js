import {test, expect} from "@playwright/test";
import {validUser, invalidUsers, missingFieldUsers} from "./userData.js";
import {validation} from "./validation.js";

let emails = [];

test.beforeAll("Get Token after user login", async ({request, baseURL}) => {
  const response = await request.post(`${baseURL}/users/login`, {
    data: {
      email: validUser.email,
      password: validUser.password,
    },
  });
  await validation.input.isValidLogin({response});
});

for (const user of invalidUsers) {
  test(`Login with Invalid Data: ${user.desc}`, async ({request, baseURL}) => {
    expect(validation.Token).toBeTruthy();

    const response = await request.post(`${baseURL}/users/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
      headers: {
        Authorization: `Bearer ${validation.Token}`,
      },
    });
    await validation.input.isInvalid({response});
  });
}

test("Create User Flow", async ({request, baseURL}) => {
  await test.step("get all users", async () => {
    expect(validation.Token).toBeTruthy();
    const response = await request.get(`${baseURL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${validation.Token}`,
      },
    });

    const res = await response.json();
    console.log(res);
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    emails = res.data.rows.map((user) => user.email);
  });

  await test.step("create user with valid data", async () => {
    expect(validation.Token).toBeTruthy();
    const response = await request.post(`${baseURL}/admin/users`, {
      data: {
        name: validUser.name,
        email: validUser.email,
        password: validUser.password,
        role: validUser.role,
      },
      headers: {
        Authorization: `Bearer ${validation.Token}`,
      },
    });

    if (emails.includes(validUser.email)) {
      await validation.input.isUserAlreadyExist({response});
    } else {
      await validation.input.isValid({response});
    }
  });
});

for (const user of missingFieldUsers) {
  test(`create user api with missing field: ${user.desc}`, async ({
    request,
    baseURL,
  }) => {
    expect(validation.Token).toBeTruthy();

    const response = await request.post(`${baseURL}/admin/users`, {
      data: {
        ...user.data,
      },
      headers: {
        Authorization: `Bearer ${validation.Token}`,
      },
    });
    await validation.input.isMissingField({response, status: 422});
    const res = await response.json();
    expect(res.message).toBe(user.message);
  });
}
