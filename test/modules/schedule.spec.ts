import { describe, expect, test } from "bun:test";
import { TestUtils } from "../utils";

describe("[schedule]", () => {
  test(`[midterm] should retrieve a midterm as json`, async () => {
    const edusoft = await TestUtils.createLoggedInEdusoftClient();
    const output = await edusoft.getExamSchedule().getMidterm();
    console.log(output);

    expect(output).not.toBeUndefined();
    expect(output).toBeInstanceOf(Array);
  });
});
