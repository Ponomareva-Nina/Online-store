import { createElem, createWelcomeLine } from '../../utils/utils';
import AppController from '../app/app';
import { LINKS } from '../../constants/route-constants';
import { HTMLTags } from '../../types/types';
import { MAIN_LOGO_PART1, MAIN_LOGO_PART2 } from '../../constants/string-constants';
import { ViewComponent } from '../../types/interfaces';

export default class Header implements ViewComponent {
    public container: DocumentFragment;
    public appController: AppController;
    private wrapper: HTMLDivElement;
    private headerContainer: HTMLDivElement;
    private links: Array<HTMLElement>;

    constructor(controller: AppController) {
        this.appController = controller;
        this.wrapper = createElem(HTMLTags.DIV, 'wrapper') as HTMLDivElement;
        this.headerContainer = createElem('header', 'header') as HTMLDivElement;
        this.container = document.createDocumentFragment();
        this.links = [];
    }

    public createLogo(): HTMLDivElement {
        const logoContainer = createElem(HTMLTags.DIV, 'logo-container') as HTMLDivElement;
        const title = createElem(HTMLTags.PAGE_HEADER, 'logo-title');
        const textTitle1 = createElem(HTMLTags.SPAN, 'text-title-first', MAIN_LOGO_PART1);
        const textTitle2 = createElem(HTMLTags.SPAN, 'text-title-second', MAIN_LOGO_PART2);
        title.append(textTitle1, textTitle2);
        const link = createElem(HTMLTags.LINK, 'logo-link');
        link.setAttribute('href', LINKS.About);
        link.append(title);
        logoContainer.addEventListener('click', () => {
            this.appController.router.changeCurrentPage(LINKS.About);
        });
        logoContainer.append(link);
        return logoContainer;
    }

    public createNavigation(): HTMLDivElement {
        const navigation = createElem(HTMLTags.NAV, 'main-nav') as HTMLDivElement;
        const navList = createElem(HTMLTags.UL, 'main-nav__list');

        for (const link in LINKS) {
            const li = createElem(HTMLTags.LIST, 'main-nav__list_item');
            const navLink = createElem(HTMLTags.LINK, 'nav-link', link) as HTMLLinkElement;
            navLink.setAttribute('href', LINKS[link as keyof typeof LINKS]);

            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.appController.router.changeCurrentPage(navLink.href);
            });
            this.links.push(navLink);
            li.append(navLink);
            navList.append(li);
        }

        navigation.append(navList);
        return navigation;
    }

    public setActiveLink(): void {
        const activeRoute = this.appController.router.currentRoute?.path;
        this.links.forEach((link) => {
            if (link.getAttribute('href') === activeRoute) {
                link.classList.add('nav-link_active');
            } else {
                link.classList.remove('nav-link_active');
            }
        });
    }

    private createContentHeader(): HTMLDivElement {
        this.appController.destroyAllChildNodes(this.wrapper);
        const centralContainer = createElem(HTMLTags.DIV, 'central-container');
        const logo = this.createLogo();
        const navigation = this.createNavigation();
        centralContainer.append(logo, navigation);
        const container = createElem(HTMLTags.DIV, 'header-content') as HTMLDivElement;
        const burger = this.appController.menu.getBurgerIcon();
        const menu = this.appController.menu.createMenu();
        this.wrapper.append(menu);
        const cart = this.appController.cartView.createCartIcon();
        container.append(burger, centralContainer, cart);
        return container;
    }

    public createHeader(): HTMLDivElement {
        this.appController.destroyAllChildNodes(this.headerContainer);
        const line = createWelcomeLine();
        const headerContent = this.createContentHeader();
        this.wrapper.append(headerContent);
        this.headerContainer.append(line, this.wrapper);
        return this.headerContainer;
    }

    public render(): DocumentFragment {
        this.createHeader();
        return this.container;
    }
}
