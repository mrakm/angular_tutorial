import { kebabCase } from "lodash";

export class ErrorHandler {
  static invalidLogin = { error: true, status: 404, message: 'Invalid username or password.', code: 101 };
  static invalidToken = { error: true, status: 400, message: 'Invalid token or token has been expired.', code: 104 };
  static notActive = { error: true, status: 403, message: 'You are not Active User', code: 102 };
  static notPermitted = { error: true, status: 403, message: 'You are not authorized for this action.', code: 105 };
  static recordNotFound = { error: true, status: 400, message: 'Record not found.', code: 106 };
  static invalidEmail = { error: true, status: 400, message: 'The given email address is not valid.', code: 109 };
  static invalidPassword = { error: true, status: 400, message: 'The given password is not valid.', code: 110 };
  static accountAlreadyExists = { error: true, status: 409, message: 'The specified account already exists.', code: 116 };
  static internalServerError = { error: true, status: 500, message: 'The server encountered an internal error. Please retry the request.', code: 120 };
  static invalidFileType = { error: true, status: 400, message: 'This file type is not valid.', code: 121 };
  static invalidFileSize = { error: true, status: 403, message: 'File size is invalid.', code: 122 };
  static duplicateEmail = { error: true, status: 403, message: "Provided userName/email already exists in our system", code: 123 }
  static duplicateEntry = { error: true, status: 400, message: "Duplicate record Error.", code: 124 }
  static childrenExists = { error: true, status: 400, message: "This record has children.", code: 125, data: {} };


  static send(err, res, next) {
    return res.status(err['status']).send(err);
  }

  static sendServerError(err, res, next) {
    console.log('Server Error: ' + err);
    return res.status(ErrorHandler.internalServerError.status).send(ErrorHandler.internalServerError);
  }

  static sendAuthorizationError(err, res, next) {
    return res.status(err.status).send(err);
  }

  static sendFileSizeError(err, res, next) {
    return res.status(ErrorHandler.invalidFileSize.status).send(ErrorHandler.invalidFileSize);
  }

  static sendFileTypeError(err, res, next) {
    return res.status(ErrorHandler.invalidFileType.status).send(ErrorHandler.invalidFileType);
  }

}
