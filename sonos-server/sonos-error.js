/**
 * These errors come from the Sonos documentation:
 * https://developer.sonos.com/reference/types/globalerror/
 *
 * However this documentation does not appear to be complete. Some
 * errors handled in this class are undocumented.
 */
export class SonosError extends Error {
  constructor(errorObject) {
    switch (errorObject.errorCode) {
      case "ERROR_RESOURCE_GONE":
        super("The requested resource is no longer available.");
        break;
      case "ERROR_MISSING_PARAMETERS":
        super(errorObject.reason);
        break;
      case "ERROR_INVALID_SYNTAX":
        super("The request was sent with an invalid JSON body.");
        break;
      case "ERROR_UNSUPPORTED_NAMESPACE":
        super("Unrecognized namespace. Is it named correctly?");
        break;
      case "ERROR_UNSUPPORTED_COMMAND":
        super(
          "The request is attempting to perform an action that is unrecognized."
        );
        break;
      case "ERROR_INVALID_PARAMETER":
        super("The request was sent with an invalid parameter");
        break;
      case "ERROR_INVALID_OBJECT_ID":
        super(
          "The object identifier for this request was inconsistent with the expectation."
        );
        break;
      case "ERROR_NOT_CAPABLE":
        super("This device does not support the features you have requested.");
        break;
      default:
        super("There was an unexpected error communicating with the Sonos API");
    }

    this.code = errorObject.errorCode;
    this.reason = errorObject.reason;
  }
}
