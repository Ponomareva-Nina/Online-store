import { Product } from '../../types/interfaces';
import AppController from '../app/app';

export default class CartModel {
    appController: AppController;
    productsInCart: Product[];
    totalSum: number;
    productsQuantity: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.totalSum = 0;
        this.productsQuantity = 0;

        if (localStorage.getItem('cart')) {
            this.productsInCart = JSON.parse(localStorage.getItem('cart') || '{}');
        } else {
            this.productsInCart = [];
        }
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
            // console.log(
            //     `Товар добавлен в количестве . Обновленная корзина (${this.productsQuantity} товаров): `,
            //     this.productsInCart
            // );
            // console.log(
            //     `Добавлено ${product.inCart} шт выбранного товра. Общая сумма увеличилась на ${
            //         product.inCart * product.price
            //     } и стала ${this.totalSum}`
            // );
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
                this.totalSum -= product.inCart * product.price;
                this.appController.cartView.totalPerProduct = 0;
                // console.log(
                //     `Удалено ${product.inCart} шт выбранного товра. Общая сумма уменьшилась на ${
                //         product.inCart * product.price
                //     } и стала ${this.totalSum}`
                // );
            }
            // console.log('Товар удален. Обновленная корзина: ', this.productsQuantity);
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
            this.appController.updatePage(this.appController.cartView); //
            // console.log(this.totalSum, this.productsQuantity, this.productsInCart);
        } else {
            // console.log(`Выбрано максимальное количество товара`);
        }
    }

    public deleteOneProduct(product: Product) {
        if (product.inCart === 1) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = product.price;
            // console.log('Этот товар удален полностью');
            this.deleteProduct(product);
            this.appController.cartView.updateCartInfo();
            this.appController.updatePage(this.appController.cartView); //
            this.appController.cartView.checkCartIsEmpty();
        }

        if (product.inCart && product.sum && product.inCart >= 2) {
            product.inCart -= 1;
            this.productsQuantity -= 1;
            this.totalSum = Number((this.totalSum -= product.price).toFixed(2));
            product.sum = Number((product.sum -= product.price).toFixed(2));
            this.appController.cartView.updateCartInfo();
            this.appController.updatePage(this.appController.cartView); //
            // console.log(this.totalSum, this.productsQuantity, this.productsInCart);
        }
    }

    checkProductInCart(id: number) {
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
}
