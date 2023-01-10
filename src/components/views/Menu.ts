import { MENU_SOUND_TITLE, MENU_THEME_TITLE } from '../../constants/string-constants';
import { HTMLTags } from '../../types/types';
import { createAudio, createElem } from '../../utils/utils';
import Header from './HeaderView';

export default class Menu {
    header: Header;
    menuContainer: HTMLDivElement;
    burgerIcon: HTMLDivElement;

    constructor(header: Header) {
        this.header = header;
        this.menuContainer = createElem(HTMLTags.DIV, 'menu') as HTMLDivElement;
        this.burgerIcon = createElem(HTMLTags.DIV, 'burger-menu') as HTMLDivElement;
    }

    public getBurgerIcon() {
        return this.burgerIcon;
    }

    private createTheme() {
        const themeContainer = createElem(HTMLTags.DIV, 'theme-container');
        const themeTitle = createElem(HTMLTags.P, 'theme-title', MENU_THEME_TITLE);
        const input = this.createInput('checkbox checkbox-theme', 'theme');
        const label = createElem(HTMLTags.LABEL);
        label.setAttribute('for', 'theme');
        themeContainer.append(themeTitle, input, label);
        return themeContainer;
    }

    private createSound() {
        const soundContainer = createElem(HTMLTags.DIV, 'sound-container');
        const soundTitle = createElem(HTMLTags.P, 'sound-title', MENU_SOUND_TITLE);
        const input = this.createInput('checkbox checkbox-sound', 'sound');
        const label = createElem(HTMLTags.LABEL);
        label.setAttribute('for', 'sound');
        const audio = createAudio();
        label.addEventListener('click', () => {
            this.handlePlayAudio(audio);
        });
        soundContainer.append(soundTitle, input, label, audio);
        return soundContainer;
    }

    private createInput(className: string, inputId: string) {
        const input = createElem(HTMLTags.INPUT, className);
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', inputId);
        return input;
    }

    public createMenu() {
        document.body.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        const logo = this.header.createLogo();
        const navigation = this.header.createNavigation();
        const theme = this.createTheme();
        const sound = this.createSound();
        this.menuContainer.append(logo, navigation, theme, sound);
        return this.menuContainer;
    }

    private handleClick(e: MouseEvent) {
        const target = e.target as Element;

        if (
            document.body.classList.contains('inactive') &&
            (target.classList.contains('logo-title') ||
                target.classList.contains('logo-title') ||
                target.classList.contains('text-title-second') ||
                target.classList.contains('text-title-first') ||
                target.classList.contains('inactive') ||
                target.classList.contains('nav-link'))
        ) {
            document.body.classList.toggle('inactive');
            this.burgerIcon.classList.toggle('burger-menu_open');
            this.menuContainer.classList.toggle('menu_open');
        } else if (target.classList.contains('burger-menu')) {
            this.burgerIcon.classList.toggle('burger-menu_open');
            this.menuContainer.classList.toggle('menu_open');
            document.body.classList.toggle('inactive');
        }
    }

    private handlePlayAudio(audio: HTMLAudioElement) {
        if (audio.classList.contains('play')) {
            audio.classList.remove('play');
            audio.pause();
        } else {
            audio.classList.add('play');
            audio.play();
        }
    }
}
