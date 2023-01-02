import data from '../../products.json';
import { Product } from '../../types/interfaces';
import AppController from '../app/app';

export default class StoreModel {
    appController: AppController;
    products: Product[];
    currentProducts: Product[];

    constructor(controller: AppController) {
        this.appController = controller;
        this.products = data.products;
        this.currentProducts = data.products;
    }

    getProductById(id: number) {
        return this.products.find((product) => product.id === id);
    }
}
