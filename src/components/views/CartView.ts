import { LINKS } from '../../constants/route-constants';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class CartView {
    container: DocumentFragment;
    appController: AppController;
    totalSum: number;
    productsQuantity: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.totalSum = 0;
        this.productsQuantity = 0;
        this.container = document.createDocumentFragment();
    }

    private createPage() {
        const title = createElem(HTMLTags.H2, 'title', 'Cart Page');
        this.container.append(title);
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

    public createCartIcon() {
        const cartContainer = createElem(HTMLTags.DIV, 'cart-container');
        const link = createElem(HTMLTags.LINK);
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
