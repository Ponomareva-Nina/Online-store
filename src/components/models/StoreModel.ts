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

    getProductById(id: number) {
        return this.products.find((product) => product.id === id);
    }

    getCurrentProducts() {
        return this.currentProducts;
    }
}
