import path from "path";
import { Edusoft } from "../../src";

export class TestUtils {
  public static async createLoggedInEdusoftClient() {
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

  public static exportHTMLToTestOutput(data: string) {
    Bun.write(path.join(process.cwd(), `.test-output.html`), data);
  }
}
