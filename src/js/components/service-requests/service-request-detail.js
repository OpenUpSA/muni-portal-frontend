import { API } from "../../api";
import { SERVICE_REQUEST_STATUS } from "../constants";

import { getDateString } from "../../utils/date";

import { BasicBlock } from "../basic-block";
import { BlockPreWrap } from "../atoms/block-pre-wrap";
import { FullWidthGrid } from "../grid";
import { LoadingPlaceholder } from "../atoms/loading-placeholder";
import { StatusMessage } from "../molecules/status-message";
import {
  createImageFormFields,
  getFormDataFromArray,
  updateUploadedFiles,
} from "./images";

export class ServiceRequestDetail {
  constructor() {
    const api = new API();
    const url = new URL(document.location.href);
    const $loadingPlaceholder = new LoadingPlaceholder(
      "Loading service request details..."
    );
    const serviceRequestId = new URLSearchParams(url.search).get("id");
    const $sectionHeading = $(".components .section-heading");

    const {
      $uploadImagesInput,
      $uploadImagesClass,
      $uploadImagePreviewTemplate,
    } = createImageFormFields();

    let uploadedFiles = {};

    function handleInputFilesChanged() {
      updateUploadedFiles(
        this.files,
        uploadedFiles,
        $uploadImagePreviewTemplate,
        $uploadImagesClass
      );
    }
    $uploadImagesInput.change(handleInputFilesChanged);

    const $submitButton = $(".components .button.button--form-submit")
      .clone()
      .attr({
        value: "Upload Images",
        id: "submit-images",
      });

    $submitButton.hide();

    $submitButton.on("click", (event) => {
      event.preventDefault();
      if (Object.keys(uploadedFiles).length === 0) {
        alert("Please select one or more images to upload.");
        return;
      }

      api
        .submitServiceRequestFiles(
          serviceRequestId,
          getFormDataFromArray(uploadedFiles)
        )
        .then(() => {
          window.location.reload();
        })
        .fail((a, b) => {
          this.$element.empty().append(
            new StatusMessage({
              text: "Error while adding files to the service request.",
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
      const $serviceRequestImagesHeading = $sectionHeading.clone();

      $serviceRequestImagesHeading
        .find(".section-title")
        .text("Service request images");

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

      if (response.street_name || response.street_number || response.suburb) {
        this.$element.append(
          new BasicBlock({
            title: "Address",
            subtitle: `${response.street_name} ${response.street_number}, ${response.suburb}`,
          }).render()
        );
      }

      if (response.coordinates) {
        const staticMapEvent = new CustomEvent("add-static-map", {
          detail: response.coordinates,
        });
        this.$element.append(
          $("<div />", {
            id: "static-service-request-map",
            style: "height: 300px",
          })
        );
        document.dispatchEvent(staticMapEvent);
      }

      this.$element.append([
        $serviceDescriptionHeading,
        new BlockPreWrap(response.description).render(),
      ]);


      this.$element.append([
        $serviceRequestImagesHeading,
        $uploadImagesInput,
        $uploadImagesClass,
        $submitButton,
      ]);
    });

    function renderFileAlreadyUploaded(blob, fileId) {
      let url = URL.createObjectURL(blob);
      const $preview = $uploadImagePreviewTemplate
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
          renderFileAlreadyUploaded
        );
      }
    });
  }

  render() {
    return this.$element;
  }
}
