import { getBaseApiUrl } from "../api";
/*
  Takes an HTML string and replaces each 'src' attribute in each 'img' tag with
  the API url prepended.

  E.g. /path/to/img.jpg -> http://api.com/path/to/img.jpg
 */
export function parseImgTags(html) {
  let parsedHTML = document.createElement("div");
  parsedHTML.innerHTML = html;
  let imgTags = parsedHTML.querySelectorAll("img");

  imgTags.forEach(function (img) {
    let src = img.getAttribute("src");
    img.setAttribute("src", getBaseApiUrl() + src);
  });

  return parsedHTML;
}
