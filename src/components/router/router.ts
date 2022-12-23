import { RouterInterface } from '../../types/interfaces';
import AppController from '../app/app';
import Route from './Route';

class Router implements RouterInterface {
    routes: Array<Route>;
    appController: AppController;

    constructor(controller: AppController, routes: Array<Route>) {
        this.appController = controller;
        this.routes = routes;
    }

    public updatePageUrl(path: string) {
        window.history.pushState({}, '', path);
        this.navigate();
    }

    private match(pathname: string) {
        const matchedRoute = this.routes.find((route: Route) => {
            if (route.pageName === pathname) {
                return route;
            } else {
                const pathParams = pathname.split('/');
                console.log(pathParams);
            }
        });
        return matchedRoute;
    }

    public navigate() {
        const pathname = window.location.href.split('#').length === 1 ? '' : window.location.href.split('#')[1];
        const matchedRoute = this.match(pathname);
        if (!matchedRoute) {
            alert('page 404');
        } else {
            this.appController.updatePage(matchedRoute.getView());
        }
    }

    public init() {
        this.navigate();

        window.addEventListener('popstate', () => {
            this.navigate();
        });
    }
}

export default Router;
