export class UseFulFunctions {
  static getErrorMessage(error) {
    return error instanceof Error
      ? error.message
      : "An unknown error occurred.";
  }
}
