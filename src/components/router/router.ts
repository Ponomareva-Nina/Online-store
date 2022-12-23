import { RouterInterface } from '../../types/interfaces';
import { routeComponents, Routes } from '../../types/types';
import AppController from '../app/app';
import routes from './routes';

class Router implements RouterInterface {
    routes: Routes;
    appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.routes = routes;
    }

    public setLocation(event: Event) {
        event = event || window.event;

        if (event) {
            const target = event.target as HTMLElement;
            event.preventDefault();
            window.history.pushState({}, '', target.getAttribute('href'));
        }

        this.navigate();
    }

    navigate() {
        let path = window.location.pathname;
        if (path.length === 0) {
            path = '/';
        }

        const route = routes.find((el) => el.path === path) || 404;
        if (route !== 404) {
            const pageId = route.component as routeComponents;
            this.appController.updateCurrentPage(pageId);
        } else {
            alert('page 404');
        }
    }

    init() {
        window.addEventListener('popstate', () => {
            this.navigate();
        });
        this.navigate();
        console.log('hello');
    }
}

export default Router;
