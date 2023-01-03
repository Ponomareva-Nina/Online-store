import { createElem, createWelcomeLine } from '../../utils/utils';
import AppController from '../app/app';
import { LINKS } from '../../constants/route-constants';
import { HTMLTags, NullableElement } from '../../types/types';

export default class Header {
    container: HTMLElement;
    appController: AppController;
    wrapper: HTMLElement;
    currentActiveLink: NullableElement<HTMLElement>;

    constructor(controller: AppController) {
        this.appController = controller;
        this.wrapper = createElem(HTMLTags.DIV, 'wrapper');
        this.container = createElem('header', 'header');
        this.currentActiveLink = null;
    }

    public createLogo() {
        const logoContainer = createElem(HTMLTags.DIV, 'logo-container');
        const title = createElem(HTMLTags.PAGE_HEADER, 'logo-title');
        const a = createElem(HTMLTags.LINK, 'logo-link');
        a.setAttribute('href', LINKS.About);
        a.append(title);
        title.innerHTML = `hogwarts <span class="logo-lightning"></span> store`;
        logoContainer.append(a);
        return logoContainer;
    }

    public createNavigation() {
        const navigation = createElem(HTMLTags.NAV, 'main-nav');
        const navList = createElem(HTMLTags.UL, 'main-nav__list');

        for (const link in LINKS) {
            const li = createElem(HTMLTags.LIST, 'main-nav__list_item');
            const a = createElem(HTMLTags.LINK, 'nav-link', link);
            a.setAttribute('href', LINKS[link as keyof typeof LINKS]);
            const initialLink = a.getAttribute('href');
            if (initialLink === LINKS.About) {
                this.currentActiveLink = a;
                a.classList.add('nav-link_active');
            }
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(e);
            });
            li.append(a);
            navList.append(li);
        }

        navigation.append(navList);
        return navigation;
    }

    public handleNavigationClick(event: MouseEvent) {
        // if (this.currentActiveLink) {
        // this.currentActiveLink.classList.remove('nav-link_active');
        const target = event.target as HTMLElement;
        const href = target.getAttribute('href') || '';
        this.appController.router.changeCurrentPage(href);

        const newActiveLink = document.querySelectorAll('.nav-link');
        newActiveLink.forEach((link) => {
            if (link.getAttribute('href') === `#${this.appController.router.currentPath}`) {
                link.classList.add('nav-link_active');
            } else {
                link.classList.remove('nav-link_active');
            }
        });
        // this.currentActiveLink = event.target as HTMLElement;
        // this.currentActiveLink.classList.add('nav-link_active');
        // }
    }

    private createContentHeader() {
        const centralContainer = createElem(HTMLTags.DIV, 'central-container');
        const logo = this.createLogo();
        const navigation = this.createNavigation();
        centralContainer.append(logo, navigation);

        const container = createElem(HTMLTags.DIV, 'header-content');
        const burger = this.appController.menu.getBurgerIcon();
        const menu = this.appController.menu.createMenu();
        this.wrapper.append(menu);
        const cart = this.appController.cartView.createCartIcon();
        container.append(burger, centralContainer, cart);
        return container;
    }

    public createHeader() {
        const line = createWelcomeLine();
        const headerContent = this.createContentHeader();
        this.wrapper.append(headerContent);
        this.container.append(line, this.wrapper);
        return this.container;
    }
}
