import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import { STORE_VIEW_TITLE } from '../../constants/string-constants';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';
import { ViewComponent } from '../../types/interfaces';
import FiltersPanel from './FiltersPanel';
import { ClassNames } from '../../constants/classnames-constants';

export default class StoreView implements ViewComponent {
    public container: DocumentFragment;
    public appController: AppController;
    private storeModel: StoreModel;
    private productCardsContainer: HTMLDivElement;
    private pageHeader: HTMLElement;
    private filtersSidePanel: FiltersPanel;
    private sidePanelContainer: HTMLDivElement;
    private storeContainer: HTMLElement;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.productCardsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARDS_CONTAINER, '') as HTMLDivElement;
        this.pageHeader = createElem(HTMLTags.PAGE_HEADER, ClassNames.PAGE_HEADER, STORE_VIEW_TITLE);
        this.filtersSidePanel = new FiltersPanel();
        this.sidePanelContainer = createElem(HTMLTags.DIV, ClassNames.SIDE_PANEL) as HTMLDivElement;
        this.storeContainer = createElem(HTMLTags.SECTION, ClassNames.STORE_CONTAINER);
    }

    private renderProductCards() {
        const currentProducts = this.storeModel.getCurrentProducts();
        currentProducts.forEach((product) => {
            const card = new ProductCard(product, this.appController);
            const cardView = card.createBriefCard();
            this.productCardsContainer.appendChild(cardView);
        });
    }

    private createSidePanel() {
        const searchInput = this.filtersSidePanel.createSearchInput();
        this.sidePanelContainer.append(searchInput);
    }

    private createPage() {
        if (this.storeContainer.childNodes.length === 0) {
            this.renderProductCards();
            this.createSidePanel();
        }
        this.storeContainer.append(this.sidePanelContainer, this.productCardsContainer);
        this.container.append(this.pageHeader, this.storeContainer);
    }

    public render() {
        this.createPage();
        return this.container;
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
