import { LINKS } from '../../constants/route-constants';
import {
    ACTIVATE_PROMOCODE_BUTTON,
    CART_EMPTY,
    CART_TITLE,
    DEACTIVATE_PROMOCODE_BUTTON,
    PROMO_BUY_BUTTON,
    PROMO_CODES,
    PROMO_TITLE,
    PROMO_TITLE_TOTAL_PRODUCTS,
    PROMO_TITLE_TOTAL_SUM,
    PROMO_TITLE_TOTAL_SUM_DISCOUNT,
    QUANTITY_TO_COMPARE_ITEMS_IN_CART,
} from '../../constants/string-constants';
import { Product, Promocode, ViewComponent } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';
import CartModel from '../models/CartModel';
import CheckoutPage from './CheckoutPage';

export default class CartView implements ViewComponent {
    public container: DocumentFragment;
    public appController: AppController;
    public cartModel: CartModel;
    private cartContainer: HTMLElement;
    public totalPerProduct: number;
    public quantity: HTMLSpanElement;
    public cartSum: HTMLSpanElement;
    private totalProductsContent: HTMLSpanElement;
    private totalSumContent: HTMLSpanElement;
    private promoCodesContainer: HTMLDivElement;
    private totalSumDiscountContent: HTMLSpanElement;
    private totalDiscountContainer: HTMLParagraphElement;
    private promoContainer: HTMLDivElement;
    public checkoutPage: CheckoutPage;

    constructor(cart: CartModel, controller: AppController) {
        this.appController = controller;
        this.cartModel = cart;
        this.totalPerProduct = 0;
        this.container = document.createDocumentFragment();
        this.cartContainer = createElem(HTMLTags.DIV, 'cart-wrapper');
        this.quantity = createElem(HTMLTags.SPAN, 'cart-quantity');
        this.cartSum = createElem(HTMLTags.SPAN, 'cart-sum');
        this.totalProductsContent = createElem(HTMLTags.SPAN, 'products-content');
        this.totalSumContent = createElem(HTMLTags.SPAN, 'sum-content');
        this.promoCodesContainer = createElem(HTMLTags.DIV, 'promo-codes-container') as HTMLDivElement;
        this.totalSumDiscountContent = createElem(HTMLTags.SPAN, 'sum-content-discount');
        this.totalDiscountContainer = createElem(HTMLTags.P, 'total-discount-container') as HTMLParagraphElement;
        this.promoContainer = createElem(HTMLTags.DIV, 'promo-container') as HTMLDivElement;
        this.checkoutPage = new CheckoutPage(this.appController);
    }

    public createPage() {
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
        if (productInCart.length !== 0) {
            this.createPromoBlock();
            this.container.append(title, this.cartContainer, this.promoContainer);
        } else {
            this.container.append(title, this.cartContainer);
            this.checkCartIsEmpty();
        }

        const checkoutModal = this.checkoutPage.createPayCard();
        this.container.append(checkoutModal);
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
            this.updatePromoBlock();
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
        this.destroyAllChildNodes(this.cartContainer);
        this.cartModel.productsInCart.forEach((card) => {
            const productContainer = createElem(HTMLTags.DIV, 'product-container');
            productContainer.append(this.createCard(card), this.createManagePanel(card));
            this.cartContainer.append(productContainer);
        });
        this.checkCartIsEmpty();
    }

    public createCartIcon() {
        const cartContainer = createElem(HTMLTags.DIV, 'cart-container');
        const link = createElem(HTMLTags.LINK, 'cart-link');
        const cartIcon = createElem(HTMLTags.SPAN, 'cart-icon');
        link.append(this.quantity, cartIcon, this.cartSum);
        cartContainer.append(link);
        this.updateCartInfo();
        cartContainer.addEventListener('click', () => {
            this.appController.router.changeCurrentPage(LINKS.Cart);
        });
        return cartContainer;
    }

    public updateCartInfo() {
        if (this.cartModel.productsQuantity < Number(QUANTITY_TO_COMPARE_ITEMS_IN_CART)) {
            this.quantity.textContent = `${this.cartModel.productsQuantity} item`;
        } else {
            this.quantity.textContent = `${this.cartModel.productsQuantity} items`;
        }
        this.cartSum.textContent = `${this.cartModel.totalSum}`;
    }

