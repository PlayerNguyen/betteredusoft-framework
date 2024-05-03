import { expect, test } from "bun:test";
import { Edusoft } from "../src";

async function createAndLoginClient() {
  const edusoft = new Edusoft();
  // Login
  await edusoft.getAuthentication().login(
    // @ts-ignore
    Bun.env.USER_TEST_USERNAME,
    // @ts-ignore
    Bun.env.USER_TEST_PASSWORD
  );

  return edusoft;
}

test(`[object] should create a fetcher that can fetch`, async () => {
  const fetchResult = (await createAndLoginClient())
    .getFetcher()
    .createFetch("https://edusoftweb.hcmiu.edu.vn/default.aspx?page=gioithieu");
  expect(await (await fetchResult).text()).not.toBeUndefined();
});

