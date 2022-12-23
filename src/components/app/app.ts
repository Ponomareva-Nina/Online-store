import CartView from '../views/CartView';
import StartPageView from '../views/StartPageView';
import StoreView from '../views/StoreView';
import Header from '../views/HeaderView';
import createElem from '../../utils/utils';
import { AppControllerInterface, viewComponent } from '../../types/interfaces';
import Route from '../router/Route';
import Router from '../router/router';

export default class AppController implements AppControllerInterface {
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    header: Header;
    mainContainer: HTMLElement;
    private static instance: InstanceType<typeof AppController>;
    routes: Route[];
    router: Router;

    constructor() {
        this.header = new Header(this);
        this.mainContainer = createElem('main', 'main');
        this.cartView = new CartView(this);
        this.startPage = new StartPageView(this);
        this.storeView = new StoreView(this);
        this.routes = [
            new Route('startPage', '/', this.startPage),
            new Route('storeView', '/store', this.storeView),
            new Route('cartView', '/cart', this.cartView),
            new Route('product', '/products/:productId', this.startPage),
        ];
        this.router = new Router(this, this.routes);

        if (AppController.instance) {
            return AppController.instance;
        }
        AppController.instance = this;
    }

    start() {
        console.log('start');
        document.body.append(this.header.createHeader(), this.mainContainer);
        this.router.init();
    }

    updatePage(view: viewComponent) {
        this.mainContainer.innerHTML = '';
        this.mainContainer.append(view.render());
    }
}
