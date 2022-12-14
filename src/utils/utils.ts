export default function createElem(tag = 'div', className = '', text = '') {
    const elem = document.createElement(tag);
    elem.className = className;
    elem.innerHTML = text;
    return elem;
}
