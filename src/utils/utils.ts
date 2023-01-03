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
    const lineWelcome = createElem(HTMLTags.SPAN, 'line-welcome', LINE_WELCOME);
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
