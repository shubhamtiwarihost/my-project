/**
 * Distance from the top of the document to an element's layout box.
 * Unlike getBoundingClientRect this ignores CSS transforms, so sections tilted
 * into 3D by useDepthScroll still report where they really sit on the page.
 */
export function pageTop(el) {
  let top = 0
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop
  return top
}
