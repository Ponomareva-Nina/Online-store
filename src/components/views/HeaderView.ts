import { createElem, createWelcomeLine } from '../../utils/utils';
import AppController from '../app/app';
import { LINKS } from '../../constants/route-constants';
import { HTMLTags, NullableElement } from '../../types/types';
import { HASHTAG, MAIN_LOGO_PART1, MAIN_LOGO_PART2 } from '../../constants/string-constants';
import { ViewComponent } from '../../types/interfaces';
import Menu from '../views/Menu';

export default class Header implements ViewComponent {
    container: DocumentFragment;
    appController: AppController;
    wrapper: HTMLDivElement;
    currentActiveLink: NullableElement<HTMLElement>;
    headerContainer: HTMLDivElement;
    public menu: Menu;

    constructor(controller: AppController) {
        this.appController = controller;
        this.wrapper = createElem(HTMLTags.DIV, 'wrapper') as HTMLDivElement;
        this.headerContainer = createElem('header', 'header') as HTMLDivElement;
        this.container = document.createDocumentFragment();
        this.currentActiveLink = null;
        this.menu = new Menu(this);
    }

    public createLogo() {
        const logoContainer = createElem(HTMLTags.DIV, 'logo-container');
        const title = createElem(HTMLTags.PAGE_HEADER, 'logo-title');
        const textTitle1 = createElem(HTMLTags.SPAN, 'text-title-first', MAIN_LOGO_PART1);
        const textTitle2 = createElem(HTMLTags.SPAN, 'text-title-second', MAIN_LOGO_PART2);
        title.append(textTitle1, textTitle2);
        const link = createElem(HTMLTags.LINK, 'logo-link');
        link.setAttribute('href', LINKS.About);
        link.append(title);
        logoContainer.addEventListener('click', (e) => {
            this.appController.router.changeCurrentPage(LINKS.About);
            this.appController.header.handleNavigationClick(e);
        });
        logoContainer.append(link);
        return logoContainer;
    }

    public createNavigation() {
        const navigation = createElem(HTMLTags.NAV, 'main-nav');
        const navList = createElem(HTMLTags.UL, 'main-nav__list');

        for (const link in LINKS) {
            const li = createElem(HTMLTags.LIST, 'main-nav__list_item');
            const navLink = createElem(HTMLTags.LINK, 'nav-link', link);
            navLink.setAttribute('href', LINKS[link as keyof typeof LINKS]);
            const initialRoute = this.getLinkRouteFromURL();
            if (navLink.getAttribute('href') === initialRoute) {
                this.currentActiveLink = navLink;
                this.currentActiveLink.classList.add('nav-link_active');
            }
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(e);
            });
            li.append(navLink);
            navList.append(li);
        }

        navigation.append(navList);
        return navigation;
    }

    public handleNavigationClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const href = target.getAttribute('href') || '';
        this.appController.router.changeCurrentPage(href);
        const newActiveLink = document.querySelectorAll('.nav-link');
        newActiveLink.forEach((link) => {
            const route = this.getLinkRouteFromURL();
            if (link.getAttribute('href') === route) {
                link.classList.add('nav-link_active');
            } else {
                link.classList.remove('nav-link_active');
            }
        });
    }

    private getLinkRouteFromURL() {
        const route = window.location.href.split(HASHTAG);
        const [, params] = route;
        if (params) {
            const [initialRoute] = params.split(/\?|&|\//);
            return `${HASHTAG}${initialRoute}`;
        }
        return '#';
    }

    public createContentHeader() {
        this.destroyAllChildNodes(this.wrapper);
        const centralContainer = createElem(HTMLTags.DIV, 'central-container');
        const logo = this.createLogo();
        const navigation = this.createNavigation();
        centralContainer.append(logo, navigation);
        const container = createElem(HTMLTags.DIV, 'header-content');
        const burger = this.menu.getBurgerIcon();
        const menu = this.menu.createMenu();
        this.wrapper.append(menu);
        const cart = this.appController.cartView.createCartIcon();
        container.append(burger, centralContainer, cart);
        return container;
    }

    public createHeader() {
        this.destroyAllChildNodes(this.headerContainer);
        const line = createWelcomeLine();
        const headerContent = this.createContentHeader();
        this.wrapper.append(headerContent);
        this.headerContainer.append(line, this.wrapper);
        return this.headerContainer;
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    public render() {
        this.createHeader();
        return this.container;
    }
}
