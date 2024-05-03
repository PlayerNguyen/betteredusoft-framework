import type AuthenticationSession from "./AuthenticationSession";
import { doLoginWithPreloadedData, fetchPreloadLoginData } from "./login";

export default class Authentication {
  private session?: AuthenticationSession;

  /**
   * Submits a request to login with provided credentials.
   *
   * @throws if a credential is not valid.
   * @param username a username of user.
   * @param password a password of user.
   */
  public async login(username: string, password: string) {
    if (username === undefined || password === undefined)
      throw new Error(`Username or password cannot be undefined`);

    // Make a first request
    const initialRequest = await fetchPreloadLoginData();

    // Then do login
    this.session = await doLoginWithPreloadedData(
      initialRequest,
      username,
      password
    );
  }

  public isLogged() {
    return this.session !== undefined;
  }

  public getSession() {
    return this.session;
  }
}
