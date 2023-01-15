import { Product, Promocode } from '../../types/interfaces';
import AppController from '../app/app';
import promos from '../../promocodes.json';
import {
    LOCAL_STORAGE_ACTIVATED_PROMOCODES,
    LOCAL_STORAGE_CART,
    LOCAL_STORAGE_PRODUCTSQUANTITY,
    LOCAL_STORAGE_TOTALSUM,
    LOCAL_STORAGE_TOTAL_SUM_WITH_DISCOUNT,
} from '../../constants/string-constants';

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
        this.totalSum = this.checkTotalSumInLocalStorage();
        this.productsQuantity = this.checkProductQuantityInLocalStorage();

        if (localStorage.getItem(LOCAL_STORAGE_CART)) {
            this.productsInCart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART) || '{}');
        } else {
            this.productsInCart = [];
        }

        if (localStorage.getItem(LOCAL_STORAGE_ACTIVATED_PROMOCODES)) {
            this.activatedPromocodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVATED_PROMOCODES) || '{}');
        } else {
            this.activatedPromocodes = [];
        }

        this.totalSumWithDiscount = this.checkTotalSumWithDiscountInLocalStorage();

        this.enteredPromocodes = this.setEnteredPromocodesAfterReload();
    }

    private checkTotalSumInLocalStorage(): number {
        const totalSumInLocalStorage = window.localStorage.getItem(LOCAL_STORAGE_TOTALSUM);
        if (totalSumInLocalStorage) {
            this.totalSum = Number(totalSumInLocalStorage);
        } else {
            this.totalSum = 0;
        }
        return this.totalSum;
    }

    private checkTotalSumWithDiscountInLocalStorage(): number {
        const totalSumWithDiscountInLocalStorage = window.localStorage.getItem(LOCAL_STORAGE_TOTAL_SUM_WITH_DISCOUNT);
        if (totalSumWithDiscountInLocalStorage) {
            this.totalSumWithDiscount = Number(totalSumWithDiscountInLocalStorage);
        } else {
            this.totalSumWithDiscount = this.totalSum;
        }
        return this.totalSumWithDiscount;
    }

    private checkProductQuantityInLocalStorage(): number {
        const productQuantityInLocalStorage = localStorage.getItem(LOCAL_STORAGE_PRODUCTSQUANTITY);
        if (productQuantityInLocalStorage) {
            this.productsQuantity = Number(productQuantityInLocalStorage);
        } else {
            this.productsQuantity = 0;
        }
        return this.productsQuantity;
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
                //this.appController.cartView.totalPerProduct = 0;
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
        const idProductInCart = this.productsInCart.find((product) => product.id === id);
        if (idProductInCart) {
            return this.productsInCart.includes(idProductInCart);
        } else {
            return false;
        }
    }

    public findEnteredPromoInPromocodes(enteredValue: string): void {
        this.promocodes.forEach((promocode) => {
            if (enteredValue.toLocaleUpperCase() === promocode.value) {
                if (!this.enteredPromocodes.find((enteredPromocode) => enteredPromocode.id === promocode.id)) {
                    this.enteredPromocodes.push(promocode);
                    this.appController.cartView.createPromoCodeView(promocode);
                }
            }
        });
    }

    public handleAddPromocode(promocode: Promocode): void {
        if (this.productsInCart.length !== 0) {
            if (!this.activatedPromocodes.find((activatedPromocode) => activatedPromocode.id === promocode.id)) {
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
            this.activatedPromocodes.forEach((activatedPromocode) => {
                currentTotalPercentDiscount += activatedPromocode.discount;
            });
        }
        return currentTotalPercentDiscount;
    }

    private setEnteredPromocodesAfterReload(): Promocode[] {
        if (this.activatedPromocodes.length !== 0) {
            this.enteredPromocodes = this.activatedPromocodes.slice();
        } else {
            this.enteredPromocodes = [];
        }
        return this.enteredPromocodes;
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
