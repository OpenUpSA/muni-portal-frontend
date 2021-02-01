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

  login(endPoint, userDetails) {
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({ url, data: userDetails });
  }

  changePassword(endPoint, userDetails) {
    // TODO: note that this won't work when other PR is merged due to "user" becoming "accessToken"
    const userToken = localStorage.getItem("user");
    const url = `${this.baseUrl}${endPoint}`;
    return $.post({
      url,
      headers: { authorization: `Bearer ${userToken}` },
      data: userDetails,
    });
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
