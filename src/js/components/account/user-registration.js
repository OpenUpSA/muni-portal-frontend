import { API } from "../../api";
import {
  getCustomCheckbox,
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";
import { SUPPORT_EMAIL } from "../constants";

function formatError(jqXHR) {
  let message = "";
  if (jqXHR.status === 400) {
    Object.keys(jqXHR.responseJSON).forEach((fieldName) => {
      message += `${fieldName}:\n${jqXHR.responseJSON[fieldName].join(
        "\n"
      )}\n\n`;
    });
    message += `Please try again or <a href='mailto:${SUPPORT_EMAIL}'>contact support</a> with this message.`;
  } else {
    message = "An error occurred. Please try again.";
    console.error(jqXHR.responseText);
  }
  return message;
}

function getPasswordRequirements() {
  const $container = $("<div />");
  const $heading = $("<h5 />", { text: "Your password must:" });
  const $uList = $("<ul />");
  const requirements = [
    "be at least 9 characters long,",
    "not be similar to your username or email address,",
    "not be just numbers",
  ];

  requirements.forEach((requirement) => {
    const $listItem = $("<li />", { text: requirement });
    $uList.append($listItem);
  });

  $container.append($heading);
  $container.append($uList);

  $container.attr("id", "password-requirements");

  return $container;
}

export class UserRegistration {
  constructor() {
    const $successTemplate = $(".components .form-styles .w-form-done")
      .first()
      .clone();
    const $failTemplate = $(".components .form-styles .w-form-fail")
      .first()
      .clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/register/";
    const fields = [
      {
        label: "Email address",
        type: "email",
        name: "email",
      },
      {
        label: "Username",
        type: "text",
      },
      {
        label: "Password",
        type: "password",
      },
      {
        label: "Confirm password",
        type: "password",
        name: "password_confirm",
      },
    ];

    const $registrationFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Create an account");

    // we cannot just clone the entire Webflow form but, everything
    // else hangs off it so, we get it here to use as the context
    // for other querySelectors
    const $webflowForm = $(".components .form__inner");

    fields.forEach((field) => {
      const $formElementsContainer = $("<div />");
      $formElementsContainer.append(
        getLabel($webflowForm, {
          htmlFor: `my-muni-${field.label
            .split(" ")
            .join("_")
            .toLocaleLowerCase()}`,
          text: field.label,
        })
      );

      if (field.label.toLowerCase() === "password") {
        $formElementsContainer.append(
          getInput(field.type, field.label, "", "password-requirements")
        );
        $formElementsContainer.append(getPasswordRequirements());
      } else if (field.name === "password_confirm" || field.name === "email") {
        $formElementsContainer.append(
          getInput(field.type, field.label, "", null, field.name)
        );
      } else {
        $formElementsContainer.append(getInput(field.type, field.label));
      }

      $form.append($formElementsContainer);
    });

    const $privacyContainer = $("<div />");
    const $privacyPolicyLabel = getLabel($webflowForm, {
      htmlFor: "privacy-policy-checkbox",
      text: "Privacy policy",
    });

    const $privacyPolicyInput = getCustomCheckbox({
      identifier: "privacy-policy-checkbox",
      name: "privacy-policy-checkbox",
      text: "I have read the <a href='/privacy-policy'>privacy policy</a>",
    });

    $privacyContainer.append($privacyPolicyLabel);
    $privacyContainer.append($privacyPolicyInput);
    $form.append($privacyContainer);
    $form.append($submitButton);

    $registrationFormContainer.append($form);
    $registrationFormContainer.append($successTemplate);
    $registrationFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();

      // Check if the user has read the privacy policy
      const $childDiv = $privacyContainer.find(".w-checkbox-input")
      // (our custom component has this class when it is checked)
      const isRead = $childDiv.hasClass("w--redirected-checked");

      if (!$isRead) {
        alert("Please read the privacy policy before registering.")
        return
      }

      this.registerUser(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $registrationFormContainer;
  }

  /**
   * Calls API providing the details of a new user to register
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  registerUser(endPoint, $form, $success, $fail) {
    const api = new API();
    $fail.hide();
    $fail.find("div").empty().css("white-space", "pre-wrap");
    const response = api.registerUser(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success
            .html(
              "Your details have been submitted successfully. " +
                `You should receive an email in the next few minutes to verify your email address. If you don’t, please check your spam folder. If you haven’t received one after 10 minutes, please <a href="mailto:${SUPPORT_EMAIL}">contact support.</a>`
            )
            .show();
        }
      })
      .fail((jqXHR, textStatus) => {
        try {
          $fail.find("div").html(formatError(jqXHR));
          $fail.show();
          $fail[0].scrollIntoView({ behavior: "smooth" });
        } catch (e) {
          console.error(e);
          alert(
            `An error occurred. Please try again or contact support at ${SUPPORT_EMAIL}`
          );
        }
      });
  }

  render() {
    return this.$element;
  }
}
