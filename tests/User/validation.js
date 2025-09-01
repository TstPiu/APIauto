import {expect} from "@playwright/test";

export const validation = {
  Token: undefined,
  input: {
    isValidLogin: async ({response}) => {
      const res = await response.json();
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
      expect(res.token).toBeDefined();
      validation.Token = res.token;
      console.log("Token:", validation.Token);
    },
    isValid: async ({response}) => {
      const res = await response.json();
      expect(response.status()).toBe(201);
      expect(response.ok()).toBeTruthy();
      expect(res.id).toBeDefined();
      console.log("Response:", res);
    },
    isMissingField: async ({response, status}) => {
      const res = await response.json();
      expect(response.status()).toBe(status);
      expect(response.ok()).toBeFalsy();
      expect(res.message).toBeDefined();
      console.log("Error Response:", res);
    },
    isUserAlreadyExist: async ({response}) => {
      const res = await response.json();
      expect(response.status()).toBe(409);
      expect(response.ok()).toBeFalsy();
      expect(res.message).toHaveText("User already exists");
      console.log("Error Response:", res);
    },
    isInvalid: async ({response}) => {
      const res = await response.json();
      expect(response.status()).toBe(400);
      expect(response.ok()).toBeFalsy();
      expect(res.message).toBeDefined();
      console.log("Error Response:", res);
    },
  },
};
