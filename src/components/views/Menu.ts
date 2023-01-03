import { HTMLElements } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class Menu {
    appController: AppController;
    menuContainer: HTMLElement;
    burgerIcon: HTMLElement;

    constructor(controller: AppController) {
        this.appController = controller;
        this.menuContainer = createElem(HTMLElements.TAG_DIV, 'menu');
        this.burgerIcon = this.createBurgerIcon();
    }

    public createBurgerIcon() {
        const burgerMenu = createElem(HTMLElements.TAG_DIV, 'burger-menu');
        burgerMenu.addEventListener('click', () => {
            this.handleClickBody(burgerMenu, this.menuContainer);
            burgerMenu.classList.toggle('burger-menu_open');
            this.menuContainer.classList.toggle('menu_open');
            document.body.classList.toggle('inactive');
            if (this.menuContainer.classList.contains('menu_open')) {
                this.appController.header.wrapper.append(this.createMenu());
            }
        });
        return burgerMenu;
    }

    getBurgerIcon() {
        return this.burgerIcon;
    }

    private createTheme() {
        const themeContainer = createElem(HTMLElements.TAG_DIV, 'theme-container');
        const textTitle = 'Choose your theme';
        const themeTitle = createElem('p', 'theme-title', textTitle);
        const input = this.createInput('checkbox checkbox-theme', 'theme');
        const label = createElem('label');
        label.setAttribute('for', 'theme');
        themeContainer.append(themeTitle, input, label);
        return themeContainer;
    }

    private createSound() {
        const soundContainer = createElem(HTMLElements.TAG_DIV, 'sound-container');
        const textTitle = 'Turn on/off sound:';
        const soundTitle = createElem('p', 'sound-title', textTitle);
        const input = this.createInput('checkbox checkbox-sound', 'sound');
        const label = createElem('label');
        label.setAttribute('for', 'sound');
        soundContainer.append(soundTitle, input, label);
        return soundContainer;
    }

    private createInput(className: string, inputId: string) {
        const input = createElem('input', className);
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', inputId);
        return input;
    }

    public createMenu() {
        if (!this.menuContainer.innerHTML) {
            const logo = this.appController.header.createLogo();
            const navigation = this.appController.header.createNavigation();
            const theme = this.createTheme();
            const sound = this.createSound();
            this.menuContainer.append(logo, navigation, theme, sound);
            return this.menuContainer;
        } else {
            return this.menuContainer;
        }
    }

    private handleClickBody(burgerMenu: HTMLElement, menu: HTMLElement) {
        document.body.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.classList.contains('inactive')) {
                document.body.classList.toggle('inactive');
                burgerMenu.classList.toggle('burger-menu_open');
                menu.classList.toggle('menu_open');
            }
        });
    }
}
