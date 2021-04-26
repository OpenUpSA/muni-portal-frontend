import { API } from "../../api";
import { SERVICE_REQUEST_STATUS } from "../constants";

import { getDateString } from "../../utils/date";

import { BasicBlock } from "../basic-block";
import { BlockPreWrap } from "../atoms/block-pre-wrap";
import { FullWidthGrid } from "../grid";
import { LoadingPlaceholder } from "../atoms/loading-placeholder";
import { StatusMessage } from "../molecules/status-message";
import { v4 as uuidv4 } from "uuid";
import { getLabel } from "../../utils/element-factory";
import { ServiceRequestSubmitted } from "./service-request-submitted";

export class ServiceRequestDetail {
  constructor() {
    const api = new API();
    const url = new URL(document.location.href);
    const $loadingPlaceholder = new LoadingPlaceholder(
      "Loading service request details..."
    );
    const serviceRequestId = new URLSearchParams(url.search).get("id");
    const $sectionHeading = $(".components .section-heading");

    const $formInputTmpl = $(".components .form__input-field:eq(0)");
    const $uploadImagesLabel = getLabel("Images of your issue");
    const $uploadImagesInput = $formInputTmpl.clone().attr({
      id: "upload-images-input",
      name: "files",
      type: "file",
      accept: "image/*",
      multiple: true,
      style: "display: none",
    });
    const $uploadImagesClass = $(".upload-images");
    const $uploadImagePreview = $(".image-preview");
    const $uploadImageAdd = $(".button.button--add-image");

    $uploadImageAdd.click(function () {
      $uploadImagesInput.click();
    });

    let selectedImages = {};

    function handleFileUpload() {
      window.console.log(this.files);
      for (let i = 0; i < this.files.length; i++) {
        let uuid = uuidv4();
        const $preview = $uploadImagePreview
          .clone()
          .attr({
            id: "upload-image-preview-" + uuid,
          })
          .removeClass("hidden");

        const $previewRemove = $preview.find(".image-preview__remove");
        $previewRemove.click(function () {
          delete selectedImages[uuid];
          $("#upload-image-preview-" + uuid).remove();
        });

        let reader = new FileReader();
        reader.onload = function (e) {
          // Replace newlines in base64 encoding so it doesn't break CSS
          $preview.css(
            "background-image",
            "url('" + e.target.result.replace(/(\r\n|\n|\r)/gm, "") + "')"
          );
        };
        reader.readAsDataURL(this.files[i]);
        selectedImages[uuid] = this.files[i];
        $uploadImagesClass.append($preview);
        window.console.log(selectedImages);
      }
    }

    $uploadImagesInput.change(handleFileUpload);

    const $submitButton = $(".components .button.button--form-submit")
      .clone()
      .attr({
        value: "Submit",
      });

    $submitButton.on("click", (event) => {
      event.preventDefault();

      let formData = new FormData();
      for (const key in selectedImages) {
        formData.append("files", selectedImages[key]);
      }
      window.console.log("values: ", formData.getAll("files"));

      api
        .submitServiceRequestFiles(serviceRequestId, formData)
        .then((response) => {
          window.console.log(response);
        })
        .fail((a, b) => {
          this.$element.empty().append(
            new StatusMessage({
              text: "Error while updating service request.",
              status: "failure",
            }).render()
          );
          console.error(a, b);
        });
    });

    this.$element = new FullWidthGrid([$loadingPlaceholder]).render();

    api.getServiceRequest(serviceRequestId).then((response) => {
      $loadingPlaceholder.remove();

      const $serviceRequestDetail = $(
        ".components .rich-text.rich-text--basic-block.w-richtext"
      ).clone();
      const $serviceRequestInfoHeading = $sectionHeading.clone();
      const $serviceDescriptionHeading = $sectionHeading.clone();

      $serviceRequestInfoHeading
        .find(".section-title")
        .text("Service request information");

      $serviceDescriptionHeading
        .find(".section-title")
        .text("Service request description");

      this.$element.append($serviceRequestInfoHeading);

      this.$element.append(
        new BasicBlock({
          title: "Date submitted",
          subtitle: response.request_date
            ? getDateString(response.request_date, false)
            : "No date provided",
        }).render()
      );

      this.$element.append(
        new BasicBlock({
          title: "Reference number",
          subtitle: response.on_premis_reference || "No reference number yet",
        }).render()
      );

      this.$element.append(
        new BasicBlock({
          title: "Current status",
          subtitle: SERVICE_REQUEST_STATUS[response.status],
        }).render()
      );

      this.$element.append(
        new BasicBlock({
          title: "Service area",
          subtitle: response.type || "No service type specified",
        }).render()
      );

      this.$element.append(
        new BasicBlock({
          title: "Address",
          subtitle: `${response.street_name} ${response.street_number}, ${response.suburb}`,
        }).render()
      );

      this.$element.append([
        $serviceDescriptionHeading,
        new BlockPreWrap(response.description).render(),
      ]);

      this.$element.append([
        $uploadImagesLabel,
        $uploadImagesInput,
        $uploadImagesClass,
        $submitButton,
      ]);
    });

    api.getServiceRequestFiles(serviceRequestId).then((response) => {
      for (let index in response) {
        api
          // TOOD: instead, set the src of the background-image to this URL
          .getServiceRequestFile(serviceRequestId, response[index]["id"])
          .then((response2) => {
            console.log("got a file!");

            const $preview = $uploadImagePreview
              .clone()
              .attr({
                id: "upload-image-preview-" + response[index]["id"],
              })
              .removeClass("hidden");

            let base64EncodedStr = btoa(
              unescape(encodeURIComponent(response2))
            );
            console.log(base64EncodedStr)
            $preview.css("background-image", "url('" + base64EncodedStr + "')");
            $uploadImagesClass.append($preview);
          });
      }

      // this.$element.append([
      //   $uploadImagesLabel,
      //   $uploadImagesInput,
      //   $uploadImagesClass,
      //   $submitButton,
      // ]);
    });
  }

  render() {
    return this.$element;
  }
}
