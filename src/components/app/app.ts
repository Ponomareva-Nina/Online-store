import CartView from '../views/CartView';
import StartPageView from '../views/StartPageView';
import StoreView from '../views/StoreView';
import Header from '../views/HeaderView';
import createElem from '../../utils/utils';
import { AppControllerInterface, Props, ViewComponent } from '../../types/interfaces';
import Route from '../router/Route';
import Router from '../router/Router';
import ProductPage from '../views/productPage';
import '../models/StoreModel';
import StoreModel from '../models/StoreModel';

export default class AppController implements AppControllerInterface {
    private static instance: InstanceType<typeof AppController>;
    mainContainer: HTMLElement;
    header: Header;
    routes: Route[];
    router: Router;
    cartView: CartView;
    storeView: StoreView;
    startPage: StartPageView;
    productPage: ProductPage;
    storeModel: StoreModel;

    constructor() {
        this.header = new Header(this);
        this.mainContainer = createElem('main', 'main');
        this.cartView = new CartView(this);
        this.startPage = new StartPageView(this);
        this.storeView = new StoreView(this);
        this.productPage = new ProductPage(this);
        this.storeModel = new StoreModel(this);
        this.routes = [
            new Route('', '#', this.startPage),
            new Route('store', '#store', this.storeView),
            new Route('cart', '#cart', this.cartView),
            new Route('product', '#product', this.productPage),
        ];
        this.router = new Router(this, this.routes);

        if (AppController.instance) {
            return AppController.instance;
        }
        AppController.instance = this;
    }

    public start() {
        document.body.append(this.header.createHeader(), this.mainContainer);
        this.router.init();
    }

    public updatePage(view: ViewComponent, params?: Props) {
        this.mainContainer.innerHTML = '';
        this.mainContainer.append(view.render(params));
    }
}
