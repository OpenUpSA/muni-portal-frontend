export const getDiv = (className) => {
  return $("<div />", {
    class: className,
  });
};

export const getForm = (action, method) => {
  return $("<form />", {
    action: action,
    class: "form__inner",
    method: method,
  });
};

export const getInput = (type, label) => {
  const name = label.split(" ").join("_");
  return $("<input />", {
    class: "card input-field w-input",
    type: type,
    name: name,
    id: `my-muni-${label}`,
  });
};

export const getLabel = (label) => {
  return $("<label />", {
    for: label,
    text: label,
  });
};

export const getSubmitButton = (text) => {
  return $("<button />", {
    class: "button form-submit w-button",
    type: "submit",
    text: text,
  });
};
