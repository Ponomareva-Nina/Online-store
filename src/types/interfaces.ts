import AppController from '../components/app/app';
import Route from '../components/router/Route';
import CartView from '../components/views/CartView';
import Header from '../components/views/HeaderView';
import StartPageView from '../components/views/StartPageView';
import StoreView from '../components/views/StoreView';
import { MethodVoid, PossibleUrlParams } from './types';

export interface RouterInterface {
    routes: Array<Route>;
    navigate: MethodVoid;
    init: MethodVoid;
    changeCurrentPage: (path: string) => void;
    deleteParameterFromUrl: (name: PossibleUrlParams, value: string) => void;
    addParameterToUrl: (name: PossibleUrlParams, value: string) => void;
}

export interface AppControllerInterface {
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    header: Header;
    mainContainer: HTMLElement;
}

export type Props = {
    [x in PossibleUrlParams]?: string[];
};
export interface ViewComponent {
    container: DocumentFragment;
    appController: AppController;
    render: (props?: Props) => DocumentFragment;
}

export interface IMenu {
    appController: AppController;
    menuContainer: HTMLElement;
    burgerIcon: HTMLElement;
    getBurgerIcon: () => HTMLElement;
}
export interface Product {
    inCart?: number;
    id: number;
    faculty: string;
    category: string;
    title: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    thumbnail: string;
    images: string[];
}

export interface ProductCardInterface {
    cardData: Product;
    createBriefCard: () => HTMLElement;
    createFullCard: () => HTMLElement;
}

export interface IFooter {
    container: HTMLDivElement;
    wrapper: HTMLDivElement;
    renderFooter: () => HTMLElement;
}
