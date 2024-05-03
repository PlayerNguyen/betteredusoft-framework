import * as cheerio from "cheerio";
import AuthenticationSession from "./AuthenticationSession";
const DEFAULT_ENDPOINT = "https://edusoftweb.hcmiu.edu.vn/default.aspx";

const FIELD_USERNAME_KEY = `ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa`;
const FIELD_PASSWORD_KEY = `ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau`;
const ERROR_ATTRIBUTE_ID = `ContentPlaceHolder1_ctl00_ucDangNhap_lblError`;

export async function fetchPreloadLoginData() {
  const response = await fetch(DEFAULT_ENDPOINT, { method: "GET" });

  return {
    cookies: response.headers.getSetCookie(),
    body: await response.text(),
  };
}

/**
 * Extracts session id from a set of cookies.
 *
 * @param cookies a full set of cookies
 * @returns a cookie with name ASP_SessionId
 */
export async function extractSessionID(cookies: string[]) {
  if (cookies === undefined) throw new Error(`Set-cookies cannot be undefined`);

  for (let val of cookies) {
    if (val.match(/ASP.NET_SessionId=+/)) {
      return val.split(";")[0].split(`=`)[1];
    }
  }

  return undefined;
}

export async function extractInputFields(body: string) {
  if (body === undefined) throw new Error(`Body cannot be undefined`);

  const selector = cheerio.load(body);
  const inputs = selector("form input");

  const obj = {};
  for (let input of inputs) {
    // @ts-ignore
    obj[input.attribs["name"]] = input.attribs["value"];
  }

  return obj;
}

export async function doLoginWithPreloadedData(
  data: {
    cookies: string[];
    body: string;
  },
  username: string,
  password: string
) {
  /**
   * Extract session id
   */
  const sessionId = await extractSessionID(data.cookies);
  if (!sessionId) {
    throw new Error(`Unable to extract session id`);
  }

  /**
   * Extract fields from DOM
   */
  let fields = await extractInputFields(data.body);
  const formData = new FormData();
  for (let field in fields) {
    // @ts-ignore
    formData.set(field, fields[field] || "");
  }

  formData.set(FIELD_USERNAME_KEY, username);
  formData.set(FIELD_PASSWORD_KEY, password);

  // Normalize the form data for login
  formData.set("__EVENTTARGET", "");
  formData.set("__EVENTARGUMENT", "");
  formData.delete("ctl00$ContentPlaceHolder1$ctl00$MessageBox1$imgCloseButton");
  formData.delete("ctl00$ContentPlaceHolder1$ctl00$MessageBox1$btnOk");

  const headers = new Headers({});
  headers.append("Cookie", `ASP.NET_SessionId=${sessionId}`);

  const response = await fetch(DEFAULT_ENDPOINT, {
    method: "POST",
    body: formData,
    headers: headers,
  });

  const outputHtml = await response.text();
  const selector1 = cheerio.load(outputHtml);
  const errText = selector1(`#${ERROR_ATTRIBUTE_ID}`).text();

  if (errText !== "") {
    throw new Error(
      `There was an error when trying to sign in. [${
        errText || "undefined error"
      }] `
    );
  }

  // If success, create an auth
  const rawUserInformation = selector1(
    "span#Header1_Logout1_lblNguoiDung"
  ).text();
  const chopped = rawUserInformation.split(" ");
  const fullName = chopped.slice(2, chopped.length - 1).join(" ");
  const studentId = chopped[chopped.length - 1].slice(
    1,
    chopped[chopped.length - 1].length - 1
  );

  console.log(`Logged in with student full name ${fullName} (${sessionId})`);

  return new AuthenticationSession(studentId, fullName, sessionId);
}
