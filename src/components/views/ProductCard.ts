import { Product, ProductCardInterface } from '../../types/interfaces';
import { HTMLTags, NullableElement } from '../../types/types';
import { createElem, createImage } from '../../utils/utils';
import AppController from '../app/app';
import { trunkIconSvg } from '../../assets/svg-inline-icons/trunk-icon';
import { DETAILS_BUTTON_TEXT } from '../../constants/string-constants';
import {
    CLASS_BRIEF_CARD_CONTAINER,
    CLASS_BTN,
    CLASS_CARD_DESCRIPTION,
    CLASS_CARD_DISCOUNT,
    CLASS_CARD_PRICE,
    CLASS_FULL_CARD_CONTAINER,
    CLASS_IMAGE_PREVIEW,
    CLASS_IMAGE_PREVIEW_ACTIVE,
    CLASS_IMG_CONTAINER,
    CLASS_PRODUCT_CARD_BTNS_CONTAINER,
    CLASS_PRODUCT_CARD_IMAGE,
    CLASS_PRODUCT_CARD_INFO,
    CLASS_PRODUCT_CARD_PREVIEWS_CONTAINER,
    CLASS_PRODUCT_CARD_TITLE,
    CLASS_TRUNK_BTN,
    CLASS_TRUNK_BTN_CHECKED,
} from '../../constants/classnames-constants';

export default class ProductCard implements ProductCardInterface {
    cardData: Product;
    appController: AppController;
    activePreviewImage: NullableElement<HTMLImageElement>;

    constructor(card: Product, controller: AppController) {
        this.cardData = card;
        this.appController = controller;
        this.activePreviewImage = null;
    }

    public createFullCard() {
        const container = createElem(HTMLTags.SECTION, CLASS_FULL_CARD_CONTAINER, '');
        const infoSection = createElem(HTMLTags.DIV, CLASS_PRODUCT_CARD_INFO);

        const title = this.createTitle();
        const priceContainer = createElem(HTMLTags.DIV, '', '');
        const priceText = `Price: $ ${this.cardData.price}`;
        const cardPrice = createElem(HTMLTags.DIV, CLASS_CARD_PRICE, priceText);
        const discountText = `Discount: $ ${this.cardData.discount}`;
        const cardDiscount = createElem(HTMLTags.DIV, CLASS_CARD_DISCOUNT, discountText);
        priceContainer.append(cardPrice, cardDiscount);
        const descriptionText = this.cardData.description;
        const description = createElem(HTMLTags.DIV, CLASS_CARD_DESCRIPTION, descriptionText);
        const imagesSection = this.createProductImagesSection();

        infoSection.append(title, priceContainer, description);
        container.append(imagesSection, infoSection);
        return container;
    }

    public createBriefCard() {
        const container = createElem(HTMLTags.DIV, CLASS_BRIEF_CARD_CONTAINER, '');

        const cardTitle = this.createTitle();
        const price = `$ ${this.cardData.price}`;
        const priceClassName = CLASS_CARD_PRICE;
        const cardPrice = createElem(HTMLTags.DIV, priceClassName, price);

        const thumbnailSrc = this.cardData.thumbnail;
        const cardThumbnail = createImage(CLASS_PRODUCT_CARD_IMAGE, thumbnailSrc);
        const btnsContainer = createElem(HTMLTags.DIV, CLASS_PRODUCT_CARD_BTNS_CONTAINER);
        const detailsBtnClassName = CLASS_BTN;
        const detailsBtn = createElem(HTMLTags.BUTTON, detailsBtnClassName, DETAILS_BUTTON_TEXT);
        detailsBtn.addEventListener('click', () => {
            const root = `#product/id=${this.cardData.id}`;
            this.appController.router.changeCurrentPage(root);
        });
        const trunkBtn = createElem(HTMLTags.BUTTON, CLASS_TRUNK_BTN, '');
        trunkBtn.innerHTML = trunkIconSvg;
        trunkBtn.addEventListener('click', () => {
            this.handleClickOnTrunkBtn(trunkBtn, this.cardData);
        });
        btnsContainer.append(detailsBtn, trunkBtn);

        container.append(cardTitle, cardPrice, cardThumbnail, btnsContainer);
        return container;
    }

    private createProductImagesSection() {
        const imageSources = [this.cardData.thumbnail].concat(this.cardData.images);
        const container = createElem(HTMLTags.DIV, CLASS_IMG_CONTAINER);
        const previewsContainer = createElem(HTMLTags.DIV, CLASS_PRODUCT_CARD_PREVIEWS_CONTAINER);
        const fullImageContainer = createElem(HTMLTags.DIV, CLASS_PRODUCT_CARD_IMAGE);
        const fullImage = createImage('', this.cardData.thumbnail);
        fullImageContainer.append(fullImage);

        imageSources.forEach((imageSrc) => {
            const preview = createImage(CLASS_IMAGE_PREVIEW, imageSrc);
            if (imageSrc === this.cardData.thumbnail) {
                this.activePreviewImage = preview;
                this.activePreviewImage.classList.add(CLASS_IMAGE_PREVIEW_ACTIVE);
            }
            previewsContainer.append(preview);
            preview.addEventListener('click', () => {
                this.handleClickOnImagePreview(preview, fullImage);
            });
        });

        container.append(previewsContainer, fullImageContainer);
        return container;
    }

    private handleClickOnImagePreview(imagePreview: HTMLImageElement, fullImage: HTMLImageElement) {
        if (this.activePreviewImage) {
            const newFullImageSrc = imagePreview.getAttribute('src');
            this.activePreviewImage.classList.remove(CLASS_IMAGE_PREVIEW_ACTIVE);
            imagePreview.classList.add(CLASS_IMAGE_PREVIEW_ACTIVE);
            this.activePreviewImage = imagePreview;
            if (newFullImageSrc) {
                fullImage.setAttribute('src', newFullImageSrc);
            }
        }
    }

    private createTitle() {
        const title = this.cardData.title;
        const titleClassName = CLASS_PRODUCT_CARD_TITLE;
        const cardTitle = createElem(HTMLTags.H2, titleClassName, title);
        return cardTitle;
    }

    private handleClickOnTrunkBtn(btn: HTMLElement, card: Product) {
        if (btn.classList.contains(CLASS_TRUNK_BTN_CHECKED)) {
            btn.classList.remove(CLASS_TRUNK_BTN_CHECKED);
            this.appController.deleteProductFromCart(card);
        } else {
            btn.classList.add(CLASS_TRUNK_BTN_CHECKED);
            this.appController.addProductToCart(card);
        }
    }
}
