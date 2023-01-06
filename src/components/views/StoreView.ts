import { HTMLTags, PossibleUrlParams } from '../../types/types';
import { createElem } from '../../utils/utils';
import { NO_PRODUCTS_MESSAGE, STORE_VIEW_TITLE } from '../../constants/string-constants';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';
import { Props, ViewComponent } from '../../types/interfaces';
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
    private currentParams: Props | null;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.productCardsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARDS_CONTAINER, '') as HTMLDivElement;
        this.pageHeader = createElem(HTMLTags.PAGE_HEADER, ClassNames.PAGE_HEADER, STORE_VIEW_TITLE);
        this.filtersSidePanel = new FiltersPanel();
        this.sidePanelContainer = createElem(HTMLTags.DIV, ClassNames.SIDE_PANEL) as HTMLDivElement;
        this.storeContainer = createElem(HTMLTags.SECTION, ClassNames.STORE_CONTAINER);
        this.currentParams = null;
    }

    private renderProductCards() {
        const currentProducts = this.storeModel.getCurrentProducts();
        if (currentProducts.length === 0) {
            const noProductsMessage = createElem(HTMLTags.P, '', NO_PRODUCTS_MESSAGE);
            this.productCardsContainer.append(noProductsMessage);
            return;
        }
        currentProducts.forEach((product) => {
            const card = new ProductCard(product, this.appController);
            const cardView = card.createBriefCard();
            this.productCardsContainer.appendChild(cardView);
        });
    }

    private createSearchInput() {
        const [searchInput, searchContainer] = this.filtersSidePanel.createSearchInput();
        if (this.currentParams && this.currentParams[PossibleUrlParams.SEARCH]) {
            const searchValue = this.currentParams[PossibleUrlParams.SEARCH].join(' ');
            (searchInput as HTMLInputElement).value = searchValue;
            this.storeModel.filterCardsByKeyword(searchValue);
        }
        this.sidePanelContainer.append(searchContainer);
        searchInput.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const value = target.value.toLowerCase();
            this.handleSearchInput(value);
        });
    }

    private handleSearchInput(value: string) {
        this.storeModel.filterCardsByKeyword(value);
        this.appController.router.addParameterToUrl(PossibleUrlParams.SEARCH, value);
        this.updateCards();
    }

    private updateCards() {
        this.destroyAllChildNodes(this.productCardsContainer);
        this.renderProductCards();
    }

    private createPage() {
        this.destroyAllChildNodes(this.productCardsContainer);
        this.destroyAllChildNodes(this.sidePanelContainer);
        this.createSearchInput();
        this.renderProductCards();
        this.storeContainer.append(this.sidePanelContainer, this.productCardsContainer);
        this.container.append(this.pageHeader, this.storeContainer);
    }

    public render(params?: Props) {
        if (params) {
            this.currentParams = params;
        }
        this.createPage();
        return this.container;
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
