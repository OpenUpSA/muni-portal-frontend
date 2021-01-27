const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";

export class API {
  constructor() {
    if (window.location.search.includes("promptapi"))
      sessionStorage.setItem(
        "apiBaseUrl",
        window.prompt("Enter the API base URL", defaultBaseUrl)
      );
    this.baseUrl = sessionStorage.getItem("apiBaseUrl") || defaultBaseUrl;
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
      const userToken = localStorage.getItem("user");
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
      const userToken = localStorage.getItem("user");
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
      const userToken = localStorage.getItem("user");
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

function handleRefreshTokenExpired(deferred, jqXHR, args) {
  alert("Your session has expired. Sorry.");
  // reject with the original 401 response
  deferred.rejectWith(jqXHR, args);
}

function handleAccessTokenRefreshed(response, deferred, originalOptions) {
  window.console.log("refresh was successful, retrying original request");
  // set new access token
  localStorage.setItem("user", response.access);
  // retry with a copied originalOpts with refreshRequest.
  let newOpts = $.extend({}, originalOptions, {
    refreshRequest: true,
    headers: {
      authorization: `Bearer ${response.access}`,
    },
  });
  // pass this one on to our deferred pass or fail.
  $.ajax(newOpts).then(deferred.resolve, deferred.reject);
}

function retryAjaxWithRefreshedToken(deferred, jqXHR, args, originalOptions) {
  const baseUrl = sessionStorage.getItem("apiBaseUrl") || defaultBaseUrl;
  const url = `${baseUrl}/api/token/refresh/`;
  const refreshToken = `${localStorage.getItem("refresh")}`;

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
  Any AJAX request that fails due to a 401 status code (unauthorised) will
  refresh the access token by doing a POST with the local refresh token
  and then repeat the original request with the new access token.

  In other words, if the access token expires, we fetch a new one and continue
  as normal.
*/
$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  // enable this on a retry request to avoid infinite recursion
  window.console.log("running prefilter");
  if (options.refreshRequest) {
    window.console.log("refreshRequest === true, returning");
    return;
  }

  // our own deferred object to handle done/fail callbacks
  let deferred = $.Deferred();

  // if the request is successful, return normally
  jqXHR.done(deferred.resolve);

  // if the request fails, do something else but still resolve
  jqXHR.fail(() => {
    const args = Array.prototype.slice.call(arguments);
    window.console.log("request failed");
    if (jqXHR.status === 401) {
      window.console.log("status was 401, attempting refresh");
      retryAjaxWithRefreshedToken(deferred, jqXHR, args, originalOptions);
    } else {
      window.console.log("status was not 401");
      deferred.rejectWith(jqXHR, args);
    }
  });

  // Now override the jqXHR's promise functions with our deferred
  return deferred.promise(jqXHR);
});