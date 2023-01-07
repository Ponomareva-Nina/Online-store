import { AUDIO_OST } from '../constants/source-constants';
import { LINE_DESCRIPTION, LINE_WELCOME } from '../constants/string-constants';
import { HTMLTags } from '../types/types';

export function createElem(tag = 'div', className = '', text = '') {
    const elem = document.createElement(tag);
    elem.className = className;
    elem.textContent = text;
    return elem;
}

export function createWelcomeLine() {
    const line = createElem(HTMLTags.DIV, 'line');
    const lineWelcome = createElem(HTMLTags.SPAN, 'line-welcome');
    const logo = createElem(HTMLTags.SPAN, 'line-logo');
    const welcomeText = createElem(HTMLTags.SPAN, 'welcome-text', LINE_WELCOME);
    lineWelcome.append(logo, welcomeText);
    const lineDescription = createElem(HTMLTags.SPAN, 'line-description', LINE_DESCRIPTION);
    const wrapper = createElem(HTMLTags.DIV, 'wrapper line-wrapper');
    wrapper.append(lineWelcome, lineDescription);
    line.append(wrapper);
    return line;
}

export function createAudio() {
    const audio = new Audio();
    audio.src = AUDIO_OST;
    audio.loop = true;
    audio.volume = 0.2;
    return audio;
}

export function createImage(className = '', src = '') {
    const img = document.createElement('img');
    img.className = className;
    img.setAttribute('src', src);
    return img;
}

export function createRadioButton(name = '', className = '', value = '') {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    input.className = className;
    return input;
}
