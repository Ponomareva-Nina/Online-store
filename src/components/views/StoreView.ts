import { HTMLTags, PossibleUrlParams } from '../../types/types';
import { createElem, createRadioButton } from '../../utils/utils';
import { NO_PRODUCTS_MESSAGE, STORE_VIEW_TITLE } from '../../constants/string-constants';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';
import { Props, ViewComponent } from '../../types/interfaces';
import { ClassNames } from '../../constants/classnames-constants';
import {
    SEARCH_INPUT_PLACEHOLDER,
    SORT_BY_DISCOUNT,
    SORT_BY_MAX_PRICE,
    SORT_BY_MIN_PRICE,
} from '../../constants/string-constants';

export default class StoreView implements ViewComponent {
    public container: DocumentFragment;
    public appController: AppController;
    private storeModel: StoreModel;
    private currentParams: Props | null;
    pageWrapper: HTMLDivElement;

    constructor(model: StoreModel, controller: AppController) {
        this.appController = controller;
        this.storeModel = model;
        this.container = document.createDocumentFragment();
        this.pageWrapper = createElem(HTMLTags.SECTION, ClassNames.STORE_CONTAINER) as HTMLDivElement;
        this.currentParams = null;
    }

    private createProductCards() {
        const productCardsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARDS_CONTAINER, '');
        const currentProducts = this.storeModel.getCurrentProducts();
        if (currentProducts.length === 0) {
            const noProductsMessage = createElem(HTMLTags.P, '', NO_PRODUCTS_MESSAGE);
            productCardsContainer.append(noProductsMessage);
        } else {
            currentProducts.forEach((product) => {
                const card = new ProductCard(product, this.appController);
                const cardView = card.createBriefCard();
                productCardsContainer.append(cardView);
            });
        }
        return productCardsContainer;
    }

    private createSidePanel() {
        const sidePanelContainer = createElem(HTMLTags.DIV, ClassNames.SIDE_PANEL) as HTMLDivElement;
        const searchInput = this.createSearchInput();
        const sorts = this.createSorts();
        sidePanelContainer.append(searchInput, sorts);
        return sidePanelContainer;
    }

    private createSorts() {
        const sortContainer = createElem(HTMLTags.DIV, ClassNames.SORT_CONTAINER);
        const radioBtnsName = 'sort';
        const sortByMinPrice = createRadioButton(radioBtnsName, ClassNames.SORT_RADIO, SORT_BY_MIN_PRICE);
        const sortByMaxPrice = createRadioButton(radioBtnsName, ClassNames.SORT_RADIO, SORT_BY_MAX_PRICE);
        const sortByDiscount = createRadioButton(radioBtnsName, ClassNames.SORT_RADIO, SORT_BY_DISCOUNT);
        sortContainer.append(sortByMinPrice, sortByMaxPrice, sortByDiscount);
        return sortContainer;
    }

    private createSearchInput() {
        const componentContainer = createElem(HTMLTags.DIV, ClassNames.SEARCH_INPUT_CONTAINER);
        const inputEl = createElem(HTMLTags.INPUT, ClassNames.SEARCH_INPUT) as HTMLInputElement;
        inputEl.setAttribute('type', 'text');
        inputEl.setAttribute('id', 'search');
        inputEl.setAttribute('placeholder', SEARCH_INPUT_PLACEHOLDER);
        const inputLabel = createElem(HTMLTags.LABEL, ClassNames.SEARCH_INPUT_LABEL);
        inputLabel.setAttribute('for', 'search');

        if (this.currentParams && this.currentParams[PossibleUrlParams.SEARCH]) {
            const searchValue = this.currentParams[PossibleUrlParams.SEARCH].join(' ');
            inputEl.value = searchValue;
            this.storeModel.filterCardsByKeyword(searchValue);
        }
        inputEl.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const value = target.value.toLowerCase();
            this.handleSearchInput(value);
        });
        componentContainer.append(inputLabel, inputEl);
        return componentContainer;
    }

    private handleSearchInput(value: string) {
        this.storeModel.filterCardsByKeyword(value);
        this.appController.router.addParameterToUrl(PossibleUrlParams.SEARCH, value);
    }

    private createPage() {
        this.appController.destroyAllChildNodes(this.pageWrapper);
        const pageHeader = createElem(HTMLTags.PAGE_HEADER, ClassNames.PAGE_HEADER, STORE_VIEW_TITLE);
        const sidePanel = this.createSidePanel();
        const cards = this.createProductCards();
        this.pageWrapper.append(pageHeader, sidePanel, cards);
        this.container.append(this.pageWrapper);
    }

    public render(params?: Props) {
        this.storeModel.restoreCurrentProducts();
        if (params) {
            this.currentParams = params;
        }
        this.createPage();
        return this.container;
    }
}
