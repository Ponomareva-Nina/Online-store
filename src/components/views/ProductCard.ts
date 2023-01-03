import { Product, ProductCardInterface } from '../../types/interfaces';
import { HTMLElements } from '../../types/types';
import { createElem, createImage } from '../../utils/utils';
import AppController from '../app/app';
import { trunkIconSvg } from '../../assets/svg-inline-icons/trunk-icon';

export default class ProductCard implements ProductCardInterface {
    cardData: Product;
    appController: AppController;

    constructor(card: Product, controller: AppController) {
        this.cardData = card;
        this.appController = controller;
    }

    public createFullCard() {
        const cardContainerClassName = 'card card_full';
        const container = createElem(HTMLElements.DIV, cardContainerClassName, '');

        const title = this.createTitle();
        const priceContainer = createElem(HTMLElements.DIV, 'card__price-info', '');
        const priceText = `Price: $ ${this.cardData.price}`;
        const cardPrice = createElem(HTMLElements.DIV, 'card__price', priceText);
        const discountText = `Discount: $ ${this.cardData.discount}`;
        const cardDiscount = createElem(HTMLElements.DIV, 'card__discount', discountText);
        priceContainer.append(cardPrice, cardDiscount);
        const descriptionText = this.cardData.description;
        const description = createElem(HTMLElements.DIV, 'card__description', descriptionText);

        container.append(title, priceContainer, description);
        return container;
    }

    public createBriefCard() {
        const cardContainerClassName = 'card card_brief';
        const container = createElem(HTMLElements.DIV, cardContainerClassName, '');

        const cardTitle = this.createTitle();
        const price = `$ ${this.cardData.price}`;
        const priceClassName = 'card__price';
        const cardPrice = createElem(HTMLElements.DIV, priceClassName, price);

        const thumbnailSrc = this.cardData.thumbnail;
        const imageClassName = 'card__image';
        const cardThumbnail = createImage(imageClassName, thumbnailSrc);

        const btnsContainerClassName = 'card__btns-container';
        const btnsContainer = createElem(HTMLElements.DIV, btnsContainerClassName);
        const detailsBtnText = 'Details';
        const detailsBtnClassName = 'btn';
        const detailsBtn = createElem(HTMLElements.BUTTON, detailsBtnClassName, detailsBtnText);
        detailsBtn.addEventListener('click', () => {
            const root = `#product/id=${this.cardData.id}`;
            this.appController.router.changeCurrentPage(root);
        });
        const trunkBtnClassName = 'trunk-btn';
        const trunkBtn = createElem(HTMLElements.BUTTON, trunkBtnClassName, '');
        trunkBtn.innerHTML = trunkIconSvg;
        trunkBtn.addEventListener('click', () => {
            this.handleClickOnTrunkBtn(trunkBtn, this.cardData);
        });
        btnsContainer.append(detailsBtn, trunkBtn);

        container.append(cardTitle, cardPrice, cardThumbnail, btnsContainer);
        return container;
    }

    private createTitle() {
        const title = this.cardData.title;
        const titleClassName = 'card__title';
        const cardTitle = createElem(HTMLElements.H2, titleClassName, title);
        return cardTitle;
    }

    private handleClickOnTrunkBtn(btn: HTMLElement, card: Product) {
        if (btn.classList.contains('trunk-btn_checked')) {
            btn.classList.remove('trunk-btn_checked');
            this.appController.deleteProductFromCart(card);
        } else {
            btn.classList.add('trunk-btn_checked');
            this.appController.addProductToCart(card);
        }
    }
}
