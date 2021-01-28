const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";

function getBaseApiUrl() {
  return sessionStorage.getItem("apiBaseUrl") || defaultBaseUrl;
}

export class API {
  constructor() {
    if (window.location.search.includes("promptapi"))
      sessionStorage.setItem(
        "apiBaseUrl",
        window.prompt("Enter the API base URL", defaultBaseUrl)
      );
    this.baseUrl = getBaseApiUrl();
  }

  getAdministrationIndex() {
    const searchParams = new URLSearchParams([
      ["type", "core.AdministrationIndexPage"],
      ["fields", "*"],
    ]);
    const administrationIndexPagesUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;

    return $.get(administrationIndexPagesUrl);
  }

  getAdministrator(slug) {
    const searchParams = new URLSearchParams([
      ["type", "core.AdministratorPage"],
      ["fields", "*"],
      ["slug", slug],
    ]);
    const serviceUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(serviceUrl);
  }

  getMyMuniID() {
    const searchParams = new URLSearchParams([
      ["type", "core.MyMuniPage"],
      ["fields", "*"],
    ]);
    const myMuniPagesUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;

    return $.get(myMuniPagesUrl);
  }

  getMyMuni(id) {
    const myMuniLinksURL = `${this.baseUrl}/api/wagtail/v2/pages/?child_of=${id}`;
    return $.get(myMuniLinksURL);
  }

  getServices() {
    const searchParams = new URLSearchParams([
      ["type", "core.ServicePage"],
      ["fields", "*"],
      ["limit", "100"],
    ]);
    const servicePagesUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(servicePagesUrl);
  }

  getNoticesIndex() {
    const searchParams = new URLSearchParams([
      ["type", "core.NoticeIndexPage"],
      ["fields", "*"],
    ]);
    const noticeIndexPageUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(noticeIndexPageUrl);
  }

  getService(slug) {
    const searchParams = new URLSearchParams([
      ["type", "core.ServicePage"],
      ["fields", "*"],
      ["slug", slug],
    ]);
    const serviceUrl = `${
      this.baseUrl
    }/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(serviceUrl);
  }

  getPageByPath(path) {
    const searchParams = new URLSearchParams([["html_path", path]]);
    const url = `${
      this.baseUrl
    }/api/wagtail/v2/pages/find?${searchParams.toString()}`;
    return $.get(url);
  }

  getUserProfile() {
    const url = `${this.baseUrl}/api/accounts/profile/`;

    try {
      const userToken = localStorage.getItem("accessToken");
      if (!userToken) {
        throw new Error("No user set. Unable to get user profile information.");
      }

      return $.get({
        url,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  getVAPIDKey() {
    const url = `${this.baseUrl}/api/webpush/public-key/`;

    try {
      const userToken = localStorage.getItem("accessToken");
      if (!userToken) {
        throw new Error("No user set. Unable to get user profile information.");
      }

      return $.get({
        url,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  createPushSubscription(subscriptionData) {
    const url = `${this.baseUrl}/api/webpush/subscription/`;

    try {
      const userToken = localStorage.getItem("accessToken");
      if (!userToken) {
        throw new Error("No user set. Unable to get user profile information.");
      }

      return $.post({
        url,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        contentType: "application/json",
        data: subscriptionData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  login(endPoint, userDetails) {
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({ url, data: userDetails });
  }

  registerUser(endPoint, userDetails) {
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({ url, data: userDetails });
  }

  sendResetLink(endPoint, userDetails) {
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({ url, data: userDetails });
  }

  verifyUserRegistration(endPoint, userDetails) {
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({ url, data: userDetails });
  }
}

/*
  Any AJAX request that fails due to a 401 status code (unauthorised) will
  attempt to refresh the access token by doing a POST with the local refresh token
  and, if successful, repeat the original request with the new access token.

  If the refresh fails, it will log the user out and redirect them to the login
  page.
*/
$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  // enable this on a retry request to avoid infinite recursion
  if (options.refreshRequest) {
    return;
  }

  let deferred = $.Deferred();

  jqXHR.done(deferred.resolve);

  jqXHR.fail(() => {
    const args = Array.prototype.slice.call(arguments);
    if (jqXHR.status === 401) {
      retryAjaxWithRefreshedToken(deferred, jqXHR, args, originalOptions);
    } else {
      deferred.rejectWith(jqXHR, args);
    }
  });

  // Now override the jqXHR's promise functions with our deferred
  return deferred.promise(jqXHR);
});

/*
  Refresh our access token using our refresh token and then either retry
  the original request or log the user out.
 */
function retryAjaxWithRefreshedToken(deferred, jqXHR, args, originalOptions) {
  const baseUrl = getBaseApiUrl();
  const url = `${baseUrl}/api/token/refresh/`;
  const refreshToken = `${localStorage.getItem("refreshToken")}`;

  return $.ajax({
    method: "POST",
    url: url,
    contentType: "application/json",
    data: JSON.stringify({ refresh: refreshToken }),
    refreshRequest: true,
    error: () => {
      handleRefreshTokenExpired(deferred, jqXHR, args);
    },
    success: (response) => {
      handleAccessTokenRefreshed(response, deferred, originalOptions);
    },
  });
}

/*
  Log the user out and redirect them to the login page.
 */
function handleRefreshTokenExpired(deferred, jqXHR, args) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // reject with the original 401 response
  deferred.rejectWith(jqXHR, args);
  window.location.replace("/accounts/login/");
}

/*
  Set the new access token and retry the original request
 */
function handleAccessTokenRefreshed(response, deferred, originalOptions) {
  localStorage.setItem("accessToken", response.access);
  // retry original request with refreshRequest and the new access token
  let newOptions = $.extend({}, originalOptions, {
    refreshRequest: true,
    headers: {
      authorization: `Bearer ${response.access}`,
    },
  });
  // pass this one on to our deferred pass or fail.
  $.ajax(newOptions).then(deferred.resolve, deferred.reject);
}
