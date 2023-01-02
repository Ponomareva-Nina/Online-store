import { HTMLElements } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';

export default class StoreView {
    container: DocumentFragment;
    appController: AppController;
    productCardsContainer: HTMLElement;
    storeModel: StoreModel;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.productCardsContainer = createElem(HTMLElements.SECTION, 'product-cards', '');
    }

    private renderProductCards() {
        const currentProducts = this.storeModel.getCurrentProducts();
        currentProducts.forEach((product) => {
            const card = new ProductCard(product, this.appController);
            const cardView = card.createBriefCard();
            this.productCardsContainer.append(cardView);
        });
    }

    private createPage() {
        const headerText = 'CATALOGUE';
        const headerClassName = 'page-header';
        const header = createElem(HTMLElements.PAGE_HEADER, headerClassName, headerText);
        this.renderProductCards();
        this.container.append(header, this.productCardsContainer);
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
