export class Checkbox {
  constructor(props) {
    const { label } = props;
    const $webflowForm = $(".components .form__inner");
    this.$element = $webflowForm.find(".form-checkbox").clone();
    this.$element.find(".checkbox-label").text(label);
  }

  render() {
    return this.$element;
  }
}
