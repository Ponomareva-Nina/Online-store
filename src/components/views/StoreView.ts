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
    private filtersSidePanel: FiltersPanel;
    private sidePanelContainer: HTMLDivElement;
    private currentParams: Props | null;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.filtersSidePanel = new FiltersPanel();
        this.productCardsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARDS_CONTAINER, '') as HTMLDivElement;
        this.sidePanelContainer = createElem(HTMLTags.DIV, ClassNames.SIDE_PANEL) as HTMLDivElement;
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
    }

    private createPage() {
        const storeContainer = createElem(HTMLTags.SECTION, ClassNames.STORE_CONTAINER);
        const pageHeader = createElem(HTMLTags.PAGE_HEADER, ClassNames.PAGE_HEADER, STORE_VIEW_TITLE);
        this.destroyAllChildNodes(this.sidePanelContainer);
        this.destroyAllChildNodes(this.productCardsContainer);
        this.createSearchInput();
        this.renderProductCards();
        storeContainer.append(this.sidePanelContainer, this.productCardsContainer);
        this.container.append(pageHeader, storeContainer);
        console.log('create page вызывался');
    }

    public render(params?: Props) {
        this.storeModel.restoreCurrentProducts();
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
