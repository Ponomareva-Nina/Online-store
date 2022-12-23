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

    private loadInitialRoute() {
        console.log('hello');
        const pathNameSplit = window.location.pathname.split('/');
        const pathSegments = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : '';

        this.navigate(...pathSegments);
    }

    private matchUrlToRoute(urlSegments: string[]) {
        const routeParams: Record<string, string> = {};

        const matchedRoute = this.routes.find((route: Route) => {
            const routePathSegments = route.path.split('/').slice(1);

            if (routePathSegments.length !== urlSegments.length) {
                return false;
            }

            const match = routePathSegments.every((routePathSegment, i: number) => {
                return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
            });

            if (match) {
                routePathSegments.forEach((segment, i: number) => {
                    if (segment[0] === ':') {
                        const propName = segment.slice(1);
                        routeParams[propName] = decodeURIComponent(urlSegments[i]);
                    }
                });
            }
            return match;
        });
        return { ...matchedRoute, params: routeParams };
    }

    public navigate(...urlSegments: string[]) {
        const matchedRoute = this.matchUrlToRoute(urlSegments);
        const url = `/#${urlSegments.join('/')}`;

        window.history.pushState({}, '', url);

        if (matchedRoute.view) {
            this.appController.updatePage(matchedRoute.view);
        } else {
            alert('page 404');
        }
    }

    public init() {
        this.loadInitialRoute();

        window.addEventListener('popstate', () => {
            this.loadInitialRoute();
        });
    }
}

export default Router;
