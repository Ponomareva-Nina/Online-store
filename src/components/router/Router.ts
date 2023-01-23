import { NullableElement } from './../../types/types';
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
    public routes: Array<Route>;
    private appController: AppController;
    private UrlSeparator: RegExp;
    private currentPagePath: string;
    public currentRoute: Route | null;

    constructor(controller: AppController, routes: Array<Route>) {
        this.appController = controller;
        this.routes = routes;
        this.UrlSeparator = /\?|&|\//;
        this.currentPagePath = '';
        this.currentRoute = null;
    }

    private updateCurrentPath(): void {
        const route = window.location.href.split(HASHTAG);
        const [, path] = route;
        this.currentPagePath = route.length === 1 ? '' : path;
    }

    public changeCurrentPage(path: string): void {
        window.history.pushState({}, '', path);
        this.navigate();
    }

    public clearAllFilters(): void {
        if (this.currentRoute) {
            this.currentRoute.clearFilters();
            this.updatePageUrl(this.currentRoute);
        }
    }

    private updatePageUrl(route: Route): void {
        const newParams = route.getParameters();
        let newPath = route.path;

        for (const key in newParams) {
            const params = newParams[key as PossibleUrlParams];
            if (params && !params.includes('') && params.length > 0) {
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
        window.location.hash = newPath;
    }

    public addStockRangeToUrl(minValue: string, maxValue: string): void {
        if (this.currentRoute) {
            this.currentRoute.updateStockParameter(minValue, maxValue);
            this.updatePageUrl(this.currentRoute);
        }
    }

    public addPriceRangeToUrl(minValue: string, maxValue: string): void {
        if (this.currentRoute) {
            this.currentRoute.updatePriceParameter(minValue, maxValue);
            this.updatePageUrl(this.currentRoute);
        }
    }

    public addParameterToUrl(name: PossibleUrlParams, value: string): void {
        if (this.currentRoute) {
            this.currentRoute.addParameter(name, value);
            this.updatePageUrl(this.currentRoute);
        }
    }

    public deleteParameterFromUrl(name: PossibleUrlParams, value: string): void {
        if (this.currentRoute) {
            this.currentRoute.deleteParameter(name, value);
            this.updatePageUrl(this.currentRoute);
        }
    }

    private isCorrectParameters(paramsArr: string[]): boolean {
        const params = [
            PossibleUrlParams.ID,
            PossibleUrlParams.CATEGORY,
            PossibleUrlParams.FACULTY,
            PossibleUrlParams.SORT,
            PossibleUrlParams.PRICE,
            PossibleUrlParams.STOCK,
            PossibleUrlParams.SEARCH,
        ];

        const validationExp = new RegExp(params.join(PARAM_VALUES_SEPARATOR));
        const isCorrect = paramsArr.every((param) => {
            return validationExp.test(param);
        });
        return isCorrect;
    }

    private matchUrl(path: string): NullableElement<Route> {
        const [pageRoute, ...pathSegments] = path.split(this.UrlSeparator);

        if (!this.isCorrectParameters(pathSegments)) {
            return null;
        }

        const matchedRoute = this.routes.find((route: Route) => {
            return route.pageName === pageRoute;
        });

        if (matchedRoute) {
            matchedRoute.clearParameters();
            if (pathSegments.length > 0) {
                pathSegments.forEach((param) => {
                    const [key, values] = param.split('=');
                    if (values) {
                        const valuesArr = values.split(PARAM_VALUES_SEPARATOR);
                        valuesArr.forEach((value) => {
                            matchedRoute.addParameter(key as PossibleUrlParams, value);
                        });
                    }
                });
            }
            return matchedRoute;
        }
        return null;
    }

    public navigate(): void {
        this.updateCurrentPath();
        const path = this.currentPagePath;
        const matchedRoute = this.matchUrl(path);

        if (matchedRoute) {
            this.currentRoute = matchedRoute;
            const params = this.currentRoute.getParameters();
            this.appController.updatePage(this.currentRoute.getView(), params);
        } else {
            window.location.href = 'https://Ponomareva-Nina.github.io/Online-store/404.html';
        }
    }

    public init(): void {
        this.navigate();

        window.addEventListener('popstate', () => {
            this.navigate();
        });
    }
}

export default Router;
