console.log('hello interfaces');

//types for router
export interface IRouter {
    loadRoute(): void;
    _matchUrlToRoute(urlSegments: string[]): void;
    _loadInitialRoute(): void;
}

type Params = {
    productId?: string;
};

export type Routes = {
    path: string;
    param?: Params;
    getTemplate: templateCallback;
};

type templateCallback = (params: Record<string, string>) => string;
