import { MENU_SOUND_TITLE, MENU_THEME_TITLE } from '../../constants/string-constants';
import { IMenu } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createAudio, createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class Menu implements IMenu {
    public appController: AppController;
    public menuContainer: HTMLDivElement;
    public burgerIcon: HTMLDivElement;

    constructor(controller: AppController) {
        this.appController = controller;
        this.menuContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'menu') as HTMLDivElement;
        this.burgerIcon = createElem<HTMLDivElement>(HTMLTags.DIV, 'burger-menu') as HTMLDivElement;
    }

    public getBurgerIcon(): HTMLDivElement {
        return this.burgerIcon;
    }

    private createTheme(): HTMLDivElement {
        const themeContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'theme-container') as HTMLDivElement;
        const themeTitle = createElem<HTMLElement>(HTMLTags.P, 'theme-title', MENU_THEME_TITLE);
        const input = this.createInput('checkbox checkbox-theme', 'theme');
        const label = createElem<HTMLLabelElement>(HTMLTags.LABEL);
        label.setAttribute('for', 'theme');
        themeContainer.append(themeTitle, input, label);
        return themeContainer;
    }

    private createSound(): HTMLDivElement {
        const soundContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'sound-container') as HTMLDivElement;
        const soundTitle = createElem<HTMLElement>(HTMLTags.P, 'sound-title', MENU_SOUND_TITLE);
        const input = this.createInput('checkbox checkbox-sound', 'sound');
        const label = createElem<HTMLLabelElement>(HTMLTags.LABEL);
        label.setAttribute('for', 'sound');
        const audio = createAudio();
        label.addEventListener('click', () => {
            this.handlePlayAudio(audio);
        });
        soundContainer.append(soundTitle, input, label, audio);
        return soundContainer;
    }

    private createInput(className: string, inputId: string): HTMLInputElement {
        const input = createElem<HTMLInputElement>(HTMLTags.INPUT, className) as HTMLInputElement;
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', inputId);
        return input;
    }

    public createMenu(): HTMLDivElement {
        document.body.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        const logo = this.appController.header.createLogo();
        const navigation = this.appController.header.createNavigation();
        const theme = this.createTheme();
        const sound = this.createSound();
        this.menuContainer.append(logo, navigation, theme, sound);
        return this.menuContainer;
    }

    private handleClick(e: MouseEvent): void {
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

    private handlePlayAudio(audio: HTMLAudioElement): void {
        if (audio.classList.contains('play')) {
            audio.classList.remove('play');
            audio.pause();
        } else {
            audio.classList.add('play');
            audio.play();
        }
    }
}
