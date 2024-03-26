// convert to text
function convertToText(res) {
  if (res.ok) {
    return res.text();
  } else {
    throw new Error('Bad Response');
  }
}

// render the content
export function renderWithTemplate(template, parent, data, callback) {
  const content = template.content.cloneNode(true);
  parent.appendChild(content);
  if (callback) {
    callback(data);
  }
}

// render the header and footer
export async function loadHeaderFooter() {
  const header = await loadTemplate('../partials/header.html');
  const footer = await loadTemplate('../partials/footer.html');
  const headerElement = document.querySelector('#header');
  const footerElement = document.querySelector('#footer');

  renderWithTemplate(header, headerElement);
  renderWithTemplate(footer, footerElement);
}

// create a template element to render the header and footer
async function loadTemplate(path) {
  const html = await fetch(path).then(convertToText);
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}
