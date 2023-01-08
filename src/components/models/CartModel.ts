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

    constructor(controller: AppController) {
        this.appController = controller;
        this.promocodes = promos.promocodes;
        this.enteredPromocodes = [];
        this.activatedPromocodes = [];

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

        // if (localStorage.getItem('activatedPromocodes')) {
        //     this.activatedPromocodes = JSON.parse(localStorage.getItem('activatedPromocodes') || '{}');
        // } else {
        //     this.activatedPromocodes = [];
        // }
    }

    addProduct(product: Product) {
        //добавляет полученный из каталога объект в массив this.productsInCart. с товарами корзины
        const isInCart = this.checkProductInCart(product.id);
        if (!isInCart) {
            this.productsInCart.push(product);
            product.inCart = 1;
            product.sum = product.price;
            this.productsQuantity += product.inCart;
            this.totalSum = Number((this.totalSum += product.inCart * product.price).toFixed(2));
            this.appController.addProductToCart(product);
            return this.productsInCart;
        }
    }

    deleteProduct(product: Product) {
        //удаляет полученный объект из массива this.productsInCart. с товарами корзины
        const isInCart = this.checkProductInCart(product.id);
        if (isInCart) {
            const deletedIndex = this.productsInCart.indexOf(product);
            this.productsInCart.splice(deletedIndex, 1);
            if (product.inCart) {
                this.productsQuantity -= product.inCart;
                this.totalSum = Number((this.totalSum -= product.inCart * product.price).toFixed(2));
                this.appController.cartView.totalPerProduct = 0;
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
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.updatePage();
        }
    }

    public deleteOneProduct(product: Product) {
        if (product.inCart === 1) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = product.price;
            this.deleteProduct(product);
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePage();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.checkCartIsEmpty();
        }

        if (product.inCart && product.sum && product.inCart >= 2) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = Number((product.sum -= product.price).toFixed(2));
            this.appController.cartView.updateCartInfo();
            this.appController.cartView.updatePromoBlock();
            this.appController.cartView.updatePage();
            this.appController.cartView.updatePromoBlock();
        }
    }

    public checkProductInCart(id: number) {
        //метод проверяет по id есть ли такой товар в корзине и возвращает true или false
        //(необходим для присвоения корректного класса кнопкам добавить в корзину
        //(на странице товара и на странице каталога) после перезагрузки страницы)
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
}