    public createPromoBlock() {
        this.destroyAllChildNodes(this.promoContainer);
        this.destroyAllChildNodes(this.promoCodesContainer);
        const promoTitle = createElem(HTMLTags.P, 'page-header', PROMO_TITLE);
        const promoContentContainer = createElem(HTMLTags.DIV, 'content-container');

        const promoTotalContainer = createElem(HTMLTags.DIV, 'total-container');
        const totalProducts = createElem(HTMLTags.P, 'total-products');
        const totalProductsTitle = createElem(HTMLTags.SPAN, 'products-title', PROMO_TITLE_TOTAL_PRODUCTS);
        this.totalProductsContent.textContent = `${this.cartModel.productsQuantity}`;
        totalProducts.append(totalProductsTitle, this.totalProductsContent);
        const totalSum = createElem(HTMLTags.P, 'total-promo-sum');
        const totalSumTitle = createElem(HTMLTags.SPAN, 'sum-title', PROMO_TITLE_TOTAL_SUM);
        this.totalSumContent.textContent = `${this.cartModel.totalSum}`;
        if (this.cartModel.activatedPromocodes.length !== 0) {
            this.createBlockWithDiscountSum();
        }

        this.cartModel.activatedPromocodes.forEach((activatedPromocode) => {
            if (activatedPromocode.active) {
                this.createPromoCodeView(activatedPromocode);
            }
        });

        this.cartModel.enteredPromocodes.forEach((enteredPromocode) => {
            if (!enteredPromocode.active) {
                this.createPromoCodeView(enteredPromocode);
            }
        });

        totalSum.append(totalSumTitle, this.totalSumContent);
        const promoWithoutDiscountContainer = createElem(HTMLTags.P, 'promo-without-discount-container');
        this.destroyAllChildNodes(promoWithoutDiscountContainer);
        promoWithoutDiscountContainer.append(totalProducts, totalSum);
        promoTotalContainer.append(promoWithoutDiscountContainer, this.totalDiscountContainer);

        const promoInputContainer = createElem(HTMLTags.DIV, 'input-container');
        const promoInput = createElem(HTMLTags.INPUT, 'promo-input') as HTMLInputElement;
        promoInput.placeholder = PROMO_CODES;
        promoInput.addEventListener('input', () => {
            this.cartModel.findEnteredPromoInPromocodes(promoInput.value);
        });

        promoInputContainer.append(promoInput);

        const promoBuyContainer = createElem(HTMLTags.DIV, 'buy-container');
        const promoBuyLeft = createElem(HTMLTags.SPAN, 'decor-buy decor_left');
        const promoBuyButton = createElem(HTMLTags.BUTTON, 'btn buy-button', PROMO_BUY_BUTTON);
        const promoBuyRight = createElem(HTMLTags.SPAN, 'decor-buy decor_right');
        promoBuyButton.addEventListener('click', () => {
            this.checkoutPage.showModal();
        });
        promoBuyContainer.append(promoBuyLeft, promoBuyButton, promoBuyRight);

        promoContentContainer.append(
            promoTotalContainer,
            this.promoCodesContainer,
            promoInputContainer,
            promoBuyContainer
        );

        this.promoContainer.append(promoTitle, promoContentContainer);
    }

    public updatePromoBlock() {
        this.totalProductsContent.textContent = `${this.cartModel.productsQuantity}`;
        this.totalSumContent.textContent = `${this.cartModel.totalSum}`;
        if (this.cartModel.productsInCart.length === 0) {
            this.totalSumContent.classList.remove('crossline');
        }
    }

    public createPromoCodeView(promocode: Promocode) {
        const promoCodeContainer = createElem(HTMLTags.DIV, 'promo-code-container') as HTMLDivElement;
        const promoCodesDescription = createElem(HTMLTags.P, 'promo-codes-description');
        const promoCodesTitle = createElem(HTMLTags.SPAN, 'promo-codes-title', `${promocode.title}`);
        const promoCodeDiscount = createElem(HTMLTags.SPAN, 'promo-codes-discout', `${promocode.discount}`);
        promoCodesDescription.append(promoCodesTitle, promoCodeDiscount);
        const promoCodeButtom = createElem(HTMLTags.BUTTON, 'promo-code-button', ACTIVATE_PROMOCODE_BUTTON);
        if (promocode.active) {
            promoCodeButtom.classList.add('promo-added');
            promoCodeButtom.textContent = DEACTIVATE_PROMOCODE_BUTTON;
            this.totalSumContent.classList.add('crossline');
        }
        promoCodeButtom.addEventListener('click', () => {
            if (promocode.active) {
                promoCodeButtom.classList.remove('promo-added');
                promoCodeButtom.textContent = ACTIVATE_PROMOCODE_BUTTON;
                this.cartModel.handleDeletePromocode(promocode);
            } else {
                promoCodeButtom.classList.add('promo-added');
                promoCodeButtom.textContent = DEACTIVATE_PROMOCODE_BUTTON;
                this.cartModel.handleAddPromocode(promocode);
            }
            const checkIsPromocodesAplied = this.cartModel.checkIsPromocodesAplied();
            if (checkIsPromocodesAplied) {
                this.totalSumContent.classList.add('crossline');
            } else {
                this.totalSumContent.classList.remove('crossline');
            }
        });

        promoCodeContainer.append(promoCodesDescription, promoCodeButtom);
        this.promoCodesContainer.append(promoCodeContainer);
    }

    public createBlockWithDiscountSum() {
        this.destroyAllChildNodes(this.totalDiscountContainer);
        const totalOneDiscountContainer = createElem(HTMLTags.P);
        this.cartModel.activatedPromocodes.forEach(() => {
            this.destroyAllChildNodes(totalOneDiscountContainer);
            const totalSumTitleDiscount = createElem(
                HTMLTags.SPAN,
                'sum-title-discount',
                PROMO_TITLE_TOTAL_SUM_DISCOUNT
            );
            this.totalSumDiscountContent.textContent = `${this.cartModel.totalSumWithDiscount}`;
            totalOneDiscountContainer.append(totalSumTitleDiscount, this.totalSumDiscountContent);
            this.totalDiscountContainer.append(totalOneDiscountContainer);
        });
        return this.totalDiscountContainer;
    }

    public updateDiscountInfo() {
        this.totalSumDiscountContent.textContent = `${this.cartModel.totalSumWithDiscount}`;
        if (this.cartModel.productsInCart.length === 0) {
            this.destroyAllChildNodes(this.promoContainer);
        }
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
