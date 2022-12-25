import { /* Props,*/ RouterInterface } from '../../types/interfaces';
// import { PossibleUrlParams } from '../../types/types';
import AppController from '../app/app';
import Route from './Route';

class Router implements RouterInterface {
    routes: Array<Route>;
    appController: AppController;
    UrlSeparator: RegExp;

    constructor(controller: AppController, routes: Array<Route>) {
        this.appController = controller;
        this.routes = routes;
        this.UrlSeparator = /\?|&|\//;
    }

    public updatePageUrl(path: string) {
        window.history.pushState({}, '', path);
        this.navigate();
    }

    public addParameterToUrl() {
        //добавляет параметр в адресную строку (проверки:
        // 1 - если в пропсах нет ничего кроме id - то через ?, если есть - &)
        // 2 - если добавляем id - добавляем через /
        // 3 - если добавляем в свойство в котором уже не пустой массив/undefined - то через | стрелку
    }

    public deleteParameterFromUrl(/*param: string, value: string*/) {
        //удаляет параметр
    }

    private isCorrectParameters(paramsArr: string[]) {
        const values = ['id', 'category', 'faculty', 'sort', 'price', 'stock'];
        const validationExp = new RegExp(values.join('|'));
        const isCorrect = paramsArr.every((param) => {
            console.log(param);
            console.log(validationExp.test(param));
            return validationExp.test(param);
        });
        return isCorrect;
    }

    private matchRouteWithParameters(path: string) {
        const pathSegments = path.split(this.UrlSeparator);
        if (!this.isCorrectParameters(pathSegments.splice(1))) {
            return null;
        } else {
            const matchedRoute = this.routes.find((route: Route) => {
                return route.pageName === pathSegments[0];
            });

            return matchedRoute;
        }
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
        const path = window.location.href.split('#').length === 1 ? '' : window.location.href.split('#')[1];
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
            this.navigate();
        });
    }
}

export default Router;
