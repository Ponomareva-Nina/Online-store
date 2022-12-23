import AppController from '../components/app/app';
import Route from '../components/router/Route';
import CartView from '../components/views/CartView';
import Header from '../components/views/HeaderView';
import StartPageView from '../components/views/StartPageView';
import StoreView from '../components/views/StoreView';

export interface RouterInterface {
    routes: Array<Route>;
    navigate(...urlSegments: string[]): void;
}

export interface AppControllerInterface {
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    header: Header;
    mainContainer: HTMLElement;
}

export interface viewComponent {
    container: DocumentFragment;
    appController: AppController;
    render: () => DocumentFragment;
}
