import {
    AMPERSAND_SEPARATOR,
    HASHTAG,
    PARAM_VALUES_SEPARATOR,
    QUERY_SEPARATOR,
    SLASH_SEPARATOR,
} from '../../constants/string-constants';
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
        this.currentPath = '';
    }

    private updateCurrentPath() {
        const [, path] = window.location.href.split(HASHTAG);
        this.currentPath = window.location.href.split(HASHTAG).length === 1 ? '' : path;
    }

    public changeCurrentPage(path: string) {
        window.history.pushState({}, '', path);
        this.navigate();
    }

    private updatePageUrl(route: Route) {
        const newParams = route.getParameters();
        let newPath = route.path;

        for (const key in newParams) {
            const params = newParams[key as PossibleUrlParams];
            if (params && params.length > 0) {
                const urlSegment = `${key}=${params.join(PARAM_VALUES_SEPARATOR)}`;
                if (key === 'id') {
                    newPath = newPath.concat(SLASH_SEPARATOR).concat(urlSegment);
                } else if (newPath.includes(QUERY_SEPARATOR)) {
                    newPath = newPath.concat(AMPERSAND_SEPARATOR).concat(urlSegment);
                } else {
                    newPath = newPath.concat(QUERY_SEPARATOR).concat(urlSegment);
                }
            }
        }
        window.history.pushState({}, '', newPath);
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
        const values = [
            PossibleUrlParams.ID,
            PossibleUrlParams.CATEGORY,
            PossibleUrlParams.FACULTY,
            PossibleUrlParams.SORT,
            PossibleUrlParams.PRICE,
            PossibleUrlParams.STOCK,
        ];

        const validationExp = new RegExp(values.join(PARAM_VALUES_SEPARATOR));
        const isCorrect = paramsArr.every((param) => {
            return validationExp.test(param);
        });
        return isCorrect;
    }

    private matchRouteWithParameters(path: string) {
        const [pageRoute, ...pathSegments] = path.split(this.UrlSeparator);
        if (!this.isCorrectParameters(pathSegments)) {
            return null;
        }

        const matchedRoute = this.routes.find((route: Route) => {
            return route.pageName === pageRoute;
        });

        if (matchedRoute) {
            matchedRoute.clearParameters();
            pathSegments.forEach((param) => {
                const [key, values] = param.split('=');
                const valuesArr = values.split(PARAM_VALUES_SEPARATOR);
                valuesArr.forEach((value) => {
                    matchedRoute.addParameter(key as PossibleUrlParams, value);
                });
            });
        }
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
        this.updateCurrentPath();
        const path = this.currentPath;
        const matchedRoute = this.matchUrl(path);
        if (matchedRoute) {
            const params = matchedRoute.getParameters();
            this.appController.updatePage(matchedRoute.getView(), params);
        } else {
            window.location.href = 'https://Ponomareva-Nina.github.io/Online-store/404.html';
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
