export function createElem(tag = 'div', className = '', text = '') {
    const elem = document.createElement(tag);
    elem.className = className;
    elem.textContent = text;
    return elem;
}

export function createImage(className = '', src = '') {
    const img = document.createElement('img');
    img.className = className;
    img.setAttribute('src', src);
    return img;
}
