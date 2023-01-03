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
        const title = createElem('h1', 'title', 'Cart Page');
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

    public render() {
        this.createPage();
        return this.container;
    }
}
