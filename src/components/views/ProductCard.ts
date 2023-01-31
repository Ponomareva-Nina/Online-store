import { Product, ProductCardInterface } from '../../types/interfaces';
import { HTMLTags, NullableElement, PossibleUrlParams } from '../../types/types';
import { createElem, createImage } from '../../utils/utils';
import AppController from '../app/app';
import { trunkIconSvg } from '../../assets/svg-inline-icons/trunk-icon';
import {
    ADD_TO_CART_BUTTON_TEXT,
    AMPERSAND_SEPARATOR,
    BUY_NOW_BUTTON_TEXT,
    DELETE_FROM_CART_BUTTON_TEXT,
    DETAILS_BUTTON_TEXT,
    QUERY_SEPARATOR,
    STORE_VIEW_TITLE,
} from '../../constants/string-constants';
import { ClassNames } from '../../constants/classnames-constants';
import { LINKS } from '../../constants/route-constants';

export default class ProductCard implements ProductCardInterface {
    public cardData: Product;
    public appController: AppController;
    private activePreviewImage: NullableElement<HTMLImageElement>;

    constructor(card: Product, controller: AppController) {
        this.cardData = card;
        this.appController = controller;
        this.activePreviewImage = null;
    }

    private createBreadCrumps(): HTMLDivElement {
        const container = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.BREADCRUMPS_CONTAINER, '');
        const stepsLine = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.STEPS_LINE, '');
        const linksContainer = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.BREADCRUMPS_LINKS_CONTAINER, '');
        const initialLink = createElem<HTMLLinkElement>(HTMLTags.LINK, '', STORE_VIEW_TITLE);
        initialLink.setAttribute('href', LINKS.Store);
        initialLink.addEventListener('click', (e: MouseEvent): void => {
            this.navigateByBreadCrump(e, LINKS.Store);
        });
        const initialSeparator = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'breadcrumps-separator', '');
        const category = createElem<HTMLLinkElement>(HTMLTags.LINK, 'breadcrumps-link', this.cardData.category);
        const categoryPath = `${LINKS.Store}${QUERY_SEPARATOR}${PossibleUrlParams.CATEGORY}=${this.cardData.category}`;
        category.setAttribute('href', categoryPath);
        category.addEventListener('click', (e: MouseEvent): void => {
            this.navigateByBreadCrump(e, category.href);
        });
        const categorySeparator = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'breadcrumps-separator', '');
        const faculty = createElem<HTMLLinkElement>(HTMLTags.LINK, 'breadcrumps-link', this.cardData.faculty);
        const facultyPath = `${LINKS.Store}${QUERY_SEPARATOR}${PossibleUrlParams.CATEGORY}=${this.cardData.category}${AMPERSAND_SEPARATOR}${PossibleUrlParams.FACULTY}=${this.cardData.faculty}`;
        faculty.setAttribute('href', facultyPath);
        linksContainer.append(initialLink, initialSeparator, category, categorySeparator, faculty);
        container.append(stepsLine, linksContainer);
        return container;
    }

    private navigateByBreadCrump(e: MouseEvent, href: string): void {
        e.preventDefault();
        this.appController.router.changeCurrentPage(href);
    }

    public createFullCard(): HTMLElement {
        const container = createElem<HTMLElement>(HTMLTags.SECTION, ClassNames.FULL_CARD_CONTAINER, '');
        const infoSection = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.PRODUCT_CARD_INFO);
        const breadcrumps = this.createBreadCrumps();
        const title = this.createTitle();
        const priceContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'card_product-params-container', '');
        const priceText = `Price: $ ${this.cardData.price}`;
        const cardPrice = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.CARD_PRICE, priceText);
        const discountText = `Discount: ${this.cardData.discount} %`;
        const cardDiscount = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.CARD_DISCOUNT, discountText);
        priceContainer.append(cardPrice, cardDiscount);
        const descriptionText = this.cardData.description;
        const description = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.CARD_DESCRIPTION, descriptionText);
        const imagesSection = this.createProductImagesSection();

        const btnsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.PRODUCT_CARD_BTNS_CONTAINER);
        const buyNowBtn = createElem<HTMLButtonElement>(HTMLTags.BUTTON, ClassNames.BTN, BUY_NOW_BUTTON_TEXT);
        buyNowBtn.addEventListener('click', (): void => {
            if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
                this.appController.router.changeCurrentPage(LINKS.Cart);
                this.appController.cartView.checkoutPage.showModal();
            } else {
                this.appController.addProductToCart(this.cardData);
                this.appController.router.changeCurrentPage(LINKS.Cart);
                this.appController.cartView.checkoutPage.showModal();
            }
        });
        const addDeleteProductBtn = createElem<HTMLButtonElement>(
            HTMLTags.BUTTON,
            'btn add-delete-btn btn_add',
            ADD_TO_CART_BUTTON_TEXT
        );
        if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
            addDeleteProductBtn.textContent = DELETE_FROM_CART_BUTTON_TEXT;
        }
        addDeleteProductBtn.addEventListener('click', (): void => {
            this.handleClickOnAddButton(addDeleteProductBtn);
        });

        btnsContainer.append(buyNowBtn, addDeleteProductBtn);

        infoSection.append(priceContainer, description, btnsContainer);
        container.append(breadcrumps, title, imagesSection, infoSection);
        return container;
    }

    public createBriefCard(): HTMLDivElement {
        const container = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.BRIEF_CARD_CONTAINER, '');

        const cardTitle = this.createTitle();
        const price = `$ ${this.cardData.price}`;
        const priceClassName = ClassNames.CARD_PRICE;
        const cardPrice = createElem<HTMLDivElement>(HTMLTags.DIV, priceClassName, price);

        const thumbnailSrc = this.cardData.thumbnail;
        const cardThumbnail = createImage(ClassNames.PRODUCT_CARD_IMAGE, thumbnailSrc);
        const btnsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.PRODUCT_CARD_BTNS_CONTAINER);
        const detailsBtnClassName = ClassNames.BTN;
        const detailsBtn = createElem<HTMLButtonElement>(HTMLTags.BUTTON, detailsBtnClassName, DETAILS_BUTTON_TEXT);
        detailsBtn.addEventListener('click', (): void => {
            const root = `#product/id=${this.cardData.id}`;
            this.appController.router.changeCurrentPage(root);
        });
        const trunkBtn = createElem<HTMLButtonElement>(HTMLTags.BUTTON, ClassNames.TRUNK_BTN, '');
        if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
            trunkBtn.classList.add(ClassNames.TRUNK_BTN_CHECKED);
        }
        trunkBtn.innerHTML = trunkIconSvg;
        trunkBtn.addEventListener('click', (): void => {
            this.handleClickOnTrunkBtn(trunkBtn);
        });
        btnsContainer.append(detailsBtn, trunkBtn);

        container.append(cardTitle, cardPrice, cardThumbnail, btnsContainer);
        return container;
    }

    private createProductImagesSection(): HTMLDivElement {
        const imageSources = [this.cardData.thumbnail].concat(this.cardData.images);
        const container = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.IMG_CONTAINER);
        const previewsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.PRODUCT_CARD_PREVIEWS_CONTAINER);
        const fullImageContainer = createElem<HTMLDivElement>(HTMLTags.DIV, ClassNames.PRODUCT_CARD_IMAGE);
        const fullImage = createImage('', this.cardData.thumbnail);
        fullImageContainer.append(fullImage);
        const previewImagesNumber = 4;
        const maxIndex = imageSources.length > previewImagesNumber ? previewImagesNumber : imageSources.length;
        for (let i = 0; i < maxIndex; i++) {
            const preview = createImage(ClassNames.IMAGE_PREVIEW, imageSources[i]);
            if (imageSources[i] === this.cardData.thumbnail) {
                this.activePreviewImage = preview;
                this.activePreviewImage.classList.add(ClassNames.IMAGE_PREVIEW_ACTIVE);
            }
            previewsContainer.append(preview);
            preview.addEventListener('click', (): void => {
                this.handleClickOnImagePreview(preview, fullImage);
            });
        }

        container.append(fullImageContainer, previewsContainer);
        return container;
    }

    private handleClickOnImagePreview(imagePreview: HTMLImageElement, fullImage: HTMLImageElement): void {
        if (this.activePreviewImage) {
            const newFullImageSrc = imagePreview.getAttribute('src');
            this.activePreviewImage.classList.remove(ClassNames.IMAGE_PREVIEW_ACTIVE);
            imagePreview.classList.add(ClassNames.IMAGE_PREVIEW_ACTIVE);
            this.activePreviewImage = imagePreview;
            if (newFullImageSrc) {
                fullImage.setAttribute('src', newFullImageSrc);
            }
        }
    }

    private createTitle(): HTMLElement {
        const title = this.cardData.title;
        const titleClassName = ClassNames.PRODUCT_CARD_TITLE;
        const cardTitle = createElem<HTMLElement>(HTMLTags.H2, titleClassName, title);
        return cardTitle;
    }

    private handleClickOnTrunkBtn(btn: HTMLButtonElement): void {
        if (btn.classList.contains(ClassNames.TRUNK_BTN_CHECKED)) {
            btn.classList.remove(ClassNames.TRUNK_BTN_CHECKED);
            this.appController.deleteProductFromCart(this.cardData);
        } else {
            btn.classList.add(ClassNames.TRUNK_BTN_CHECKED);
            this.appController.addProductToCart(this.cardData);
        }
    }

    private handleClickOnAddButton(addDeleteBtn: HTMLButtonElement): void {
        if (addDeleteBtn.textContent === ADD_TO_CART_BUTTON_TEXT) {
            addDeleteBtn.textContent = DELETE_FROM_CART_BUTTON_TEXT;
            this.appController.addProductToCart(this.cardData);
        } else {
            addDeleteBtn.textContent = ADD_TO_CART_BUTTON_TEXT;
            this.appController.deleteProductFromCart(this.cardData);
        }
    }
}
