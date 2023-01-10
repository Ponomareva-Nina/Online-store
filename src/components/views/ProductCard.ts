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
} from '../../constants/string-constants';
import { ClassNames } from '../../constants/classnames-constants';
import CheckoutPage from './CheckoutPage';
import { LINKS } from '../../constants/route-constants';

export default class ProductCard implements ProductCardInterface {
    public cardData: Product;
    public appController: AppController;
    private activePreviewImage: NullableElement<HTMLImageElement>;
    checkoutPage: CheckoutPage;

    constructor(card: Product, controller: AppController) {
        this.cardData = card;
        this.appController = controller;
        this.checkoutPage = new CheckoutPage();
        this.activePreviewImage = null;
    }

    private createBreadCrumps() {
        const container = createElem(HTMLTags.DIV, ClassNames.BREADCRUMPS_CONTAINER, '');
        const stepsLine = createElem(HTMLTags.DIV, ClassNames.STEPS_LINE, '');
        const linksContainer = createElem(HTMLTags.DIV, ClassNames.BREADCRUMPS_LINKS_CONTAINER, '');
        const initialLink = createElem(HTMLTags.LINK, '', 'Catalogue') as HTMLLinkElement;
        initialLink.setAttribute('href', LINKS.Store);
        initialLink.addEventListener('click', (e) => {
            this.navigateByBreadCrump(e, LINKS.Store);
        });
        const initialSeparator = createElem(HTMLTags.SPAN, 'breadcrumps-separator', '');
        const category = createElem(HTMLTags.LINK, 'breadcrumps-link', this.cardData.category) as HTMLLinkElement;
        const categoryPath = `${LINKS.Store}${QUERY_SEPARATOR}${PossibleUrlParams.CATEGORY}=${this.cardData.category}`;
        category.setAttribute('href', categoryPath);
        category.addEventListener('click', (e) => {
            this.navigateByBreadCrump(e, category.href);
        });
        const categorySeparator = createElem(HTMLTags.SPAN, 'breadcrumps-separator', '');
        const faculty = createElem(HTMLTags.LINK, 'breadcrumps-link', this.cardData.faculty) as HTMLLinkElement;
        const facultyPath = `${LINKS.Store}${QUERY_SEPARATOR}${PossibleUrlParams.CATEGORY}=${this.cardData.category}${AMPERSAND_SEPARATOR}${PossibleUrlParams.FACULTY}=${this.cardData.faculty}`;
        faculty.setAttribute('href', facultyPath);
        linksContainer.append(initialLink, initialSeparator, category, categorySeparator, faculty);
        container.append(stepsLine, linksContainer);
        return container;
    }

    private navigateByBreadCrump(e: MouseEvent, href: string) {
        e.preventDefault();
        this.appController.router.changeCurrentPage(href);
    }

    public createFullCard() {
        const container = createElem(HTMLTags.SECTION, ClassNames.FULL_CARD_CONTAINER, '');
        const infoSection = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARD_INFO);
        const breadcrumps = this.createBreadCrumps();
        const title = this.createTitle();
        const priceContainer = createElem(HTMLTags.DIV, 'card_product-params-container', '');
        const priceText = `Price: $ ${this.cardData.price}`;
        const cardPrice = createElem(HTMLTags.DIV, ClassNames.CARD_PRICE, priceText);
        const discountText = `Discount: ${this.cardData.discount} %`;
        const cardDiscount = createElem(HTMLTags.DIV, ClassNames.CARD_DISCOUNT, discountText);
        priceContainer.append(cardPrice, cardDiscount);
        const descriptionText = this.cardData.description;
        const description = createElem(HTMLTags.DIV, ClassNames.CARD_DESCRIPTION, descriptionText);
        const imagesSection = this.createProductImagesSection();

