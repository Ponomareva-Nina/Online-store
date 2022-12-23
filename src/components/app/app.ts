import Router from '../router/router';
import CartView from '../views/CartView';
import StartPageView from '../views/StartPageView';
import StoreView from '../views/StoreView';
import Header from '../views/HeaderView';
import createElem from '../../utils/utils';
import { AppControllerInterface } from '../../types/interfaces';
import { routeComponents } from '../../types/types';

export default class AppController implements AppControllerInterface {
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    header: Header;
    mainContainer: HTMLElement;
    router: Router;

    constructor() {
        this.header = new Header(this);
        this.mainContainer = createElem('main', 'main');
        this.cartView = new CartView(this);
        this.startPage = new StartPageView(this);
        this.storeView = new StoreView(this);
        this.router = new Router(this);
    }

    start() {
        document.body.append(this.header.createHeader(), this.mainContainer);
        this.router.init();
    }

    updateCurrentPage(pageId: routeComponents) {
        this.mainContainer.innerHTML = '';
        this.mainContainer.append(this[pageId].render());
    }
}
