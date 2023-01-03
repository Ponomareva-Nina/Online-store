import { createElem, createWelcomeLine } from '../../utils/utils';
import AppController from '../app/app';
import { LINKS } from '../../types/constans';
import { HTMLElements, NullableElement } from '../../types/types';

export default class Header {
    container: HTMLElement;
    appController: AppController;
    wrapper: HTMLElement;
    currentActiveLink: NullableElement<HTMLElement>;

    constructor(controller: AppController) {
        this.appController = controller;
        this.wrapper = createElem(HTMLElements.TAG_DIV, 'wrapper');
        this.container = createElem('header', 'header');
        this.currentActiveLink = null;
    }

    public createLogo() {
        const logoContainer = createElem(HTMLElements.TAG_DIV, 'logo-container');
        const title = createElem(HTMLElements.PAGE_HEADER, 'logo-title');
        const a = createElem(HTMLElements.TAG_LINK, 'logo-link');
        a.setAttribute('href', LINKS.About);
        a.append(title);
        title.innerHTML = `hogwarts <span class="logo-lightning"></span> store`;
        logoContainer.append(a);
        return logoContainer;
    }

    public createNavigation() {
        const navigation = createElem(HTMLElements.TAG_NAV, 'main-nav');
        const navList = createElem(HTMLElements.TAG_UL, 'main-nav__list');

        for (const link in LINKS) {
            const li = createElem(HTMLElements.TAG_LIST, 'main-nav__list_item');
            const a = createElem(HTMLElements.TAG_LINK, 'nav-link', link);
            a.setAttribute('href', LINKS[link as keyof typeof LINKS]);
            const initialLink = a.getAttribute('href');
            if (initialLink === LINKS.About) {
                this.currentActiveLink = a;
                a.classList.add('nav-link_active');
            }
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(e, this.currentActiveLink as HTMLElement);
            });
            li.append(a);
            navList.append(li);
        }

        navigation.append(navList);
        return navigation;
    }

    public handleNavigationClick(event: MouseEvent, element: HTMLElement) {
        console.log(element);
        element.classList.remove('nav-link_active');
        this.currentActiveLink = event.target as HTMLElement;
        this.currentActiveLink.classList.add('nav-link_active');
        const href = this.currentActiveLink.getAttribute('href') || '';
        this.appController.router.changeCurrentPage(href);
    }

    private createHeaderCentralContainer() {
        const centralContainer = createElem(HTMLElements.TAG_DIV, 'central-container');
        const logo = this.createLogo();
        const navigation = this.createNavigation();
        centralContainer.append(logo, navigation);
        return centralContainer;
    }

    private createContentHeader() {
        const container = createElem(HTMLElements.TAG_DIV, 'header-content');
        const burger = this.appController.menu.getBurgerIcon();
        const centralContaier = this.createHeaderCentralContainer();
        const cart = this.appController.cartView.createCartIcon();
        container.append(burger, centralContaier, cart);
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
