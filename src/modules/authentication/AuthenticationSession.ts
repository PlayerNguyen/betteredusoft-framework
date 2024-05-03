export default class AuthenticationSession {
  studentId: string;
  fullName: string;
  sessionId: string;

  constructor(studentId: string, fullName: string, sessionId: string) {
    this.studentId = studentId;
    this.fullName = fullName;
    this.sessionId = sessionId;
  }
}
