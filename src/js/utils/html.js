import { getBaseApiUrl } from "../api";
/*
  Takes an HTML string and replaces each 'src' attribute in each 'img' tag with
  the API url prepended, if it does not already have 'http' or 'https' prepended

  This is not necessary for URLs hosted on S3 but it is for django's local
  filesystem storage.

  E.g. /path/to/img.jpg -> http://api.com/path/to/img.jpg
 */
export function parseImgTags(html) {
  const parsedHTML = document.createElement("div");
  parsedHTML.innerHTML = html;
  const imgTags = parsedHTML.querySelectorAll("img");

  imgTags.forEach(function (img) {
    const src = img.getAttribute("src");
    if (!src.includes("http://") || !src.includes("https://")) {
      img.setAttribute("src", getBaseApiUrl() + src);
    }
  });

  return parsedHTML;
}
