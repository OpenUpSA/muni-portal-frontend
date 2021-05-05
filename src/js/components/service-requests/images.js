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
    accept: "image/*", // Beware that the user can override this in a dropdown
    multiple: true,
    style: "display: none", // We're using our own element
  });
  const $uploadImagesClass = $(".upload-images");
  const $uploadImagePreviewTemplate = $(".image-preview");
  const $uploadImageAdd = $(".button.button--add-image");

  // Reroute the click event from the Add element to the hidden input element
  $uploadImageAdd.click(function () {
    $uploadImagesInput.click();
  });

  return {
    $uploadImagesInput,
    $uploadImagesLabel,
    $uploadImagesClass,
    $uploadImagePreviewTemplate,
  };
}

export function toggleSubmitImagesButton($btn, uploadedFiles) {
  Object.keys(uploadedFiles).length ? $btn.show() : $btn.hide();
}

export function updateUploadedFiles(
  inputFiles,
  uploadedFiles,
  $uploadImagePreviewTemplate,
  $uploadImagesClass
) {
  for (let i = 0; i < inputFiles.length; i++) {
    const newFile = inputFiles[i];
    if (!fileIsImageType(newFile)) continue; // Do not upload a non-image file
    let uuid = uuidv4();
    const $preview = clonePreview(uuid, $uploadImagePreviewTemplate);
    addRemoveImageEventHandler($preview, uploadedFiles, uuid);
    renderImageSelectedForUpload($preview, newFile);
    appendNewFile($uploadImagesClass, $preview, uploadedFiles, uuid, newFile);
  }
}

function clonePreview(uuid, $uploadImagePreviewTemplate) {
  // Create a preview to show the image
  return $uploadImagePreviewTemplate
    .clone()
    .attr({
      id: "upload-image-preview-" + uuid,
    })
    .removeClass("hidden");
}

function renderImageSelectedForUpload($preview, newFile) {
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
  reader.readAsDataURL(newFile);
}

function addRemoveImageEventHandler($preview, uploadedFiles, uuid) {
  // If the cross is clicked we want the image to go away and the file to be
  // removed from our custom file mapping
  const $previewRemove = $preview.find(".image-preview__remove");
  $previewRemove.click(function () {
    delete uploadedFiles[uuid];
    $("#upload-image-preview-" + uuid).remove();
    toggleSubmitImagesButton($("#submit-images"), uploadedFiles);
  });
}

function appendNewFile(
  $uploadImagesClass,
  $preview,
  uploadedFiles,
  uuid,
  newFile
) {
  // Add the new image to our custom mapping and render it
  uploadedFiles[uuid] = newFile;
  $uploadImagesClass.append($preview);
  // This only applies to the Service Request Detail view.
  toggleSubmitImagesButton($("#submit-images"), uploadedFiles);
}

function fileIsImageType(newFile) {
  const valid_image_type_regex = /^image\/\w*$/;
  if (!newFile.type.match(valid_image_type_regex)) {
    alert(
      "Your file selection contained files that are not images and have not been included for uploading."
    );
    return false;
  }
  return true;
}

export function getFormDataFromArray(uploadedFiles) {
  let formData = new FormData();
  for (const uuid in uploadedFiles) {
    formData.append("files", uploadedFiles[uuid]);
  }
  return formData;
}
