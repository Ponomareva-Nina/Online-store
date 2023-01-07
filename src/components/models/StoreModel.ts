import data from '../../products.json';
import { Product } from '../../types/interfaces';
import AppController from '../app/app';

export default class StoreModel {
    public appController: AppController;
    private products: Product[];
    public currentProducts: Product[];

    constructor(controller: AppController) {
        this.appController = controller;
        this.products = data.products;
        this.currentProducts = data.products;
    }

    public getProductById(id: number) {
        return this.products.find((product) => product.id === id);
    }

    public getCurrentProducts() {
        return this.currentProducts;
    }

    public restoreCurrentProducts() {
        this.currentProducts = this.products;
    }

    public filterCardsByKeyword(value: string) {
        const newCurrentProducts: Array<Product> = [];

        this.currentProducts.forEach((product) => {
            if (
                product.category.toLowerCase().includes(value) ||
                product.description.toLowerCase().includes(value) ||
                product.title.toLowerCase().includes(value) ||
                product.faculty.toLowerCase().includes(value) ||
                product.price.toString() === value ||
                product.discount.toString() === value
            ) {
                newCurrentProducts.push(product);
            }
        });
        this.currentProducts = newCurrentProducts;
    }
}
