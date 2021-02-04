import { getAnchorElement } from "./element-factory";

/**
 * Adds an event listener to the logout button and logs out the
 * current user by clearing the `user` entry in `localStorage`
 * @param {jqObject} $logoutButton - the logout button element
 */
function handleLogout($logoutButton) {
  $logoutButton.on("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken")
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
  const $signinLink = $(".nav-menu__links a:nth-child(1)");
  const $registerLink = $(".nav-menu__links a:nth-child(2)");

  let $logoutButton = $("#my-muni-logout");

  if (localStorage.getItem("accessToken")) {
    const settingsLink = getAnchorElement(
      "/account/settings/",
      "nav-link w-inline-block",
      "Settings"
    );
    if ($logoutButton.length === 0) {
      $logoutButton = $("<button />", {
        class: "nav-link w-inline-block w--current",
        id: "my-muni-logout",
        type: "button",
        text: "Logout",
      });
      $navMenu.append($logoutButton);
    } else {
      $logoutButton.show();
    }

    $navMenu.append(settingsLink);

    $signinLink.hide();
    $registerLink.hide();

    handleLogout($logoutButton);
  } else {
    if (!$logoutButton) {
      return;
    }

    $logoutButton.hide();
    $signinLink.show();
    $registerLink.show();
  }
};
