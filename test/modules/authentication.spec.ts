import { expect, test } from "bun:test";
import {
  doLoginWithPreloadedData,
  extractInputFields,
  extractSessionID,
  fetchPreloadLoginData,
} from "../../src/modules/authentication/login";

test(`[Authentication] should response preload login data`, async () => {
  const data = await fetchPreloadLoginData();
  // console.log(data);

  expect(data).not.toBeUndefined();
  expect(data).toHaveProperty("cookies");
  expect(data).toHaveProperty("body");
});

test(`[Authentication] should extract session id`, async () => {
  const data = await fetchPreloadLoginData();
  const sessionId = await extractSessionID(data.cookies);

  expect(sessionId).not.toBeUndefined();
  expect(sessionId).toBeTypeOf("string");
});

test(`[Authentication] should extract fields from body`, async () => {
  const data = await fetchPreloadLoginData();
  const inputs = await extractInputFields(data.body);

  expect(inputs).not.toBeUndefined();
  expect(inputs).toBeTypeOf("object");
});

test(`[Authentication] should allow to login`, async () => {
  const data = await fetchPreloadLoginData();

  await doLoginWithPreloadedData(
    data,
    // @ts-ignore
    Bun.env.USER_TEST_USERNAME,
    // @ts-ignore
    Bun.env.USER_TEST_PASSWORD
  );
});
