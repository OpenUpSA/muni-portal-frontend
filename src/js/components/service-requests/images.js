import { v4 as uuidv4 } from "uuid";
import { getLabel } from "../../utils/element-factory";

/*
  We keep a mapping of uploaded images separate from the FileList stored on
  the input object because we want previously selected images to persist after
  the user clicks the plus action a second time to upload more images and we want
  the user to be able to remove images by clicking the cross on a preview.

  Each time the user selects more files to upload, we append these individual
  File objects to our own uploadedFiles object.

  We later transform this uploadedFiles object into a FormData object
  instead of submitting the data from the form containing the file input.

  More reading: https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
*/

export function createImageFormFields() {
  const $uploadImagesLabel = getLabel("Images of your issue");
  const $formInputTmpl = $(".components .form__input-field:eq(0)");
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

  // Reroute the click event from the Add element to the hidden input element
  $uploadImageAdd.click(function () {
    $uploadImagesInput.click();
  });

  return {
    $uploadImagesInput,
    $uploadImagesLabel,
    $uploadImagesClass,
    $uploadImagePreview,
  };
}

export function toggleSubmitImagesButton($btn, uploadedFiles) {
  if (Object.keys(uploadedFiles).length > 0) {
    $btn.show();
  } else {
    $btn.hide();
  }
}

export function updateUploadedFiles(
  inputFiles,
  uploadedFiles,
  $previewTemplate,
  $uploadImagesClass
) {
  for (let i = 0; i < inputFiles.length; i++) {
    let uuid = uuidv4();

    // Create a preview to show the image
    const $preview = $previewTemplate
      .clone()
      .attr({
        id: "upload-image-preview-" + uuid,
      })
      .removeClass("hidden");

    // If the cross is clicked we want the image to go away and the file to be
    // removed from our custom file mapping
    const $previewRemove = $preview.find(".image-preview__remove");
    $previewRemove.click(function () {
      delete uploadedFiles[uuid];
      $("#upload-image-preview-" + uuid).remove();
      toggleSubmitImagesButton($("#submit-images"), uploadedFiles);
    });

    // Read the file contents and render it as the background image
    // of the preview element
    let reader = new FileReader();
    reader.onload = function (e) {
      // Replace newlines in base64 encoding so it doesn't break CSS
      $preview.css(
        "background-image",
        "url('" + e.target.result.replace(/(\r\n|\n|\r)/gm, "") + "')"
      );
    };
    reader.readAsDataURL(inputFiles[i]);

    // Add the new image to our custom mapping and render it
    uploadedFiles[uuid] = inputFiles[i];
    $uploadImagesClass.append($preview);

    // This only applies to the Service Request Detail view.
    toggleSubmitImagesButton($("#submit-images"), uploadedFiles);
  }
}
