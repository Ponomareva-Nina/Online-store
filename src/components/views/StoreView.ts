import {
    CategoryFiltersOptions,
    FacultyFiltersOptions,
    HTMLTags,
    PossibleUrlParams,
    PossibleViewValues,
    SortLabels,
    SortOptions,
} from '../../types/types';
import { createCheckbox, createElem, createLabel, createRadioButton, createRange } from '../../utils/utils';
import { NO_PRODUCTS_MESSAGE, RESET_BTN_TEXT, STORE_VIEW_TITLE } from '../../constants/string-constants';
import AppController from '../app/app';
import StoreModel from '../models/StoreModel';
import ProductCard from './ProductCard';
import { Props, ViewComponent } from '../../types/interfaces';
import { ClassNames } from '../../constants/classnames-constants';
import { SEARCH_INPUT_PLACEHOLDER } from '../../constants/string-constants';

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
        if (this.currentParams && this.currentParams[PossibleUrlParams.VIEW]) {
            if (this.currentParams[PossibleUrlParams.VIEW].join('') === PossibleViewValues.LIST) {
                productCardsContainer.classList.add(ClassNames.CARD_VIEW_LIST);
            }
        }
        return productCardsContainer;
    }

    private createSidePanel() {
        const sidePanelContainer = createElem(HTMLTags.DIV, ClassNames.SIDE_PANEL) as HTMLDivElement;
        const searchInput = this.createSearchInput();
        const resetAllBtn = this.createResetFiltersBtn();
        const sorts = this.createSorts();
        const facultyFilters = this.createFacultyFilters();
        const categoryFilters = this.createCategoryFilters();
        const priceSlider = this.createPriceDualSlider();
        const stockSlider = this.createStockDualSlider();
        const copyLinkBtn = this.createCopyLinkBtn();
        const openCloseBtn = createElem(HTMLTags.BUTTON, 'side-panel-toggle-btn', 'Show filters');
        openCloseBtn.addEventListener('click', () => {
            if (sidePanelContainer.classList.contains('side-panel_open')) {
                sidePanelContainer.classList.remove('side-panel_open');
                openCloseBtn.textContent = 'Show filters';
            } else {
                sidePanelContainer.classList.add('side-panel_open');
                openCloseBtn.textContent = 'Hide filters';
            }
        });
        const changeViewBtns = this.createChangeCardsViewBtns();
        sidePanelContainer.append(
            openCloseBtn,
            searchInput,
            copyLinkBtn,
            changeViewBtns,
            resetAllBtn,
            sorts,
            facultyFilters,
            categoryFilters,
            priceSlider,
            stockSlider
        );
        return sidePanelContainer;
    }

    private createCopyLinkBtn() {
        const container = createElem(HTMLTags.DIV, ClassNames.FILTER_BTNS_CONTAINER);
        const copyLinkBtn = createElem(HTMLTags.BUTTON, 'side-panel-btn copy-link-btn', 'Copy link');
        copyLinkBtn.addEventListener('click', () => {
            const path = window.location.href;
            navigator.clipboard.writeText(path).then(function () {
                copyLinkBtn.classList.add('disabled');
                copyLinkBtn.textContent = 'Link copied';
            });
        });
        container.append(copyLinkBtn);
        return container;
    }

    private createResetFiltersBtn() {
        const container = createElem(HTMLTags.DIV, ClassNames.FILTER_BTNS_CONTAINER);

        const radioNameIdValue = 'reset';
        const showAllButton = createRadioButton(
            radioNameIdValue,
            ClassNames.FILTER_CHECKBOX,
            radioNameIdValue,
            radioNameIdValue
        );
        const showAllLabel = createLabel(radioNameIdValue, ClassNames.FILTER_LABEL, RESET_BTN_TEXT);

        if (
            this.currentParams &&
            !Object.keys(this.currentParams).includes(PossibleUrlParams.CATEGORY) &&
            !Object.keys(this.currentParams).includes(PossibleUrlParams.FACULTY) &&
            !Object.keys(this.currentParams).includes(PossibleUrlParams.PRICE) &&
            !Object.keys(this.currentParams).includes(PossibleUrlParams.STOCK)
        ) {
            showAllButton.checked = true;
        }

        showAllButton.addEventListener('click', () => {
            if (showAllButton.checked) {
                this.appController.router.clearAllFilters();
            }
        });
        container.append(showAllButton, showAllLabel);
        return container;
    }

    private createPriceDualSlider() {
        const priceSliderContainer = createElem(HTMLTags.DIV, ClassNames.DUAL_SLIDER_CONTAINER);
        const priceSliderTitle = createElem(HTMLTags.P, ClassNames.DUAL_SLIDER_TITLE, 'Price');
        const RangeInputContainer = createElem(HTMLTags.DIV, ClassNames.CUSTOM_RANGE_INPUT_CONTAINER);
        const allProductsMinPrice = this.storeModel.absoluteMinPrice.toString();
        const allProductsMaxPrice = this.storeModel.absoluteMaxPrice.toString();
        const [minPrice, maxPrice] = this.currentParams?.price || [
            Math.floor(this.storeModel.getCurrentMinPrice()).toString(),
            Math.ceil(this.storeModel.getCurrentMaxPrice()).toString(),
        ];
        const inputMin = createRange(allProductsMinPrice, allProductsMaxPrice, minPrice, ClassNames.DUAL_SLIDER_INPUT);
        const inputMax = createRange(allProductsMinPrice, allProductsMaxPrice, maxPrice, ClassNames.DUAL_SLIDER_INPUT);
        inputMin.addEventListener('change', () => {
            this.handlePriceDualSlider(inputMin, inputMax);
        });
        inputMax.addEventListener('change', () => {
            this.handlePriceDualSlider(inputMin, inputMax);
        });
        RangeInputContainer.append(inputMin, inputMax);

        const valuesContainer = createElem(HTMLTags.DIV, ClassNames.DUAL_SLIDER_VALUES);
        const minValue = createElem(HTMLTags.SPAN, ClassNames.DUAL_SLIDER_VALUE_FIELD, `$ ${minPrice}`);
        const maxValue = createElem(HTMLTags.SPAN, ClassNames.DUAL_SLIDER_VALUE_FIELD, `$ ${maxPrice}`);
        valuesContainer.append(minValue, maxValue);
        priceSliderContainer.append(priceSliderTitle, RangeInputContainer, valuesContainer);
        return priceSliderContainer;
    }

    private createStockDualSlider() {
        const stockSliderContainer = createElem(HTMLTags.DIV, ClassNames.DUAL_SLIDER_CONTAINER);
        const stockSliderTitle = createElem(HTMLTags.P, ClassNames.DUAL_SLIDER_TITLE, 'Stock');
        const RangeInputContainer = createElem(HTMLTags.DIV, ClassNames.CUSTOM_RANGE_INPUT_CONTAINER);
        const allProductsMinStock = this.storeModel.absoluteMinStock.toString();
        const allProductsMaxStock = this.storeModel.absoluteMaxStock.toString();
        const [minStock, maxStock] = this.currentParams?.stock || [
            Math.floor(this.storeModel.getCurrentMinStock()).toString(),
            Math.ceil(this.storeModel.getCurrentMaxStock()).toString(),
        ];
        const inputMin = createRange(allProductsMinStock, allProductsMaxStock, minStock, ClassNames.DUAL_SLIDER_INPUT);
        const inputMax = createRange(allProductsMinStock, allProductsMaxStock, maxStock, ClassNames.DUAL_SLIDER_INPUT);
        inputMin.addEventListener('change', () => {
            this.handleStockDualSlider(inputMin, inputMax);
        });
        inputMax.addEventListener('change', () => {
            this.handleStockDualSlider(inputMin, inputMax);
        });
        RangeInputContainer.append(inputMin, inputMax);

        const valuesContainer = createElem(HTMLTags.DIV, ClassNames.DUAL_SLIDER_VALUES);
        const minValue = createElem(HTMLTags.SPAN, ClassNames.DUAL_SLIDER_VALUE_FIELD, `${minStock}`);
        const maxValue = createElem(HTMLTags.SPAN, ClassNames.DUAL_SLIDER_VALUE_FIELD, `${maxStock}`);
        valuesContainer.append(minValue, maxValue);
        stockSliderContainer.append(stockSliderTitle, RangeInputContainer, valuesContainer);
        return stockSliderContainer;
    }

    private handlePriceDualSlider(inputMin: HTMLInputElement, inputMax: HTMLInputElement) {
        if (Number(inputMin.value) > Number(inputMax.value)) {
            this.appController.router.addPriceRangeToUrl(inputMax.value, inputMin.value);
        } else {
            this.appController.router.addPriceRangeToUrl(inputMin.value, inputMax.value);
        }
    }

    private handleStockDualSlider(inputMin: HTMLInputElement, inputMax: HTMLInputElement) {
        if (Number(inputMin.value) > Number(inputMax.value)) {
            this.appController.router.addStockRangeToUrl(inputMax.value, inputMin.value);
        } else {
            this.appController.router.addStockRangeToUrl(inputMin.value, inputMax.value);
        }
    }

    private createCategoryFilters() {
        const filterContainer = createElem(HTMLTags.DIV, `${ClassNames.FILTER_CONTAINER} category-filters`);
        const FilterByCategoryTitle = createElem(HTMLTags.P, ClassNames.FILTER_CONTAINER_TITLE, 'Choose category');
        filterContainer.append(FilterByCategoryTitle);
        const checkboxName = 'faculty-filter';
        Object.keys(CategoryFiltersOptions).forEach((key) => {
            const value = CategoryFiltersOptions[key as keyof typeof CategoryFiltersOptions];
            const checkbox = createCheckbox(checkboxName, ClassNames.FILTER_CHECKBOX, value, value);
            checkbox.addEventListener('click', () => {
                this.handleCategoryFilter(checkbox);
            });
            const label = createLabel(value, ClassNames.FILTER_LABEL, value);
            if (this.currentParams && this.currentParams[PossibleUrlParams.CATEGORY]) {
                const checkedFaculties = this.currentParams[PossibleUrlParams.CATEGORY];
                if (checkedFaculties.includes(value)) {
                    checkbox.checked = true;
                }
            }
            filterContainer.append(checkbox, label);
        });
        return filterContainer;
    }

    private handleCategoryFilter(checkbox: HTMLInputElement) {
        if (checkbox.checked) {
            this.appController.router.addParameterToUrl(PossibleUrlParams.CATEGORY, checkbox.value);
        } else {
            this.appController.router.deleteParameterFromUrl(PossibleUrlParams.CATEGORY, checkbox.value);
        }
    }

    private createFacultyFilters() {
        const filterContainer = createElem(HTMLTags.DIV, ClassNames.FILTER_CONTAINER);
        const FilterByFacultyTitle = createElem(HTMLTags.P, ClassNames.FILTER_CONTAINER_TITLE, 'Choose faculty');
        filterContainer.append(FilterByFacultyTitle);
        const checkboxName = 'faculty-filter';
        Object.keys(FacultyFiltersOptions).forEach((key) => {
            const value = FacultyFiltersOptions[key as keyof typeof FacultyFiltersOptions];
            const checkbox = createCheckbox(checkboxName, ClassNames.FILTER_CHECKBOX, value, value);
            checkbox.addEventListener('click', () => {
                this.handleFacultyFilter(checkbox);
            });
            const label = createLabel(value, ClassNames.FILTER_LABEL, value);
            if (this.currentParams && this.currentParams[PossibleUrlParams.FACULTY]) {
                const checkedFaculties = this.currentParams[PossibleUrlParams.FACULTY];
                if (checkedFaculties.includes(value)) {
                    checkbox.checked = true;
                }
            }
            filterContainer.append(checkbox, label);
        });
        return filterContainer;
    }

    private handleFacultyFilter(checkbox: HTMLInputElement) {
        if (checkbox.checked) {
            this.appController.router.addParameterToUrl(PossibleUrlParams.FACULTY, checkbox.value);
        } else {
            this.appController.router.deleteParameterFromUrl(PossibleUrlParams.FACULTY, checkbox.value);
        }
    }

    private createSorts() {
        const sortContainer = createElem(HTMLTags.DIV, ClassNames.SORT_CONTAINER);
        const sortTitle = createElem(HTMLTags.P, 'sort-container__title', 'Sort by');
        sortContainer.append(sortTitle);
        const radioBtnsName = 'sort';
        Object.keys(SortOptions).forEach((key) => {
            const value = SortOptions[key as keyof typeof SortOptions];
            const radioBtn = createRadioButton(radioBtnsName, ClassNames.SORT_RADIO, value, value);
            radioBtn.addEventListener('click', () => {
                this.handleSort(radioBtn);
            });
            const label = createLabel(value, ClassNames.SORT_LABEL, SortLabels[key as keyof typeof SortLabels]);
            if (
                this.currentParams &&
                this.currentParams[PossibleUrlParams.SORT] &&
                this.currentParams[PossibleUrlParams.SORT].join('') === value
            ) {
                radioBtn.checked = true;
            }
            sortContainer.append(radioBtn, label);
        });
        return sortContainer;
    }

    private handleSort(elem: HTMLInputElement) {
        if (elem.checked) {
            this.appController.router.addParameterToUrl(PossibleUrlParams.SORT, elem.value);
        }
    }

    private createChangeCardsViewBtns() {
        const componentContainer = createElem(HTMLTags.DIV, ClassNames.CARD_VIEW_CONTAINER);
        const tileBtn = createElem(HTMLTags.BUTTON, `${ClassNames.CHANGE_CARD_VIEW_BTN} ${ClassNames.TILE_VIEW_BTN}`);
        const listBtn = createElem(HTMLTags.BUTTON, `${ClassNames.CHANGE_CARD_VIEW_BTN} ${ClassNames.LIST_VIEW_BTN}`);

        if (this.currentParams && this.currentParams[PossibleUrlParams.VIEW]) {
            if (this.currentParams[PossibleUrlParams.VIEW].join('') === PossibleViewValues.LIST) {
                listBtn.classList.add(ClassNames.LIST_VIEW_BTN_ACTIVE);
            } else {
                tileBtn.classList.add(ClassNames.TILE_VIEW_BTN_ACTIVE);
            }
        } else {
            tileBtn.classList.add(ClassNames.TILE_VIEW_BTN_ACTIVE);
        }

        tileBtn.addEventListener('click', () => {
            this.appController.router.addParameterToUrl(PossibleUrlParams.VIEW, PossibleViewValues.TILE);
        });
        listBtn.addEventListener('click', () => {
            this.appController.router.addParameterToUrl(PossibleUrlParams.VIEW, PossibleViewValues.LIST);
        });
        componentContainer.append(tileBtn, listBtn);
        return componentContainer;
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
        if (params) {
            this.currentParams = params;
            this.storeModel.handleParams(params);
        }
        this.createPage();
        return this.container;
    }
}
