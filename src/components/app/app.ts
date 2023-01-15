import CartView from '../views/CartView';
import StartPageView from '../views/StartPageView';
import StoreView from '../views/StoreView';
import Header from '../views/HeaderView';
import { createElem } from '../../utils/utils';

import Menu from '../views/Menu';
import { LINKS } from '../../constants/route-constants';
import { AppControllerInterface, Product, Props, ViewComponent } from '../../types/interfaces';
import Route from '../router/Route';
import Router from '../router/Router';
import ProductPage from '../views/ProductPage';
import '../models/StoreModel';
import StoreModel from '../models/StoreModel';
import Footer from '../views/FooterVew';
import CartModel from '../models/CartModel';
import {
    LOCAL_STORAGE_ACTIVATED_PROMOCODES,
    LOCAL_STORAGE_CART,
    LOCAL_STORAGE_PRODUCTSQUANTITY,
    LOCAL_STORAGE_TOTALSUM,
    LOCAL_STORAGE_TOTAL_SUM_WITH_DISCOUNT,
    ZERO,
} from '../../constants/string-constants';

export default class AppController implements AppControllerInterface {
    private static instance: InstanceType<typeof AppController>;
    public mainContainer: HTMLElement;
    public header: Header;
    public routes: Route[];
    public router: Router;
    public cartView: CartView;
    public storeView: StoreView;
    public startPage: StartPageView;
    public menu: Menu;
    public productPage: ProductPage;
    public storeModel: StoreModel;
    public footer: Footer;
    public cartModel: CartModel;

    constructor() {
        this.menu = new Menu(this);
        this.header = new Header(this);
        this.cartModel = new CartModel(this);
        this.cartView = new CartView(this.cartModel, this);
        this.mainContainer = createElem('main', 'main wrapper');
        this.startPage = new StartPageView(this);
        this.storeModel = new StoreModel(this);
        this.storeView = new StoreView(this.storeModel, this);
        this.productPage = new ProductPage(this);
        this.footer = new Footer();
        this.routes = [
            new Route('', LINKS.About, this.startPage),
            new Route('store', LINKS.Store, this.storeView),
            new Route('cart', LINKS.Cart, this.cartView),
            new Route('product', '#product', this.productPage),
        ];
        this.router = new Router(this, this.routes);

        if (AppController.instance) {
            return AppController.instance;
        }
        AppController.instance = this;
    }

    public start() {
        document.body.append(this.header.createHeader(), this.mainContainer, this.footer.renderFooter());
        this.router.init();
        this.addToLocalStorage();
    }

    public updatePage(view: ViewComponent, params?: Props) {
        this.destroyAllChildNodes(this.mainContainer);
        this.mainContainer.append(view.render(params));
        this.header.setActiveLink();
    }

    public addProductToCart(product: Product) {
        this.cartModel.addProduct(product);
        this.cartView.updateCartInfo();
        this.cartView.updatePromoBlock();
    }

    public deleteProductFromCart(product: Product) {
        this.cartModel.deleteProduct(product);
        this.cartView.updateCartInfo();
        this.cartView.updatePromoBlock();
    }

    private addToLocalStorage() {
        window.addEventListener('beforeunload', () => {
            localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(this.cartModel.productsInCart));
            localStorage.setItem(LOCAL_STORAGE_TOTALSUM, this.cartModel.totalSum.toString());
            localStorage.setItem(LOCAL_STORAGE_PRODUCTSQUANTITY, this.cartModel.productsQuantity.toString());
            localStorage.setItem(
                LOCAL_STORAGE_ACTIVATED_PROMOCODES,
                JSON.stringify(this.cartModel.activatedPromocodes)
            );
            if (this.cartModel.totalSumWithDiscount !== 0) {
                if (this.cartModel.totalSum == 0) {
                    localStorage.setItem(LOCAL_STORAGE_TOTAL_SUM_WITH_DISCOUNT, ZERO);
                }
                localStorage.setItem(
                    LOCAL_STORAGE_TOTAL_SUM_WITH_DISCOUNT,
                    this.cartModel.totalSumWithDiscount.toString()
                );
            }
        });
    }

    public destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
