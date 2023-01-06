import { Product } from '../../types/interfaces';
import AppController from '../app/app';

export default class CartModel {
    appController: AppController;
    productsInCart: Product[];

    constructor(controller: AppController) {
        this.appController = controller;
        //this.productsInCart = []; //массив товаров в корзине. при инициализации проверяется localStorage или создается пустой

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
            //console.log('товара нет в корзине. Добавляем...');
            this.productsInCart.push(product);
            product.inCart = 1;
            this.appController.cartView.productsQuantity += product.inCart;
            this.appController.cartView.totalSum = Math.round(
                (this.appController.cartView.totalSum += product.inCart * product.price)
            );
            this.appController.addProductToCart(product);
            console.log(
                `Товар добавлен в количестве . Обновленная корзина (${this.appController.cartView.productsQuantity} товаров): `,
                this.productsInCart
            );
            console.log(
                `Добавлено ${product.inCart} шт выбранного товра. Общая сумма увеличилась на ${
                    product.inCart * product.price
                } и стала ${this.appController.cartView.totalSum}`
            );
            return this.productsInCart;
        } else {
            //console.log('Товар уже есть в корзине. Корзина ', this.productsInCart);
        }
    }

    deleteProduct(product: Product) {
        //удаляет полученный объект из массива this.productsInCart. с товарами корзины
        const isInCart = this.checkProductInCart(product.id);
        if (isInCart) {
            //console.log('товара найден в корзине. Удаляем...');
            const deletedIndex = this.productsInCart.indexOf(product);
            this.productsInCart.splice(deletedIndex, 1);
            if (product.inCart) {
                this.appController.cartView.productsQuantity -= product.inCart;
                this.appController.cartView.totalSum = Math.round(
                    (this.appController.cartView.totalSum -= product.inCart * product.price)
                );
                console.log(
                    `Удалено ${product.inCart} шт выбранного товра. Общая сумма уменьшилась на ${
                        product.inCart * product.price
                    } и стала ${this.appController.cartView.totalSum}`
                );
            }

            product.inCart = 0;

            console.log('Товар удален. Обновленная корзина: ', this.appController.cartView.productsQuantity);
            return this.productsInCart;
        } else {
            //console.log('Этот товар не найден в корзине');
        }
    }

    checkProductInCart(id: number) {
        //метод проверяет по id есть ли такой товар в корзине и возвращает true или false
        //(необходим для присвоения корректного класса кнопкам добавить в корзину
        //(на странице товара и на странице каталога) после перезагрузки страницы)
        //console.log(id);
        const idProductInCart = this.productsInCart.find((product) => product.id === id);
        if (idProductInCart) {
            //console.log(idProductInCart, this.productsInCart.includes(idProductInCart));
            return this.productsInCart.includes(idProductInCart);
        } else {
            return false;
        }
    }
}
