import { Product, Promocode } from '../../types/interfaces';
import AppController from '../app/app';
import promos from '../../promocodes.json';

export default class CartModel {
    appController: AppController;
    productsInCart: Product[];
    totalSum: number;
    productsQuantity: number;
    promocodes: Promocode[];
    enteredPromocodes: Promocode[];
    activatedPromocodes: Promocode[];
    totalSumWithDiscount: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.promocodes = promos.promocodes;
        this.enteredPromocodes = [];

        if (window.localStorage.getItem('totalSum')) {
            this.totalSum = Number(localStorage.getItem('totalSum'));
        } else {
            this.totalSum = 0;
        }

        if (localStorage.getItem('productsQuantity')) {
            this.productsQuantity = Number(localStorage.getItem('productsQuantity'));
        } else {
            this.productsQuantity = 0;
        }

        if (localStorage.getItem('cart')) {
            this.productsInCart = JSON.parse(localStorage.getItem('cart') || '{}');
        } else {
            this.productsInCart = [];
        }

        if (localStorage.getItem('activatedPromocodes')) {
            this.activatedPromocodes = JSON.parse(localStorage.getItem('activatedPromocodes') || '{}');
        } else {
            this.activatedPromocodes = [];
        }

        if (window.localStorage.getItem('totalSumWithDiscount')) {
            this.totalSumWithDiscount = Number(localStorage.getItem('totalSumWithDiscount'));
        } else {
            this.totalSumWithDiscount = this.totalSum;
        }
    }

    addProduct(product: Product) {
        const isInCart = this.checkProductInCart(product.id);
        if (!isInCart) {
            this.productsInCart.push(product);
            product.inCart = 1;
            product.sum = product.price;
            this.productsQuantity += product.inCart;
            this.totalSum = Number((this.totalSum += product.inCart * product.price).toFixed(2));
            this.appController.addProductToCart(product);
            const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
            this.totalSumWithDiscount = Number((this.totalSum * (1 - currentTotalPercentDiscount / 100)).toFixed(2));
            this.appController.cartView.updateDiscountInfo();
            return this.productsInCart;
        }
    }

    deleteProduct(product: Product) {
        const isInCart = this.checkProductInCart(product.id);
        if (isInCart) {
            const deletedIndex = this.productsInCart.indexOf(product);
            this.productsInCart.splice(deletedIndex, 1);
            if (product.inCart) {
                this.productsQuantity -= product.inCart;
                this.totalSum = Number((this.totalSum -= product.inCart * product.price).toFixed(2));
                this.appController.cartView.totalPerProduct = 0;
                const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
                this.totalSumWithDiscount = Number(
                    (this.totalSum * (1 - currentTotalPercentDiscount / 100)).toFixed(2)
                );
                this.appController.cartView.updateDiscountInfo();
            }
        }
        return this.productsInCart;
    }

    public addOneProduct(product: Product) {
        if (product.inCart && product.sum && product.inCart < product.quantity) {
            product.inCart += 1;
            this.productsQuantity += 1;
            this.totalSum = Number((this.totalSum += product.price).toFixed(2));
            product.sum = Number((product.sum += product.price).toFixed(2));
            const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
            this.totalSumWithDiscount = Number((this.totalSum * (1 - currentTotalPercentDiscount / 100)).toFixed(2));
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.updatePage();
            this.appController.cartView.updateDiscountInfo();
        }
    }

    public deleteOneProduct(product: Product) {
        if (product.inCart === 1) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = product.price;
            const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
            this.totalSumWithDiscount = Number((this.totalSum * (1 + currentTotalPercentDiscount / 100)).toFixed(2));
            this.deleteProduct(product);
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePage();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.checkCartIsEmpty();
            this.appController.cartView.updateDiscountInfo();
        }

        if (product.inCart && product.sum && product.inCart >= 2) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = Number((product.sum -= product.price).toFixed(2));
            const currentTotalPercentDiscount = this.getCurrentTotalPercentDiscount();
            this.totalSumWithDiscount = Number((this.totalSum * (1 + currentTotalPercentDiscount / 100)).toFixed(2));
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.updatePage();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.updateDiscountInfo();
        }
    }

    public checkProductInCart(id: number) {
        const idProductInCart = this.productsInCart.find((product) => product.id === id);
        if (idProductInCart) {
            return this.productsInCart.includes(idProductInCart);
        } else {
            return false;
        }
    }

    public findEnteredPromoInPromocodes(enteredValue: string) {
        this.promocodes.forEach((promocode) => {
            if (enteredValue.toLocaleUpperCase() === promocode.value) {
                if (this.enteredPromocodes.length === 0) {
                    this.enteredPromocodes.push(promocode);
                    this.appController.cartView.createPromoCodeView(promocode);
                }

                if (!this.enteredPromocodes.find((enteredPromocode) => enteredPromocode.id === promocode.id)) {
                    this.enteredPromocodes.push(promocode);
                    this.appController.cartView.createPromoCodeView(promocode);
                }
            }
        });
    }

    public handleAddPromocode(promocode: Promocode) {
        if (this.productsInCart.length !== 0) {
            if (!this.activatedPromocodes.find((activatedPromocode) => activatedPromocode.id === promocode.id)) {
                this.activatedPromocodes.push(promocode);
                promocode.active = true;
                console.log(this.totalSumWithDiscount, this.totalSum, promocode.discount);
                this.totalSumWithDiscount = Number(
                    (this.totalSumWithDiscount -= this.totalSum * (promocode.discount / 100)).toFixed(2)
                );
                this.appController.cartView.createBlockWithDiscountSum();
            }
        }
    }

    public handleDeletePromocode(promocode: Promocode) {
        if (this.productsInCart.length !== 0) {
            const deletedPromocodeId = this.activatedPromocodes.indexOf(promocode);
            promocode.active = false;
            this.activatedPromocodes.splice(deletedPromocodeId, 1);
            this.totalSumWithDiscount = Number(
                (this.totalSumWithDiscount += this.totalSum * (promocode.discount / 100)).toFixed(2)
            );
            this.appController.cartView.createBlockWithDiscountSum();
        }
    }

    public checkIsPromocodesAplied() {
        if (this.totalSum !== this.totalSumWithDiscount) {
            return true;
        }
        return false;
    }

    private getCurrentTotalPercentDiscount() {
        let currentTotalPercentDiscount = 0;
        if (this.checkIsPromocodesAplied()) {
            this.activatedPromocodes.forEach((activatedPromocode) => {
                currentTotalPercentDiscount += activatedPromocode.discount;
            });
        }
        return currentTotalPercentDiscount;
    }
}
