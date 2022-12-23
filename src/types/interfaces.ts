import Router from '../components/router/router';
import CartView from '../components/views/CartView';
import Header from '../components/views/HeaderView';
import StartPageView from '../components/views/StartPageView';
import StoreView from '../components/views/StoreView';
import { Routes } from './types';

export interface RouterInterface {
    routes: Routes;
    navigate(): void;
}

export interface AppControllerInterface {
    router: Router;
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    header: Header;
    mainContainer: HTMLElement;
}
