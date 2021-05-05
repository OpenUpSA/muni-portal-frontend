// Headings
export const getSectionHeading = (text) => {
  const $sectionHeadingContainer = $(".components .section-heading").clone();
  $sectionHeadingContainer.find("h2").text(text);

  return $sectionHeadingContainer;
};

export const getCustomCheckbox = (props) => {
  const { identifier, name, text } = props;

  const $checkbox = $(".components .w-checkbox").clone();
  const $checkboxInput = $checkbox.find("input");
  const $checkboxLabel = $checkbox.find(".checkbox-label");

  $checkbox.attr("for", identifier);

  $checkboxInput.attr("id", identifier);
  $checkboxInput.attr("data-name", identifier);
  $checkboxInput.attr("name", name);

  $checkboxLabel.text(text);

  return $checkbox;
};

export const getDiv = (className) => {
  return $("<div />", {
    class: className,
  });
};

export const getAnchorElement = (href, className, text) => {
  return $("<a />", {
    href,
    class: className,
    text,
  });
};

export const getForm = (action, method, name = "") => {
  return $("<form />", {
    action,
    name,
    method,
    class: "form__inner",
  });
};

/**
 * Returns an input field with the type, label, and value
 * attributes set. The third parameter, if provided, is used
 * to set the value for aria-describedby. For example:
 * * getInput("email", "email address", "default@example.com");
 * getInput("email", "Username", "default@example.com", null, "login");
 * getInput("email", "Username", "default@example.com", "a11y-description", "login");
 * @param {string} type - The type of input element
 * @param {string} label  - The text label for the input element
 * @param {string} [value] - value of the element [defaults to empty string]
 * @param {string} [describedBy] - is to use as the value for aria-describedby
 * @param {string} [name] - an optional value to use for the name attribute
 */
export const getInput = (type, label, value = "", describedBy, name) => {
  const inputName = name
    ? name
    : label.split(" ").join("_").toLocaleLowerCase();
  const $input = $("<input />", {
    class: "card input-field w-input",
    type: type,
    name: inputName,
    value: value,
    id: `my-muni-${label}`,
  });

  if (describedBy) {
    $input.attr("aria-describedby", describedBy);
  }

  return $input;
};

export const getFieldset = () => {
  return $("<fieldset />");
};

export const getLegend = ($webflowForm, props) => {
  const $legend = $webflowForm.find(".form__legend-block legend").clone();
  return $legend.text(props.text);
};

export const getLabel = ($webflowForm, props) => {
  const $label = $webflowForm.find("> .form__field-label").clone();
  $label.empty();
  return $label.attr("for", props.htmlFor).text(props.text);
};

export const getSubmitButton = (text) => {
  return $("<button />", {
    class: "button form-submit w-button",
    type: "submit",
    text: text,
  });
};

export const getHiddenField = ({ id, name }) => {
  return $("<input/>", {
    id,
    name,
    type: "hidden",
  });
};
