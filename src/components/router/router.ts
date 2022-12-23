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

    public addProp() {
        //добавляет пропс при клике в адресную строку (проверки:
        // 1 - если в пропсах нет ничего кроме id - то через ?, если есть - &)
        // 2 - если добавляем id - добавляем через /
        // 3 - если добавляем в свойство в котором уже не пустой массив/undefined - то через | стрелку
    }

    private handleRouteWithProps(pathname: string) {
        // читает пропсы из адресной строки и добавляет в объект props Route-а
        const pathParams = pathname.split('/');
        console.log(pathParams);
    }

    private match(pathname: string) {
        const matchedRoute = this.routes.find((route: Route) => {
            if (route.pageName === pathname) {
                return route;
            }
        });

        if (matchedRoute) {
            return matchedRoute;
        } else {
            const matchedRouteWithParams = this.handleRouteWithProps(pathname);
            return matchedRouteWithParams;
        }
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
