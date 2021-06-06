export const loadScript = ({ id, onLoad, src }) => {
  var script = document.createElement('script');
  script.onload = onLoad;
  script.id = id;
  script.setAttribute('src', src);
  document.head.appendChild(script);
  // TODO: add error handling
}