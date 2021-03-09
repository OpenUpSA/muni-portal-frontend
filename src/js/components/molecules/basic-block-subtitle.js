export class BasicBlockWithSubtitle {
  constructor({ title, subtitle }) {
    this.$element = $(".components .basic-block--subtitle").clone();
    console.log(this.$element);
    this.$element.find(".h3-block-title").text(title);
    this.$element.find(".subtitle").text(subtitle);
  }

  render() {
    return this.$element;
  }
}
