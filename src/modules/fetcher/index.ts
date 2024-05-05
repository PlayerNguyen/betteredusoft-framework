import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import type Edusoft from "..";

export default class Fetcher {
  private edusoft: Edusoft;
  private axiosInstance: AxiosInstance;

  constructor(edusoft: Edusoft) {
    this.edusoft = edusoft;
    this.axiosInstance = axios.create();
  }

  public createFetch(url: string, config?: AxiosRequestConfig<any>) {
    // Check if the client is logged in.
    const currentAuth = this.edusoft.getAuthentication();
    if (!currentAuth.isLogged())
      throw new Error(
        `The client has not been logged in. Please first login before create a fetcher.`
      );

    // Set a session id into header token
    const sessionId = currentAuth.getSession()?.sessionId;

    this.axiosInstance.interceptors.request.use(
      function (config) {
        config.headers.Cookie = `ASP.NET_SessionId=${sessionId}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    return this.axiosInstance(url, config);
  }
}
