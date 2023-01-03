import { MENU_SOUND_TITLE, MENU_THEME_TITLE } from '../../constants/string-constants';
import { HTMLTags } from '../../types/types';
import { createAudio, createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class Menu {
    appController: AppController;
    menuContainer: HTMLElement;
    burgerIcon: HTMLElement;

    constructor(controller: AppController) {
        this.appController = controller;
        this.menuContainer = createElem(HTMLTags.DIV, 'menu');
        this.burgerIcon = this.createBurgerIcon();
    }

    public createBurgerIcon() {
        const burgerMenu = createElem(HTMLTags.DIV, 'burger-menu');
        burgerMenu.addEventListener('click', (e) => {
            burgerMenu.classList.toggle('burger-menu_open');
            this.menuContainer.classList.toggle('menu_open');
            document.body.classList.toggle('inactive');
            this.handleClick(e, burgerMenu, this.menuContainer);
            if (this.menuContainer.classList.contains('menu_open')) {
                this.appController.header.wrapper.append(this.createMenu(this.menuContainer, burgerMenu));
            }
        });
        return burgerMenu;
    }

    getBurgerIcon() {
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

    public createMenu(menu: HTMLElement, burgerMenu: HTMLElement) {
        document.body.addEventListener('click', (e) => {
            this.handleClick(e, burgerMenu, menu);
        });
        if (!this.menuContainer.innerHTML) {
            const logo = this.appController.header.createLogo();
            logo.addEventListener('click', (e) => {
                this.handleClick(e, burgerMenu, menu);
            });
            const navigation = this.appController.header.createNavigation();
            navigation.addEventListener('click', (e) => {
                this.handleClick(e, burgerMenu, menu);
            });
            //const theme = this.createTheme();
            const sound = this.createSound();
            this.menuContainer.append(logo, navigation, sound);
            return this.menuContainer;
        } else {
            return this.menuContainer;
        }
    }

    public handleClick(e: MouseEvent, burgerMenu: HTMLElement, menu: HTMLElement) {
        const target = e.target as Element;
        if (
            document.body.classList.contains('inactive') &&
            (target.classList.contains('logo-title') ||
                target.classList.contains('inactive') ||
                target.classList.contains('nav-link'))
        ) {
            document.body.classList.toggle('inactive');
            burgerMenu.classList.toggle('burger-menu_open');
            menu.classList.toggle('menu_open');
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
