import { LINKS } from '../../constants/route-constants';
import { CART_EMPTY, CART_TITLE } from '../../constants/string-constants';
import { Product, ViewComponent } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';
import CartModel from '../models/CartModel';

export default class CartView implements ViewComponent {
    container: DocumentFragment;
    appController: AppController;
    cartModel: CartModel;
    cartContainer: HTMLElement;
    totalPerProduct: number;
    quantity: HTMLSpanElement;
    cartSum: HTMLSpanElement;

    constructor(cart: CartModel, controller: AppController) {
        this.appController = controller;
        this.cartModel = cart;
        this.totalPerProduct = 0;
        this.container = document.createDocumentFragment();
        this.cartContainer = createElem(HTMLTags.DIV, 'cart-wrapper');
        this.quantity = createElem(HTMLTags.SPAN, 'cart-quantity');
        this.cartSum = createElem(HTMLTags.SPAN, 'cart-sum');
    }

    public createPage() {
        this.destroyAllChildNodes(this.container);
        this.destroyAllChildNodes(this.cartContainer);

        const title = createElem(HTMLTags.H2, 'page-header', CART_TITLE);

        const productInCart = this.cartModel.productsInCart;

        if (productInCart.length !== 0) {
            productInCart.forEach((product) => {
                const productContainer = createElem(HTMLTags.DIV, 'product-container');
                const productContent = this.createCard(product);
                const buttonsContainer = this.createManagePanel(product);
                productContainer.append(productContent, buttonsContainer);
                this.cartContainer.append(productContainer);
            });
        }
        this.container.append(title, this.cartContainer);
        this.checkCartIsEmpty();
        return this.container;
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
        const cardStockSubtitle = createElem(HTMLTags.SPAN, 'subtitle-name subtitle-name_low', 'Available in stock: ');
        const cardStockDescription = createElem(HTMLTags.SPAN, 'subtitle-name-description', `${card.quantity}`);
        cardStock.append(cardStockSubtitle, cardStockDescription);

        const cardPrice = createElem(HTMLTags.P, 'card-price', `${card.price}`);

        cardCartDescription.append(cardSize, cardStock, cardPrice);

        cardCartContent.append(cardCartTitle, cardCartDescription);

        productContent.append(productCartImg, cardCartContent);

        return productContent;
    }

    private createManagePanel(card: Product) {
        const buttonsContainer = createElem(HTMLTags.DIV, 'buttons-container');
        const counterContainer = createElem(HTMLTags.DIV, 'counter-container');
        counterContainer.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const currentTarget = e.currentTarget as HTMLElement;
            if (currentTarget.classList.contains('counter-container') && target.classList.contains('count-down')) {
                this.deleteProductFromCart(card);
            } else if (currentTarget.classList.contains('counter-container') && target.classList.contains('count-up')) {
                this.addProductToCart(card);
            }
        });
        const countDown = createElem(HTMLTags.SPAN, 'count-down counter-button');
        const productQuantity = createElem(HTMLTags.SPAN, 'product-quantity', `${card.inCart}`);
        const countUp = createElem(HTMLTags.SPAN, 'count-up counter-button');
        counterContainer.append(countDown, productQuantity, countUp);

        const counterPriceContainer = createElem(HTMLTags.DIV, 'price-counter-cont');

        const productPriceContainer = createElem(HTMLTags.P, 'product-price', `Total: ${card.sum} $`);
        counterPriceContainer.append(productPriceContainer, counterContainer);

        const cartDeleteProduct = createElem(HTMLTags.BUTTON, 'btn button-all-delete', 'Delete');
        cartDeleteProduct.addEventListener('click', () => {
            this.cartModel.deleteProduct(card);
            this.updateCartInfo();
            this.updatePage();
        });
        buttonsContainer.append(counterPriceContainer, cartDeleteProduct);

        return buttonsContainer;
    }

    public addProductToCart(product: Product) {
        this.cartModel.addOneProduct(product);
    }

    public deleteProductFromCart(product: Product) {
        this.cartModel.deleteOneProduct(product);
    }

    public checkCartIsEmpty() {
        if (this.cartModel.productsInCart.length === 0) {
            this.destroyAllChildNodes(this.cartContainer);
            const emptyCart = createElem(HTMLTags.DIV, 'empty-cart', CART_EMPTY);
            this.cartContainer.append(emptyCart);
        }
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    public updatePage() {
        //берет из модели текущие товары корзины и отрисовывает их
        this.destroyAllChildNodes(this.cartContainer);
        this.cartModel.productsInCart.forEach((card) => {
            const productContainer = createElem(HTMLTags.DIV, 'product-container');
            productContainer.append(this.createCard(card), this.createManagePanel(card));
            this.cartContainer.append(productContainer);
        });
        this.checkCartIsEmpty();
    }

    public updateCartInfo() {
        this.quantity.textContent = `${this.cartModel.productsQuantity}`;
        this.cartSum.textContent = `${this.cartModel.totalSum}`;
    }

    public createCartIcon() {
        const cartContainer = createElem(HTMLTags.DIV, 'cart-container');
        const link = createElem(HTMLTags.LINK, 'cart-link');

        const cartIcon = createElem(HTMLTags.SPAN, 'cart-icon');

        link.append(cartIcon, this.quantity);
        this.quantity.textContent = `${this.cartModel.productsQuantity}`;

        cartContainer.append(this.cartSum, link);
        this.cartSum.textContent = `${this.cartModel.totalSum}`;
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
