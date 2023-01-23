import { AUDIO_OST } from '../constants/source-constants';
import { LINE_DESCRIPTION, LINE_WELCOME } from '../constants/string-constants';
import { HTMLTags } from '../types/types';

export function createElem<T>(tag = 'div', className = '', text = '') {
    const elem = document.createElement(tag);
    elem.className = className;
    elem.textContent = text;
    return elem as T;
}

export function createWelcomeLine(): HTMLDivElement {
    const line = createElem(HTMLTags.DIV, 'line') as HTMLDivElement;
    const lineWelcome = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'line-welcome');
    const logo = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'line-logo');
    const welcomeText = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'welcome-text', LINE_WELCOME);
    lineWelcome.append(logo, welcomeText);
    const lineDescription = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'line-description', LINE_DESCRIPTION);
    const wrapper = createElem<HTMLDivElement>(HTMLTags.DIV, 'wrapper line-wrapper');
    wrapper.append(lineWelcome, lineDescription);
    line.append(wrapper);
    return line;
}

export function createAudio(): HTMLAudioElement {
    const audio = new Audio();
    audio.src = AUDIO_OST;
    audio.loop = true;
    audio.volume = 0.2;
    return audio;
}

export function createImage(className = '', src = ''): HTMLImageElement {
    const img = document.createElement('img');
    img.className = className;
    img.setAttribute('src', src);
    return img;
}

export function createRadioButton(name = '', className = '', value = '', id = ''): HTMLInputElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    input.setAttribute('id', id);
    input.className = className;
    return input;
}

export function createCheckbox(name = '', className = '', value = '', id = ''): HTMLInputElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', name);
    input.setAttribute('value', value);
    input.setAttribute('id', id);
    input.className = className;
    return input;
}

export function createLabel(relevantInputId = '', className = '', text = ''): HTMLLabelElement {
    const label = document.createElement('label');
    label.setAttribute('for', relevantInputId);
    label.className = className;
    label.innerText = text;
    return label;
}

export function createRange(min = '0', max = '200', value = '', className = ''): HTMLInputElement {
    const range = document.createElement('input');
    range.setAttribute('type', 'range');
    range.setAttribute('min', min);
    range.setAttribute('max', max);
    range.setAttribute('value', value);
    range.className = className;
    return range;
}
