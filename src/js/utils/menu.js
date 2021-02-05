import { getAnchorElement } from "./element-factory";

/**
 * Adds an event listener to the logout button and logs out the
 * current user by clearing the `user` entry in `localStorage`
 * @param {jqObject} $logoutButton - the logout button element
 */
function handleLogout($logoutButton) {
  $logoutButton.on("click", () => {
    localStorage.removeItem("user");
    setMenuState();
    window.location = "/services/";
  });
}

/**
 * This is a temporary measure until the links are updated in Webflow
 */
export const updateMenuLinks = () => {
  $(".nav-menu__links a:contains('Contact')").remove();

  const singinLink = $(".nav-menu__links a:nth-child(1)");
  singinLink.attr("href", "/accounts/login/");

  const createAccountLink = $(".nav-menu__links a:nth-child(2)");
  createAccountLink.attr("href", "/accounts/register/");
};

export const setMenuState = () => {
  const $navMenu = $(".nav-menu__links");
  const $loginLink = getAnchorElement(
    "/accounts/login/",
    "nav-link w-inline-block",
    "Login"
  );
  const $logoutButton = $("<button />", {
    class: "nav-link w-inline-block",
    id: "my-muni-logout",
    type: "button",
    text: "Logout",
  });
  const $registerLink = getAnchorElement(
    "/accounts/register/",
    "nav-link w-inline-block",
    "Register"
  );
  const $settingsLink = getAnchorElement(
    "/accounts/settings/",
    "nav-link w-inline-block",
    "Settings"
  );

  $navMenu.find(".nav-link").remove();
  $navMenu.append([$loginLink, $logoutButton, $registerLink, $settingsLink]);

  if (localStorage.getItem("user")) {
    $loginLink.hide();
    $registerLink.hide();

    $logoutButton.show();
    $navMenu.append($settingsLink);

    handleLogout($logoutButton);
  } else {
    $logoutButton.hide();
    $settingsLink.hide();

    $loginLink.show();
    $registerLink.show();
  }
};
