import { ExceptionHandler } from "../contracts";

export abstract class BaseHTTPService {
    constructor(
      public exceptionHandler: ExceptionHandler
    ) { }
}