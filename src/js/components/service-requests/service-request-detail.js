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

    // Reroute the click event from the Add element to the html input element
    $uploadImageAdd.click(function () {
      $uploadImagesInput.click();
    });

    /* We keep a mapping of uploaded images separate from the FileList stored on
    the input object because we want previously selected images to persist after
    the user clicks the plus action a second time to upload more images.

    The user can remove images by clicking the cross on a preview which we
    facilitate by removing the image from the uploadedFiles object and deleting
    the preview element.

    We later transform this uploadedFiles object into a FormData object
    instead of submitting the data from the form containing the file input.
     */
    let uploadedFiles = {};

    function handleFileUpload() {
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
          delete uploadedFiles[uuid];
          $("#upload-image-preview-" + uuid).remove();

          if (Object.keys(uploadedFiles).length > 0) {
            $("#submit-images").show();
          } else {
            $("#submit-images").hide();
          }
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
        uploadedFiles[uuid] = this.files[i];
        $uploadImagesClass.append($preview);

        if (Object.keys(uploadedFiles).length > 0) {
          $("#submit-images").show();
        } else {
          $("#submit-images").hide();
        }
      }
    }

    $uploadImagesInput.change(handleFileUpload);

    const $submitButton = $(".components .button.button--form-submit")
      .clone()
      .attr({
        value: "Submit",
        id: "submit-images",
      });

    $submitButton.hide();

    $submitButton.on("click", (event) => {
      event.preventDefault();
      if (Object.keys(uploadedFiles).length === 0) {
        alert("Please select one or more images to upload.");
      }

      let formData = new FormData();
      for (const uuid in uploadedFiles) {
        formData.append("files", uploadedFiles[uuid]);
      }

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

    function renderFilePreview(blob, fileId) {
      let url = URL.createObjectURL(blob);
      const $preview = $uploadImagePreview
        .clone()
        .attr({
          id: "upload-image-preview-" + fileId,
        })
        .removeClass("hidden");

      $preview.find(".image-preview__remove").remove();
      $preview.css("background-image", "url('" + url + "')");
      $uploadImagesClass.append($preview);
    }

    api.getServiceRequestFiles(serviceRequestId).then((response) => {
      for (let index in response) {
        api.getServiceRequestFile(
          serviceRequestId,
          response[index]["id"],
          renderFilePreview
        );
      }
    });
  }

  render() {
    return this.$element;
  }
}
