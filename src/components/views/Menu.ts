import { HTMLElements } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';
//import HeaderView from './HeaderView';

export default class Menu {
    appController: AppController;
    menuContainer: HTMLElement;
    burgerIcon: HTMLElement;
    //headerView!: HeaderView;

    constructor(controller: AppController) {
        this.appController = controller;
        this.menuContainer = createElem(HTMLElements.TAG_DIV, 'menu');
        this.burgerIcon = this.createBurgerIcon();
    }

    private createMenu() {
        if (!this.menuContainer.innerHTML) {
            const logo = this.appController.header.createLogo();
            const navigation = this.appController.header.createNavigation();
            this.menuContainer.append(logo, navigation);
            console.log(this.menuContainer);
            return this.menuContainer;
        } else {
            return this.menuContainer;
        }
    }

    public createBurgerIcon() {
        const burgerMenu = createElem(HTMLElements.TAG_DIV, 'burger-menu');
        const burgerLine = createElem(HTMLElements.TAG_SPAN, 'burger-line');
        burgerMenu.append(burgerLine);
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('burger-menu_open');
            if (burgerMenu.classList.contains('burger-menu_open')) {
                document.body.append(this.createMenu());
            }
        });
        //повесить клик на меню, по которому добавлять и удалять класс и
        //вызывть отрисовку вида меню настроек
        //
        return burgerMenu;
    }

    getBurgerIcon() {
        return this.burgerIcon;
    }

    private createTheme() {
        //создает вид меню перекючения темы
    }

    private createSound() {
        //создает вид меню вкл/выкл звука
    }
}
