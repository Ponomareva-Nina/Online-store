import { LINKS } from '../../constants/route-constants';
import { CART_TITLE } from '../../constants/string-constants';
import { Product } from '../../types/interfaces';
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
        this.cartContainer = createElem(HTMLTags.DIV, 'cart-wrapper', '') as HTMLDivElement;
    }

    private createPage() {
        this.destroyAllChildNodes(this.cartContainer);

        const title = createElem(HTMLTags.H2, 'page-header', CART_TITLE);

        const productInCart = this.cartModel.productsInCart;

        if (productInCart.length !== 0) {
            productInCart.forEach((product) => {
                const productContainer = createElem(HTMLTags.DIV, 'product-container');
                const productContent = this.createCard(product);
                const buttonsContainer = this.createCounters(/*card: Product*/);
                productContainer.append(productContent, buttonsContainer);
                this.cartContainer.append(productContainer);
            });
        }
        this.container.append(title, this.cartContainer);
    }

    private createCard(card: Product) {
        const productContent = createElem(HTMLTags.DIV, 'product-content');
        const productCartImg = createElem(HTMLTags.IMG, 'product-image');
        productCartImg.setAttribute('src', card.thumbnail);
        productCartImg.setAttribute('alt', card.title);

        const cardCartContent = createElem(HTMLTags.DIV, 'card-content');
        const cardCartTitle = createElem(HTMLTags.H3, 'card-title', card.title);
        const cardCartDescription = createElem(HTMLTags.DIV, 'card-description');

        const cardSize = createElem(HTMLTags.P, 'card-size');
        const cardSizeSubtitle = createElem(HTMLTags.SPAN, 'subtitle-name', 'size: ');
        const cardSizeDescription = createElem(HTMLTags.SPAN, 'subtitle-name-description', 'one size');
        cardSize.append(cardSizeSubtitle, cardSizeDescription);

        const cardStock = createElem(HTMLTags.P, 'card-stock');
        const cardStockSubtitle = createElem(HTMLTags.SPAN, 'subtitle-name', 'Available in stock: ');
        const cardStockDescription = createElem(HTMLTags.SPAN, 'subtitle-name-description', `${card.quantity}`);
        cardStock.append(cardStockSubtitle, cardStockDescription);

        const cardPrice = createElem(HTMLTags.P, 'card-price', `${card.price}`);

        cardCartDescription.append(cardSize, cardStock, cardPrice);

        cardCartContent.append(cardCartTitle, cardCartDescription);

        productContent.append(productCartImg, cardCartContent);

        return productContent;
    }

    private createCounters(/*card: Product*/) {
        const buttonsContainer = createElem(HTMLTags.DIV, 'buttons-container');
        const counterContainer = createElem(HTMLTags.DIV, 'counter-container');
        const countDown = createElem(HTMLTags.SPAN, 'count-down counter-button');
        const productQuantity = createElem(HTMLTags.SPAN, 'product-quantity', '1');
        const countUp = createElem(HTMLTags.SPAN, 'count-up counter-button');
        counterContainer.append(countDown, productQuantity, countUp);

        const cartDeleteProduct = createElem(HTMLTags.BUTTON, 'btn button-all-delete', 'Delete');
        buttonsContainer.append(counterContainer, cartDeleteProduct);

        return buttonsContainer;
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
