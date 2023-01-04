import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import { STORE_VIEW_TITLE } from '../../constants/string-constants';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';

export default class StoreView {
    container: DocumentFragment;
    appController: AppController;
    productCardsContainer: HTMLElement;
    storeModel: StoreModel;
    header: HTMLElement;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.productCardsContainer = createElem(HTMLTags.SECTION, 'product-cards', '');
        this.header = createElem(HTMLTags.PAGE_HEADER, 'page-header', STORE_VIEW_TITLE);
    }

    private renderProductCards() {
        const currentProducts = this.storeModel.getCurrentProducts();
        currentProducts.forEach((product) => {
            const card = new ProductCard(product, this.appController);
            const cardView = card.createBriefCard();
            this.productCardsContainer.appendChild(cardView);
        });
    }

    private createPage() {
        if (this.productCardsContainer.childNodes.length === 0) {
            this.renderProductCards();
        }
        this.container.append(this.header, this.productCardsContainer);
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
