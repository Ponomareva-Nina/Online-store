import data from '../../products.json';
import { Product } from '../../types/interfaces';
import AppController from '../app/app';

export default class StoreView {
    appController: AppController;
    products: Product[];

    constructor(controller: AppController) {
        this.appController = controller;
        this.products = data.products;
    }
}
