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

  const body = document.querySelector('body');
  const menuButton = document.querySelector('.menu-btn');
  const navigation = document.querySelector('.links-nav');
  menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('opened');
    navigation.classList.toggle('open');
    body.classList.toggle('stop-scroll');
  });
}

// create a template element to render the header and footer
async function loadTemplate(path) {
  const html = await fetch(path).then(convertToText);
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

// render some list elements
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function addToLocalStorage(key, data) {
  let elements = getLocalStorage(key) || [];
  let newElement = data;
  let existingElement = elements.find(
    (element) => element.id === newElement.id,
  );
  if (existingElement) {
    elements = [...elements];
  } else {
    elements = [...elements, newElement];
  }
  setLocalStorage(key, elements);
}

export function deleteFromLocalStorage(key, data) {
  let elements = getLocalStorage(key) || [];
  let newElement = data;
  let existingElement = elements.find(
    (element) => element.id === newElement.id,
  );
  elements = elements.filter((element) => element !== existingElement);
  setLocalStorage(key, elements);
}

export function addMyFavorite(key, data, heartElement, msgElement) {
  heartElement.addEventListener('click', () => {
    if (heartElement.classList.contains('heart-filled')) {
      heartElement.classList.add('heart-unfilled');
      heartElement.classList.remove('heart-filled');
      msgElement.textContent = 'Follow';
      deleteFromLocalStorage(key, data);
    } else {
      heartElement.classList.add('heart-filled');
      heartElement.classList.remove('heart-unfilled');
      msgElement.textContent = 'Unfollow';
      addToLocalStorage(key, data);
    }
  });
}

export function checkExistingItem(key, data, heartElement, msgElement) {
  let elements = getLocalStorage(key) || [];
  let newElement = data;
  let existingElement = elements.find(
    (element) => element.id === newElement.id,
  );
  if (existingElement) {
    heartElement.classList.add('heart-filled');
    msgElement.textContent = 'Unfollow';
  }
}
