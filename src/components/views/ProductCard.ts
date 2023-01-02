import { Product, ProductCardInterface } from '../../types/interfaces';
import { HTMLElements } from '../../types/types';
import { createElem, createImage } from '../../utils/utils';
import AppController from '../app/app';

const trunkSvg = `<svg width="40" height="32" viewBox="0 0 40 32" fill="#4A2B10" xmlns="http://www.w3.org/2000/svg">
<path d="M36.5602 4.35672H28.3202V1.5919C28.3202 0.670316 27.6004 0 26.8001 0H12.7201C11.8401 0 11.2001 0.753872 11.2001 1.5919V4.35672H2.96007C1.28007 4.35672 0 5.78091 0 7.54029V28.4853C0 28.8205 0.239957 29.1557 0.640064 29.1557H3.04021V30.6637C3.04021 30.9989 3.28016 31.334 3.68027 31.334H8.4802C8.80024 31.334 9.12026 31.0827 9.12026 30.6637V29.1557H30.6403V30.6637C30.6403 30.9989 30.8802 31.334 31.2803 31.334H36.0803C36.4003 31.334 36.7203 31.0827 36.7203 30.6637V29.1557H39.1205C39.4405 29.1557 39.7605 28.9044 39.7605 28.4853V7.54029C39.6001 5.78091 38.2402 4.35672 36.5602 4.35672ZM12.4002 1.5919C12.4002 1.42447 12.5601 1.25674 12.7203 1.25674H26.8003C26.9601 1.25674 27.1203 1.42417 27.1203 1.5919V4.35672H12.4003L12.4002 1.5919ZM1.20021 7.45636C1.20021 6.45093 2.00014 5.52927 3.04036 5.52927L36.5604 5.52956C37.5204 5.52956 38.4005 6.36729 38.4005 7.45666V11.0592L1.2005 11.0589L1.20021 7.45636ZM6.56014 27.815V12.3156H13.5202V16.7559C13.5202 17.0072 13.6801 17.1749 13.8403 17.3423C13.9203 17.4262 16.1603 18.5991 15.2803 21.6152C15.2002 21.7826 15.2803 21.9504 15.3603 22.1178C15.4404 22.2852 15.6003 22.3691 15.7604 22.453C15.7604 22.453 18.0804 23.2068 19.2805 24.9665L19.3606 25.0504C19.6006 25.3017 20.0805 25.3017 20.3207 24.9665C21.5207 23.2071 23.8407 22.453 23.8407 22.453C24.0006 22.3691 24.1608 22.2855 24.2409 22.1178C24.3209 21.9504 24.3209 21.7826 24.3209 21.6152C23.4409 18.683 25.6809 17.4262 25.7609 17.3423C26.0009 17.2585 26.081 17.0072 26.081 16.7559V12.3156H33.041V27.815H6.56014ZM22.8801 21.364C22.1603 21.6153 20.8001 22.2856 19.7601 23.4585C18.7202 22.2856 17.36 21.6153 16.6401 21.2802C17.1201 18.7666 15.8402 17.0912 14.8 16.3373V12.3157H24.8V16.4208C23.7601 17.0912 22.4002 18.7666 22.8801 21.364ZM5.36 12.3158V27.8151H1.12007V12.3158H5.36ZM7.76014 29.9096H4.16029V29.0719H7.76014V29.9096ZM35.3601 29.9096H31.7603V29.0719H35.3601V29.9096ZM38.4003 27.8151H34.1604V12.3158H38.4003V27.8151Z"/>
<path d="M19.7602 13.9915C19.4402 13.9915 19.1202 14.2428 19.1202 14.6618V19.0182C19.1202 19.3534 19.3601 19.6885 19.7602 19.6885C20.0803 19.6885 20.4003 19.4372 20.4003 19.0182V14.6618C20.4003 14.2428 20.0803 13.9915 19.7602 13.9915Z"/>
</svg>`;

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
        trunkBtn.innerHTML = trunkSvg;
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
