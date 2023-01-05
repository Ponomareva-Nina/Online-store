import { LINKS } from '../../constants/route-constants';
import { CART_TITLE } from '../../constants/string-constants';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';
import CartModel from '../models/CartModel';

export default class CartView {
    container: DocumentFragment;
    appController: AppController;
    cartModel: CartModel;
    totalSum: number;
    productsQuantity: number;
    cartContainer: HTMLDivElement;

    constructor(cart: CartModel, controller: AppController) {
        this.appController = controller;
        this.cartModel = cart;
        this.totalSum = 0;
        this.productsQuantity = 0;
        this.container = document.createDocumentFragment();
        this.cartContainer = createElem(HTMLTags.DIV, 'cart-container', '') as HTMLDivElement;
    }

    private createPage() {
        const title = createElem(HTMLTags.H2, 'page-header', CART_TITLE);
        this.container.append(title, this.cartContainer);
    }

    public addProductToCart(/*объект товара*/) {
        // создает вид карточки товара в корзине
        // this.container.append(cозданную карточку продукта);
        // this.renderProduct(объект)
        // this.sum = sum + товар.price;
        // this.productsQuantity += кол-во;
    }

    public deleteProductFromCart(/*объект товара*/) {
        //
    }

    private destroyAllChildNodes(parent: Node) {
        //очищает содержимое контейрнера
        //вызывает перед перерисовкой содержимого parent
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    private updatePage() {
        //берет из модели текущие товары корзины и отрисовывает их
        console.log(this.cartModel.productsInCart);
    }

    public createCartIcon() {
        const cartContainer = createElem(HTMLTags.DIV, 'cart-container');
        const link = createElem(HTMLTags.LINK, 'cart-link');
        const cartIcon = createElem(HTMLTags.SPAN, 'cart-icon');
        const quantity = createElem(HTMLTags.SPAN, 'cart-quantity');
        link.append(cartIcon, quantity);
        quantity.textContent = `${this.productsQuantity}`;
        cartContainer.append(link);
        cartContainer.addEventListener('click', (e) => {
            this.appController.router.changeCurrentPage(LINKS.Cart);
            this.appController.header.handleNavigationClick(e);
        });
        return cartContainer;
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
