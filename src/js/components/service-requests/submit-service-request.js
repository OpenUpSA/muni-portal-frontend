import { FullWidthGrid } from "../grid";
import { getFieldset, getLabel, getLegend } from "../../utils/element-factory";

export class SubmitServiceRequest {
  constructor() {
    const children = [];

    const $formInputTmpl = $(".components .input-field:eq(0)");

    const $serviceAreaFieldset = getFieldset();
    const $serviceAreaLegend = getLegend("Service area of request");
    const $selectServiceArea = $(".components .dropdown:eq(0)").clone();

    $serviceAreaFieldset.append($serviceAreaLegend);
    $serviceAreaFieldset.append($selectServiceArea);

    const $addressFieldset = getFieldset();
    const $addressLegend = getLegend("Address");

    const $streetNameLabel = getLabel("Street name");
    const $streetNameInput = $formInputTmpl.clone().attr({
      id: "street-name",
      name: "street_name",
      placeholder: "",
    });

    const $streetNumberLabel = getLabel("Street Number");
    const $streetNumberInput = $formInputTmpl.clone().attr({
      id: "street-number",
      name: "street_number",
      type: "number",
      placeholder: "",
    });

    $addressFieldset.append([
      $addressLegend,
      $streetNameLabel,
      $streetNameInput,
      $streetNumberLabel,
      $streetNumberInput,
    ]);

    const $yourInfoFieldset = getFieldset();
    const $yourInfoLegend = getLegend("Your information");

    const $firstNameLabel = getLabel("First name");
    const $firstNameInput = $formInputTmpl.clone().attr({
      id: "first-name",
      name: "first_name",
      placeholder: "",
    });

    const $lastNameLabel = getLabel("Last name");
    const $lastNameInput = $formInputTmpl.clone().attr({
      id: "last-name",
      name: "last_name",
      placeholder: "",
    });

    const $cellNumberLabel = getLabel("Cellphone number");
    const $cellNumberInput = $formInputTmpl.clone().attr({
      id: "cellphone-number",
      name: "cellphone_number",
      placeholder: "",
      type: "tel",
    });

    const $emailLabel = getLabel("Email address");
    const $emailInput = $formInputTmpl.clone().attr({
      id: "email-address",
      name: "email_address",
      placeholder: "",
      type: "email",
    });

    $yourInfoFieldset.append([
      $yourInfoLegend,
      $firstNameLabel,
      $firstNameInput,
      $lastNameLabel,
      $lastNameInput,
      $cellNumberLabel,
      $cellNumberInput,
      $emailLabel,
      $emailInput,
    ]);

    children.push($serviceAreaFieldset);
    children.push($addressFieldset);
    children.push($yourInfoFieldset);

    this.$element = new FullWidthGrid(children).render();
  }

  render() {
    return this.$element;
  }
}
