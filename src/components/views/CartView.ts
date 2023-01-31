import { LINKS } from '../../constants/route-constants';
import {
    ACTIVATE_PROMOCODE_BUTTON,
    CART_EMPTY,
    CART_TITLE,
    DEACTIVATE_PROMOCODE_BUTTON,
    PRODUCT_DESCRIPTION_ONSTOCK_TITLE,
    PRODUCT_DESCRIPTION_SIZE_TITLE,
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
    private quantity: HTMLSpanElement;
    private cartSum: HTMLSpanElement;
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
        this.container = document.createDocumentFragment();
        this.cartContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'cart-wrapper');
        this.quantity = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'cart-quantity');
        this.cartSum = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'cart-sum');
        this.totalProductsContent = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'products-content');
        this.totalSumContent = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'sum-content');
        this.promoCodesContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'promo-codes-container');
        this.totalSumDiscountContent = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'sum-content-discount');
        this.totalDiscountContainer = createElem<HTMLElement>(
            HTMLTags.P,
            'total-discount-container'
        ) as HTMLParagraphElement;
        this.promoContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'promo-container');
        this.checkoutPage = new CheckoutPage(this.appController);
    }

    public createPage(): void {
        this.appController.destroyAllChildNodes(this.cartContainer);
        const title = createElem<HTMLElement>(HTMLTags.H2, 'page-header', CART_TITLE);

        const productInCart = this.cartModel.productsInCart;

        if (productInCart.length !== 0) {
            productInCart.forEach((product): void => {
                const productContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'product-container');
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

    private createCard(card: Product): HTMLDivElement {
        const productContent = createElem<HTMLDivElement>(HTMLTags.DIV, 'product-content');
        const productCartImg = createElem<HTMLImageElement>(HTMLTags.IMG, 'product-image');
        productCartImg.setAttribute('src', card.thumbnail);
        productCartImg.setAttribute('alt', card.title);

        const cardCartContent = createElem<HTMLDivElement>(HTMLTags.DIV, 'card-content');
        const cardCartTitle = createElem<HTMLElement>(HTMLTags.H3, 'card-title', card.title);
        const cardCartDescription = createElem<HTMLDivElement>(HTMLTags.DIV, 'card-description');

        const cardSize = createElem<HTMLElement>(HTMLTags.P, 'card-size');
        const cardSizeSubtitle = createElem<HTMLSpanElement>(
            HTMLTags.SPAN,
            'subtitle-name',
            PRODUCT_DESCRIPTION_SIZE_TITLE
        );
        const cardSizeDescription = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'subtitle-name-description', 'one size');
        cardSize.append(cardSizeSubtitle, cardSizeDescription);

        const cardStock = createElem<HTMLElement>(HTMLTags.P, 'card-stock');
        const cardStockSubtitle = createElem<HTMLSpanElement>(
            HTMLTags.SPAN,
            'subtitle-name subtitle-name_low',
            PRODUCT_DESCRIPTION_ONSTOCK_TITLE
        );
        const cardStockDescription = createElem<HTMLSpanElement>(
            HTMLTags.SPAN,
            'subtitle-name-description',
            `${card.quantity}`
        );
        cardStock.append(cardStockSubtitle, cardStockDescription);

        const cardPrice = createElem<HTMLElement>(HTMLTags.P, 'card-price', `${card.price}`);

        cardCartDescription.append(cardSize, cardStock, cardPrice);

        cardCartContent.append(cardCartTitle, cardCartDescription);

        productContent.append(productCartImg, cardCartContent);

        return productContent;
    }

    private createManagePanel(card: Product): HTMLDivElement {
        const buttonsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'buttons-container');
        const counterContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'counter-container');
        counterContainer.addEventListener('click', (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            const currentTarget = e.currentTarget as HTMLElement;
            if (currentTarget.classList.contains('counter-container') && target.classList.contains('count-down')) {
                this.deleteProductFromCart(card);
            } else if (currentTarget.classList.contains('counter-container') && target.classList.contains('count-up')) {
                this.addProductToCart(card);
            }
        });
        const countDown = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'count-down counter-button');
        const productQuantity = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'product-quantity', `${card.inCart}`);
        const countUp = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'count-up counter-button');
        counterContainer.append(countDown, productQuantity, countUp);

        const counterPriceContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'price-counter-cont');

        const productPriceContainer = createElem<HTMLElement>(HTMLTags.P, 'product-price', `Total: ${card.sum} $`);
        counterPriceContainer.append(productPriceContainer, counterContainer);

        const cartDeleteProduct = createElem<HTMLButtonElement>(HTMLTags.BUTTON, 'btn button-all-delete', 'Delete');
        cartDeleteProduct.addEventListener('click', (): void => {
            this.cartModel.deleteProduct(card);
            this.updateCartInfo();
            this.updatePromoBlock();
            this.updatePage();
        });
        buttonsContainer.append(counterPriceContainer, cartDeleteProduct);

        return buttonsContainer;
    }

    public addProductToCart(product: Product): void {
        this.cartModel.addOneProduct(product);
    }

    public deleteProductFromCart(product: Product): void {
        this.cartModel.deleteOneProduct(product);
    }

    public checkCartIsEmpty(): void {
        if (this.cartModel.productsInCart.length === 0) {
            this.appController.destroyAllChildNodes(this.cartContainer);
            const emptyCart = createElem<HTMLDivElement>(HTMLTags.DIV, 'empty-cart', CART_EMPTY);
            this.cartContainer.append(emptyCart);
        }
    }

    public updatePage(): void {
        this.appController.destroyAllChildNodes(this.cartContainer);
        this.cartModel.productsInCart.forEach((card): void => {
            const productContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'product-container');
            productContainer.append(this.createCard(card), this.createManagePanel(card));
            this.cartContainer.append(productContainer);
        });
        this.checkCartIsEmpty();
    }

    public createCartIcon(): HTMLDivElement {
        const cartContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'cart-container');
        const link = createElem<HTMLLinkElement>(HTMLTags.LINK, 'cart-link');
        const cartIcon = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'cart-icon');
        link.append(this.quantity, cartIcon, this.cartSum);
        cartContainer.append(link);
        this.updateCartInfo();
        cartContainer.addEventListener('click', (): void => {
            this.appController.router.changeCurrentPage(LINKS.Cart);
        });
        return cartContainer;
    }

    public updateCartInfo(): void {
        if (this.cartModel.productsQuantity < Number(QUANTITY_TO_COMPARE_ITEMS_IN_CART)) {
            this.quantity.textContent = `${this.cartModel.productsQuantity} item`;
        } else {
            this.quantity.textContent = `${this.cartModel.productsQuantity} items`;
        }
        this.cartSum.textContent = `${this.cartModel.totalSum}`;
    }

    private createPromoBlock(): void {
        this.appController.destroyAllChildNodes(this.promoContainer);
        this.appController.destroyAllChildNodes(this.promoCodesContainer);
        const promoTitle = createElem<HTMLElement>(HTMLTags.P, 'page-header', PROMO_TITLE);
        const promoContentContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'content-container');

        const promoTotalContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'total-container');
        const totalProducts = createElem<HTMLElement>(HTMLTags.P, 'total-products');
        const totalProductsTitle = createElem<HTMLSpanElement>(
            HTMLTags.SPAN,
            'products-title',
            PROMO_TITLE_TOTAL_PRODUCTS
        );
        this.totalProductsContent.textContent = `${this.cartModel.productsQuantity}`;
        totalProducts.append(totalProductsTitle, this.totalProductsContent);
        const totalSum = createElem<HTMLElement>(HTMLTags.P, 'total-promo-sum');
        const totalSumTitle = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'sum-title', PROMO_TITLE_TOTAL_SUM);
        this.totalSumContent.textContent = `${this.cartModel.totalSum}`;
        if (this.cartModel.activatedPromocodes.length !== 0) {
            this.createBlockWithDiscountSum();
        }

        this.cartModel.activatedPromocodes.forEach((activatedPromocode): void => {
            if (activatedPromocode.active) {
                this.createPromoCodeView(activatedPromocode);
            }
        });

        this.cartModel.enteredPromocodes.forEach((enteredPromocode): void => {
            if (!enteredPromocode.active) {
                this.createPromoCodeView(enteredPromocode);
            }
        });

        totalSum.append(totalSumTitle, this.totalSumContent);
        const promoWithoutDiscountContainer = createElem<HTMLElement>(HTMLTags.P, 'promo-without-discount-container');
        this.appController.destroyAllChildNodes(promoWithoutDiscountContainer);
        promoWithoutDiscountContainer.append(totalProducts, totalSum);
        promoTotalContainer.append(promoWithoutDiscountContainer, this.totalDiscountContainer);

        const promoInputContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'input-container');
        const promoInput = createElem<HTMLInputElement>(HTMLTags.INPUT, 'promo-input');
        promoInput.placeholder = PROMO_CODES;
        promoInput.addEventListener('input', (): void => {
            this.cartModel.findEnteredPromoInPromocodes(promoInput.value);
        });

        promoInputContainer.append(promoInput);

        const promoBuyContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'buy-container');
        const promoBuyLeft = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'decor-buy decor_left');
        const promoBuyButton = createElem<HTMLButtonElement>(HTMLTags.BUTTON, 'btn buy-button', PROMO_BUY_BUTTON);
        const promoBuyRight = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'decor-buy decor_right');
        promoBuyButton.addEventListener('click', (): void => {
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

    public updatePromoBlock(): void {
        this.totalProductsContent.textContent = `${this.cartModel.productsQuantity}`;
        this.totalSumContent.textContent = `${this.cartModel.totalSum}`;
        if (this.cartModel.productsInCart.length === 0) {
            this.totalSumContent.classList.remove('crossline');
        }
    }

    public createPromoCodeView(promocode: Promocode): void {
        const promoCodeContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'promo-code-container') as HTMLDivElement;
        const promoCodesDescription = createElem<HTMLElement>(HTMLTags.P, 'promo-codes-description');
        const promoCodesTitle = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'promo-codes-title', `${promocode.title}`);
        const promoCodeDiscount = createElem<HTMLSpanElement>(
            HTMLTags.SPAN,
            'promo-codes-discout',
            `${promocode.discount}`
        );
        promoCodesDescription.append(promoCodesTitle, promoCodeDiscount);
        const promoCodeButtom = createElem<HTMLButtonElement>(
            HTMLTags.BUTTON,
            'promo-code-button',
            ACTIVATE_PROMOCODE_BUTTON
        );
        if (promocode.active) {
            promoCodeButtom.classList.add('promo-added');
            promoCodeButtom.textContent = DEACTIVATE_PROMOCODE_BUTTON;
            this.totalSumContent.classList.add('crossline');
        }
        promoCodeButtom.addEventListener('click', (): void => {
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

    public createBlockWithDiscountSum(): void {
        this.appController.destroyAllChildNodes(this.totalDiscountContainer);
        const totalOneDiscountContainer = createElem<HTMLParagraphElement>(HTMLTags.P);
        this.cartModel.activatedPromocodes.forEach((): void => {
            this.appController.destroyAllChildNodes(totalOneDiscountContainer);
            const totalSumTitleDiscount = createElem<HTMLSpanElement>(
                HTMLTags.SPAN,
                'sum-title-discount',
                PROMO_TITLE_TOTAL_SUM_DISCOUNT
            );
            this.totalSumDiscountContent.textContent = `${this.cartModel.totalSumWithDiscount}`;
            totalOneDiscountContainer.append(totalSumTitleDiscount, this.totalSumDiscountContent);
            this.totalDiscountContainer.append(totalOneDiscountContainer);
        });
    }

    public updateDiscountInfo(): void {
        this.totalSumDiscountContent.textContent = `${this.cartModel.totalSumWithDiscount}`;
        if (this.cartModel.productsInCart.length === 0) {
            this.appController.destroyAllChildNodes(this.promoContainer);
        }
    }

    public render(): DocumentFragment {
        this.createPage();
        return this.container;
    }
}
