import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Edusoft from "..";

dayjs.extend(customParseFormat);

const URL_MIDTERM_ENDPOINT = `https://edusoftweb.hcmiu.edu.vn/Default.aspx?page=xemlichthigk`;

export type ExamItem = {
  index: number;
  courseCode: string;
  courseName: string;
  merge: string;
  totalStudents: number;
  date: Date;
  room: string;
  type: string;
};

export class ExamSchedule {
  private edusoft: Edusoft;

  constructor(edusoft: Edusoft) {
    this.edusoft = edusoft;
  }

  public async getMidterm(): Promise<ExamItem[]> {
    const schedules = this.edusoft
      .getFetcher()
      .createFetch(URL_MIDTERM_ENDPOINT);

    const $ = cheerio.load(await (await schedules).text());
    const tds = $("table#ContentPlaceHolder1_ctl00_gvXem tr td ").text();

    return tds
      .split(`\n`)
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .reduce((prev, cur, index) => {
        if (index % 11 === 0) {
          // @ts-ignore
          prev = [...prev, [cur]];
        } else {
          const lastArrayIndex = prev.length - 1;
          const lastArray = prev[lastArrayIndex];
          // @ts-ignore
          prev[lastArrayIndex] = [...lastArray, cur];
        }
        return prev;
      }, [])
      .map((row) => {
        return {
          index: Number(row[0]),
          courseCode: row[1],
          courseName: row[2],
          merge: row[3],
          totalStudents: Number(row[5]),
          date: dayjs(row[6] + " " + row[7], "DD/MM/YYYY HH:mm").toDate(),
          room: row[8],
          type: row[9],
        };
      });
  }
}
