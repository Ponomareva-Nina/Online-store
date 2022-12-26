import { RouterInterface } from '../../types/interfaces';
import { PossibleUrlParams } from '../../types/types';
import AppController from '../app/app';
import Route from './Route';

class Router implements RouterInterface {
    routes: Array<Route>;
    appController: AppController;
    UrlSeparator: RegExp;
    currentPath: string;

    constructor(controller: AppController, routes: Array<Route>) {
        this.appController = controller;
        this.routes = routes;
        this.UrlSeparator = /\?|&|\//;
        this.currentPath = window.location.href.split('#').length === 1 ? '' : window.location.href.split('#')[1];
    }

    public changeCurrentPage(path: string) {
        window.history.pushState({}, '', path);
        this.currentPath = window.location.href.split('#').length === 1 ? '' : window.location.href.split('#')[1];
        this.navigate();
    }

    private updatePageUrl(route: Route) {
        const newParams = route.getParameters();
        let newPath = route.path;

        for (const key in newParams) {
            const params = newParams[key as PossibleUrlParams];
            if (params && params.length > 0) {
                const urlSegment = `${key}=${params.join('↕')}`;
                if (newPath.includes('?')) {
                    newPath = newPath.concat('&').concat(urlSegment);
                } else {
                    newPath = newPath.concat('?').concat(urlSegment);
                }
            }
        }
        window.history.pushState({}, '', newPath);
        this.navigate();
    }

    public addParameterToUrl(name: PossibleUrlParams, value: string): void {
        const currentRoute = this.matchUrl(this.currentPath);

        if (currentRoute) {
            currentRoute.addParameter(name, value);
            this.updatePageUrl(currentRoute);
        }
    }

    public deleteParameterFromUrl(name: PossibleUrlParams, value: string): void {
        const currentRoute = this.matchUrl(this.currentPath);

        if (currentRoute) {
            currentRoute.deleteParameter(name, value);
            this.updatePageUrl(currentRoute);
        }
    }

    private isCorrectParameters(paramsArr: string[]) {
        const values = ['id', 'category', 'faculty', 'sort', 'price', 'stock'];
        const validationExp = new RegExp(values.join('|'));
        const isCorrect = paramsArr.every((param) => {
            return validationExp.test(param);
        });
        return isCorrect;
    }

    private matchRouteWithParameters(path: string) {
        const pathSegments = path.split(this.UrlSeparator);
        if (!this.isCorrectParameters(pathSegments.splice(1))) {
            return null;
        }

        const matchedRoute = this.routes.find((route: Route) => {
            return route.pageName === pathSegments[0];
        });

        return matchedRoute;
    }

    private matchUrl(path: string) {
        const matchedRoute = this.routes.find((route: Route) => {
            if (route.pageName === path) {
                return route;
            }
        });
        if (matchedRoute) {
            return matchedRoute;
        } else {
            return this.matchRouteWithParameters(path);
        }
    }

    public navigate() {
        const path = this.currentPath;
        const matchedRoute = this.matchUrl(path);
        if (!matchedRoute) {
            alert('page 404');
        } else {
            this.appController.updatePage(matchedRoute.getView());
        }
    }

    public init() {
        this.navigate();

        window.addEventListener('popstate', () => {
            this.currentPath = window.location.href.split('#').length === 1 ? '' : window.location.href.split('#')[1];
            this.navigate();
        });
    }
}

export default Router;