        const btnsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARD_BTNS_CONTAINER);
        const buyNowBtn = createElem(HTMLTags.BUTTON, ClassNames.BTN, BUY_NOW_BUTTON_TEXT);
        buyNowBtn.addEventListener('click', () => {
            if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
                this.checkoutPage.addEventLestenerBuyButton();
                this.checkoutPage.showModal();
            } else {
                this.appController.addProductToCart(this.cardData);
                this.checkoutPage.deleteEventLestenerBuyButton();
                this.checkoutPage.showModal();
            }
        });
        const addDeleteProductBtn = createElem(HTMLTags.BUTTON, 'btn add-delete-btn btn_add', ADD_TO_CART_BUTTON_TEXT);
        if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
            addDeleteProductBtn.textContent = DELETE_FROM_CART_BUTTON_TEXT;
        }
        addDeleteProductBtn.addEventListener('click', () => {
            this.handleClickOnAddButton(addDeleteProductBtn);
        });

        btnsContainer.append(buyNowBtn, addDeleteProductBtn);

        infoSection.append(priceContainer, description, btnsContainer);
        const checkoutPage = this.checkoutPage.createPayCard();
        container.append(breadcrumps, title, imagesSection, infoSection, checkoutPage);
        return container;
    }

    public createBriefCard() {
        const container = createElem(HTMLTags.DIV, ClassNames.BRIEF_CARD_CONTAINER, '');

        const cardTitle = this.createTitle();
        const price = `$ ${this.cardData.price}`;
        const priceClassName = ClassNames.CARD_PRICE;
        const cardPrice = createElem(HTMLTags.DIV, priceClassName, price);

        const thumbnailSrc = this.cardData.thumbnail;
        const cardThumbnail = createImage(ClassNames.PRODUCT_CARD_IMAGE, thumbnailSrc);
        const btnsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARD_BTNS_CONTAINER);
        const detailsBtnClassName = ClassNames.BTN;
        const detailsBtn = createElem(HTMLTags.BUTTON, detailsBtnClassName, DETAILS_BUTTON_TEXT);
        detailsBtn.addEventListener('click', () => {
            const root = `#product/id=${this.cardData.id}`;
            this.appController.router.changeCurrentPage(root);
        });
        const trunkBtn = createElem(HTMLTags.BUTTON, ClassNames.TRUNK_BTN, '');
        if (this.appController.cartModel.checkProductInCart(this.cardData.id)) {
            trunkBtn.classList.add(ClassNames.TRUNK_BTN_CHECKED);
        }
        trunkBtn.innerHTML = trunkIconSvg;
        trunkBtn.addEventListener('click', () => {
            this.handleClickOnTrunkBtn(trunkBtn);
        });
        btnsContainer.append(detailsBtn, trunkBtn);

        container.append(cardTitle, cardPrice, cardThumbnail, btnsContainer);
        return container;
    }

    private createProductImagesSection() {
        const imageSources = [this.cardData.thumbnail].concat(this.cardData.images);
        const container = createElem(HTMLTags.DIV, ClassNames.IMG_CONTAINER);
        const previewsContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARD_PREVIEWS_CONTAINER);
        const fullImageContainer = createElem(HTMLTags.DIV, ClassNames.PRODUCT_CARD_IMAGE);
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
            preview.addEventListener('click', () => {
                this.handleClickOnImagePreview(preview, fullImage);
            });
        }

        container.append(fullImageContainer, previewsContainer);
        return container;
    }

    private handleClickOnImagePreview(imagePreview: HTMLImageElement, fullImage: HTMLImageElement) {
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

    private createTitle() {
        const title = this.cardData.title;
        const titleClassName = ClassNames.PRODUCT_CARD_TITLE;
        const cardTitle = createElem(HTMLTags.H2, titleClassName, title);
        return cardTitle;
    }

    private handleClickOnTrunkBtn(btn: HTMLElement) {
        if (btn.classList.contains(ClassNames.TRUNK_BTN_CHECKED)) {
            btn.classList.remove(ClassNames.TRUNK_BTN_CHECKED);
            this.appController.deleteProductFromCart(this.cardData);
        } else {
            btn.classList.add(ClassNames.TRUNK_BTN_CHECKED);
            this.appController.addProductToCart(this.cardData);
        }
    }

    private handleClickOnAddButton(addDeleteBtn: HTMLElement) {
        if (addDeleteBtn.textContent === ADD_TO_CART_BUTTON_TEXT) {
            addDeleteBtn.textContent = DELETE_FROM_CART_BUTTON_TEXT;
            this.appController.addProductToCart(this.cardData);
        } else {
            addDeleteBtn.textContent = ADD_TO_CART_BUTTON_TEXT;
            this.appController.deleteProductFromCart(this.cardData);
        }
    }
}
