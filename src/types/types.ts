export type NullableElement<T> = T | null;

export type Routes = Array<RouteItem>;

export type RouteItem = {
    path: string;
    component?: string;
};

export enum routeComponents {
    cart = 'cartView',
    store = 'storeView',
    start = 'startPage',
}
