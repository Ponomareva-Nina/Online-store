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
        // создает вид карточки товара в корзине
        // this.container.append(cозданную карточку продукта);
        // this.renderProduct(объект)
        // this.sum = sum + товар.price;
        // this.productsQuantity += кол-во;
    }

    //создает иконку корзины и кол-ва товаров в ней, вызывается из header
    public createCartIcon() {
        const cartContainer = createElem(HTMLTags.DIV, 'cart-container');
        const cartIcon = createElem(HTMLTags.SPAN, 'cart-icon');
        const quantity = createElem(HTMLTags.SPAN, 'cart-quantity');
        quantity.textContent = `${this.productsQuantity}`;
        cartContainer.append(cartIcon, quantity);
        cartContainer.addEventListener('click', () => {
            this.appController.router.changeCurrentPage(LINKS.Cart);
        });
        return cartContainer;
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
