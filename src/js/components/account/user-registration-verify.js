import { API } from "../../api";

export class VerifyUserRegistration {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();
    const userDetails = new URL(document.location).searchParams.toString();

    $successTemplate
      .empty()
      .append("Your registration was successfully verified. You can now login");
    $failTemplate
      .empty()
      .append(
        "Registration verification was unsuccessful. Please try again or contact support"
      );

    this.$element = $("<div />").append([$successTemplate, $failTemplate]);
    this.verifyUser(userDetails, $successTemplate, $failTemplate);
  }

  /**
   * Calls API end point with user verification details parsed from URL.
   * Shows success or fail message to end user
   * @param {String} userDetails - user verification details as a string
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  verifyUser(userDetails, $success, $fail) {
    const api = new API();
    const verifyEndpoint = "/api/accounts/verify-registration/";
    const response = api.verifyUserRegistration(verifyEndpoint, userDetails);
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $success.show();
        }
      })
      .fail((jqXHR, textStatus) => {
        console.error(jqXHR, textStatus);
        $fail.show();
      });
  }

  render() {
    return this.$element;
  }
}
