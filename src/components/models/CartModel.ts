import { Product, Promocode } from '../../types/interfaces';
import AppController from '../app/app';
import promos from '../../promocodes.json';

export default class CartModel {
    public appController: AppController;
    public productsInCart: Product[];
    public totalSum: number;
    public productsQuantity: number;
    private promocodes: Promocode[];
    public enteredPromocodes: Promocode[];
    public activatedPromocodes: Promocode[];
    public totalSumWithDiscount: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.promocodes = promos.promocodes;
        this.productsInCart = this.appController.localState.CART;
        this.totalSum = this.appController.localState.TOTALSUM;
        this.productsQuantity = this.appController.localState.PRODUCTSQUANTITY;
        this.activatedPromocodes = this.appController.localState.ACTIVATED_PROMOCODES;
        this.totalSumWithDiscount = this.appController.localState.TOTAL_SUM_WITH_DISCOUNT;
        this.enteredPromocodes = [];
    }

    public addProduct(product: Product): Product[] | undefined {
        const isInCart = this.checkProductInCart(product.id);
        if (!isInCart) {
            this.productsInCart.push(product);
            product.inCart = 1;
            product.sum = product.price;
            this.productsQuantity += product.inCart;
            this.totalSum = Number((this.totalSum += product.inCart * product.price).toFixed(2));
            this.appController.addProductToCart(product);
            this.calculateAddingSumDiscoutDelete();
            this.appController.cartView.updateDiscountInfo();
            return this.productsInCart;
        }
    }

    public deleteProduct(product: Product): Product[] | undefined {
        const isInCart = this.checkProductInCart(product.id);
        if (isInCart) {
            const deletedIndex = this.productsInCart.indexOf(product);
            this.productsInCart.splice(deletedIndex, 1);
            if (product.inCart) {
                this.productsQuantity -= product.inCart;
                this.totalSum = Number((this.totalSum -= product.inCart * product.price).toFixed(2));
                product.inCart = 0;
                const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
                this.totalSumWithDiscount = Number(
                    (this.totalSum * (1 - currentTotalPercentDiscount / 100)).toFixed(2)
                );
                this.appController.cartView.updateDiscountInfo();
            }
        }
        return this.productsInCart;
    }

    public addOneProduct(product: Product): void {
        if (product.inCart && product.sum && product.inCart < product.quantity) {
            product.inCart += 1;
            this.productsQuantity += 1;
            this.totalSum = Number((this.totalSum += product.price).toFixed(2));
            product.sum = Number((product.sum += product.price).toFixed(2));
            this.calculateAddingSumDiscoutDelete();
            this.updateViewAfterDeleteProductFromCart();
        }
    }

    private updateViewAfterDeleteProductFromCart(): void {
        this.appController.cartView.updateCartInfo();
        this.appController.cartView.updatePromoBlock();
        this.appController.cartView.updatePage();
        this.appController.cartView.updateDiscountInfo();
    }

    public deleteOneProduct(product: Product): void {
        if (product.inCart === 1) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = product.price;
            this.calculateAddingSumDiscoutDelete();
            this.deleteProduct(product);
            this.updateViewAfterDeleteProductFromCart();
            this.appController.cartView.checkCartIsEmpty();
        }

        if (product.inCart && product.sum && product.inCart >= 2) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = Number((product.sum -= product.price).toFixed(2));
            this.calculateAddingSumDiscoutDelete();
            this.updateViewAfterDeleteProductFromCart();
        }
    }

    private calculateAddingSumDiscoutDelete(): void {
        const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
        this.totalSumWithDiscount = Number((this.totalSum * (1 - currentTotalPercentDiscount / 100)).toFixed(2));
    }

    public checkProductInCart(id: number): boolean {
        const idProductInCart = this.productsInCart.find((product): boolean => product.id === id);
        if (idProductInCart) {
            return this.productsInCart.includes(idProductInCart);
        } else {
            return false;
        }
    }

    public findEnteredPromoInPromocodes(enteredValue: string): void {
        this.promocodes.forEach((promocode) => {
            if (enteredValue.toLocaleUpperCase() === promocode.value) {
                if (!this.enteredPromocodes.find((enteredPromocode): boolean => enteredPromocode.id === promocode.id)) {
                    this.enteredPromocodes.push(promocode);
                    this.appController.cartView.createPromoCodeView(promocode);
                }
            }
        });
    }

    public handleAddPromocode(promocode: Promocode): void {
        if (this.productsInCart.length !== 0) {
            if (
                !this.activatedPromocodes.find((activatedPromocode): boolean => activatedPromocode.id === promocode.id)
            ) {
                this.activatedPromocodes.push(promocode);
                promocode.active = true;
                this.totalSumWithDiscount = Number(
                    (this.totalSumWithDiscount -= this.calculateDiscount(promocode)).toFixed(2)
                );
                this.appController.cartView.createBlockWithDiscountSum();
            }
        }
    }

    public handleDeletePromocode(promocode: Promocode): void {
        if (this.productsInCart.length !== 0) {
            const deletedPromocodeId = this.activatedPromocodes.indexOf(promocode);
            promocode.active = false;
            this.activatedPromocodes.splice(deletedPromocodeId, 1);
            this.totalSumWithDiscount = Number(
                (this.totalSumWithDiscount += this.calculateDiscount(promocode)).toFixed(2)
            );
            this.appController.cartView.createBlockWithDiscountSum();
        }
    }

    private calculateDiscount(promocode: Promocode): number {
        return this.totalSum * (promocode.discount / 100);
    }

    public checkIsPromocodesAplied(): boolean {
        return this.totalSum !== this.totalSumWithDiscount;
    }

    private getCurrentTotalPercentDiscount(): number {
        let currentTotalPercentDiscount = 0;
        if (this.checkIsPromocodesAplied()) {
            this.activatedPromocodes.forEach((activatedPromocode): void => {
                currentTotalPercentDiscount += activatedPromocode.discount;
            });
        }
        return currentTotalPercentDiscount;
    }

    public eraseAllAfterPurchaseg(): void {
        this.productsInCart.length = 0;
        this.activatedPromocodes.length = 0;
        this.enteredPromocodes.length = 0;
        this.totalSum = 0;
        this.productsQuantity = 0;
        this.totalSumWithDiscount = 0;
        this.appController.cartView.updateCartInfo();
        this.appController.cartView.updatePromoBlock();
    }
}
