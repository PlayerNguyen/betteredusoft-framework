import Authentication from "./authentication";
import { ExamSchedule } from "./exam-schedule";
import Fetcher from "./fetcher";

export default class Edusoft {
  private authentication: Authentication;
  private fetcher: Fetcher;
  private examSchedule?: ExamSchedule;
  /**
   * Create a new instance of Edusoft.
   *
   */
  constructor() {
    this.authentication = new Authentication();
    this.fetcher = new Fetcher(this);
  }

  /**
   * Retrieves a current authentication object.
   * @returns an authentication object.
   */
  public getAuthentication() {
    return this.authentication;
  }

  public getFetcher() {
    return this.fetcher;
  }

  public getExamSchedule() {
    let examSchedule;

    examSchedule =
      this.examSchedule === undefined
        ? new ExamSchedule(this)
        : this.examSchedule;

    return examSchedule;
  }
}
