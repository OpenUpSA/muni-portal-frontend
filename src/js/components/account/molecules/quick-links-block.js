import BasicNonLinkBlock from "../../atoms/basic-non-link-block";

export default class QuickLinksBlock {
  constructor() {
    const $quickLinksContainer = $("<ul />");
    const quickLinks = [
      `Don’t have an account? <a href="/accounts/register/">Register</a>`,
      `Forgot your password? <a href="/accounts/forgot-password/">Reset password</a>`,
    ];

    for (const link of quickLinks) {
      $quickLinksContainer.append(
        $("<li />", {
          html: link,
        })
      );
    }

    this.$element = new BasicNonLinkBlock({
      content: $quickLinksContainer,
    }).render();
  }

  render() {
    return this.$element;
  }
}
