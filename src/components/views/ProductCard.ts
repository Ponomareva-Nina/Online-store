import { Product, ProductCardInterface } from '../../types/interfaces';
import { HTMLElements } from '../../types/types';
import { createElem, createImage } from '../../utils/utils';

export default class ProductCard implements ProductCardInterface {
    cardData: Product;

    constructor(card: Product) {
        this.cardData = card;
    }

    public createFullCard() {
        const container = createElem(HTMLElements.DIV, 'card', '');
        return container;
    }

    public createBriefCard() {
        const title = this.cardData.title;
        const titleClassName = 'card__title';
        const cardTitle = createElem(HTMLElements.H2, titleClassName, title);

        const price = `$ ${this.cardData.price}`;
        const priceClassName = 'card__price';
        const cardPrice = createElem(HTMLElements.DIV, priceClassName, price);

        const thumbnailSrc = this.cardData.thumbnail;
        const imageClassName = 'card__image';
        const cardThumbnail = createImage(imageClassName, thumbnailSrc);
        cardThumbnail.setAttribute('width', '150px');

        const detailsBtnText = 'Details';
        const detailsBtnClassName = 'btn';
        const detailsBtn = createElem(HTMLElements.BUTTON, detailsBtnClassName, detailsBtnText);

        const addToCartBtnClassName = 'add-to-cart-btn';
        const addToCartBtn = createElem(HTMLElements.BUTTON, addToCartBtnClassName, 'add');

        const container = createElem(HTMLElements.DIV, 'card', '');
        container.append(cardTitle, cardPrice, cardThumbnail, detailsBtn, addToCartBtn);
        return container;
    }
}
