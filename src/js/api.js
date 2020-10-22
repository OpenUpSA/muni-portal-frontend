const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";

export class API {
  constructor() {
    if (window.location.search.includes("promptapi"))
      sessionStorage.setItem('apiBaseUrl', window.prompt("Enter the API base URL", defaultBaseUrl));
    this.baseUrl = sessionStorage.getItem("apiBaseUrl") || defaultBaseUrl;
  }

  getAdministrationIndex() {
    const searchParams = new URLSearchParams([
      ["type", "core.AdministrationIndexPage"],
      ["fields", "*"],
    ]);
    const administrationIndexPagesUrl = `${this.baseUrl}/api/wagtail/v2/pages/?${searchParams.toString()}`;
  
    return $.get(administrationIndexPagesUrl);
  }

  getMyMuniID() {
    const searchParams = new URLSearchParams([
      ["type", "core.MyMuniPage"],
      ["fields", "*"],
    ]);
    const myMuniPagesUrl = `${this.baseUrl}/api/wagtail/v2/pages/?${searchParams.toString()}`;

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
    ]);
    const servicePagesUrl = `${this.baseUrl}/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(servicePagesUrl);
  }

  getService(slug) {
    const searchParams = new URLSearchParams([
      ["type", "core.ServicePage"],
      ["fields", "*"],
      ["slug", slug]
    ]);
    const serviceUrl = `${this.baseUrl}/api/wagtail/v2/pages/?${searchParams.toString()}`;
    return $.get(serviceUrl);
  }
}
