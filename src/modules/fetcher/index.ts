import type Edusoft from "..";

export default class Fetcher {
  private edusoft: Edusoft;

  constructor(edusoft: Edusoft) {
    this.edusoft = edusoft;
  }

  public createFetch(req: string | URL | Request, init?: RequestInit) {
    // Check if the client is logged in.
    const currentAuth = this.edusoft.getAuthentication();
    if (!currentAuth.isLogged())
      throw new Error(
        `The client has not been logged in. Please first login before create a fetcher.`
      );

    // Set a session id into header token
    const sessionId = currentAuth.getSession()?.sessionId;
    const headers = new Headers(init?.headers);

    headers.set("Cookie", `ASP.NET_SessionId=${sessionId}`);

    const c: RequestInit = {
      ...init,
      headers: headers,
    };

    return fetch(req, c);
  }
}
