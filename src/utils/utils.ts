import { HTMLElements } from '../types/types';

export function createElem(tag = 'div', className = '', text = '') {
    const elem = document.createElement(tag);
    elem.className = className;
    elem.textContent = text;
    return elem;
}

export function createWelcomeLine() {
    const line = createElem(HTMLElements.TAG_DIV, 'line');
    const textWelcome = 'Welcome to Harry Potter fun shop';
    const lineWelcome = createElem(HTMLElements.TAG_SPAN, 'line-welcome', textWelcome);
    const textDescription = 'I solemnly swear that I’m up to no good...';
    const lineDescription = createElem(HTMLElements.TAG_SPAN, 'line-description', textDescription);
    const wrapper = createElem(HTMLElements.TAG_DIV, 'wrapper line-wrapper');
    wrapper.append(lineWelcome, lineDescription);
    line.append(wrapper);
    return line;
}
// export function createWrapper() {
//     const wrapper = createElem('div', 'wrapper');
//     return wrapper;
// }
