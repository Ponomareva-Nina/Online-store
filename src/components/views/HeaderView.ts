import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class Header {
    container: HTMLElement;
    appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = createElem('header', 'header');
    }

    private createNavigation() {
        const navigation = createElem('nav', 'main-nav');
        const navList = createElem('ul', 'main-nav__list');
        const links = {
            About: '#',
            Store: '#store',
            Cart: '#cart',
            Product: '#product/2',
        };

        for (const link in links) {
            const li = createElem('li');
            const a = createElem('a', 'nav-link', link);
            a.setAttribute('href', links[link as keyof typeof links]);
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (e) {
                    const target = e.target as HTMLElement;
                    const href = target.getAttribute('href') || '';
                    this.appController.router.changeCurrentPage(href);
                }
            });
            li.append(a);
            navList.append(li);
        }

        navigation.append(navList);
        return navigation;
    }

    public createHeader() {
        const navigation = this.createNavigation();
        this.container.append(navigation);
        return this.container;
    }
}
