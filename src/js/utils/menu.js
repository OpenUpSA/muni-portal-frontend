import { getAnchorElement } from "./element-factory";

/**
 * Adds an event listener to the logout button and logs out the
 * current user by clearing the `user` entry in `localStorage`
 * @param {jqObject} $logoutButton - the logout button element
 */
function handleLogout($logoutButton) {
  $logoutButton.on("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
  const $serviceRequestsIndex = getAnchorElement(
    "/service-requests/",
    "nav-link w-inline-block",
    "My complaints and requests"
  );
  const $settingsLink = getAnchorElement(
    "/accounts/settings/",
    "nav-link w-inline-block",
    "Settings"
  );
  const $supportLink = getAnchorElement(
    "mailto:cape-agulhas-app@openup.org.za?subject=Cape%20Agulhas%20App%20Support%20Request&body=Page: ",
    "nav-link w-inline-block",
    "App support and feedback"
  );

  $navMenu.find(".nav-link").remove();
  $navMenu.append([
    $loginLink,
    $logoutButton,
    $registerLink,
    $settingsLink,
    $serviceRequestsIndex,
    $supportLink,
  ]);
  Webflow.require("ix2").init();

  if (localStorage.getItem("accessToken")) {
    $loginLink.hide();
    $registerLink.hide();

    $logoutButton.show();
    $serviceRequestsIndex.show();
    $settingsLink.show();

    handleLogout($logoutButton);
  } else {
    $logoutButton.hide();
    $settingsLink.hide();

    $loginLink.show();
    $serviceRequestsIndex.show();
    $registerLink.show();
  }

  $supportLink.on("click", () => {
    const currentHref = $supportLink.attr("href");
    $supportLink.attr("href", currentHref + document.location.href);
  });
};
