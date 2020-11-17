import { API } from "../api";

export class UserRegistration {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const userRegisterUrl = "/api/accounts/register/";
    const fields = [
      {
        label: "email",
        type: "email",
      },
      {
        label: "username",
        type: "text",
      },
      {
        label: "password",
        type: "password",
      },
      {
        label: "password confirm",
        type: "password",
      },
    ];

    const $registrationFormContainer = $("<div />", {
      class: "form w-form",
    });
    const $form = $("<form />", {
      action: `${defaultBaseUrl}${userRegisterUrl}`,
      class: "form__inner",
      method: "post",
    });
    const $submitButton = $("<button />", {
      class: "button form-submit w-button",
      type: "submit",
      text: "Register",
    });

    fields.forEach((field) => {
      const $formElementsContainer = $("<div />");
      $formElementsContainer.append(this.getLabel(field.label));
      $formElementsContainer.append(this.getInput(field.type, field.label));
      $form.append($formElementsContainer);
    });

    $form.append($submitButton);

    $registrationFormContainer.append($form);
    $registrationFormContainer.append($successTemplate);
    $registrationFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();
      const api = new API();
      const response = api.registerUser(userRegisterUrl, $form.serialize());
      response
        .done((response, textStatus) => {
          if (textStatus === "success") {
            $form.hide();
            $successTemplate.show();
          }
        })
        .fail((jqXHR, textStatus) => {
          $form.hide();
          $failTemplate.show();
          console.error(jqXHR, textStatus);
        });
    });

    this.$element = $registrationFormContainer;
  }

  getInput(type, label) {
    const name = label.split(" ").join("_");
    return $("<input />", {
      class: "card input-field w-input",
      type: type,
      name: name,
      id: `registration-${label}`,
    });
  }

  getLabel(label) {
    return $("<label />", {
      for: label,
      text: label,
    });
  }

  render() {
    return this.$element;
  }
}
