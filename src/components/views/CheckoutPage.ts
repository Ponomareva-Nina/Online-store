import {
    CHECKOUT_BUTTON_CONTENT,
    CHECKOUT_CONTACT_INFO_TITLE,
    CHECKOUT_LICENSE_AGREEMENT_TEXT,
    CHECKOUT_PAYMENT_INFO_TITLE,
    CHECKOUT_PERSONAL_INFO_TITLE,
    ORDER_TITLE,
} from '../../constants/string-constants';
// import { ICheckoutCard } from '../../types/interfaces'; надо поправить интерфейс теперь
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
//import AppController from '../app/app';

export default class CheckoutPage {
    public container: HTMLDivElement;

    constructor() {
        this.container = createElem(HTMLTags.DIV, 'order-container') as HTMLDivElement;
    }

    public createPayCard() {
        this.destroyAllChildNodes(this.container);
        //const orderContainer = createElem(HTMLTags.DIV, 'order-container');
        const orderTitle = createElem(HTMLTags.P, 'page-header', ORDER_TITLE);
        const personalInfoBlock = this.createPersonalInfo();
        const contactInfoBlock = this.createContactInfo();
        const paymentInfoBlock = this.createPaymentInfo();

        const checkoutButtonContainer = createElem(HTMLTags.DIV, 'checkout-container');
        const checkoutButton = createElem(HTMLTags.BUTTON, 'btn checkout-button', CHECKOUT_BUTTON_CONTENT);
        checkoutButton.addEventListener('click', () => this.hideModal());
        checkoutButtonContainer.append(checkoutButton);
        this.container.append(
            orderTitle,
            personalInfoBlock,
            contactInfoBlock,
            paymentInfoBlock,
            checkoutButtonContainer
        );
        return this.container;
        /* ты возвращаешь же контейнер в методе render. Получается два раза его возвращаешь.
        Либо избавься от метода render либо либо поменяй интерфейс и не возращай тут ничего -
        тогда этот метод будет служить чисто для создания компонентов а render будешь вызывать из корзины,
        но я думаю лучше его оставить так, а render удалить */
    }

    private createPersonalInfo() {
        const personalContainer = createElem(HTMLTags.DIV, 'personal-container') as HTMLDivElement;
        const personalTitle = createElem(HTMLTags.P, 'personal-title payment-title', CHECKOUT_PERSONAL_INFO_TITLE);
        const personalInfoContent = createElem(HTMLTags.DIV, 'personal-info-content');
        const personalInputFirstname = createElem(HTMLTags.INPUT, 'personal-input-firstname');
        const personalInputLastname = createElem(HTMLTags.INPUT, 'personal-input-lastname');
        const personalInputAddress = createElem(HTMLTags.INPUT, 'personal-input-address');
        personalInfoContent.append(personalInputFirstname, personalInputLastname, personalInputAddress);
        personalContainer.append(personalTitle, personalInfoContent);
        return personalContainer;
    }

    private createContactInfo() {
        const contactContainer = createElem(HTMLTags.DIV, 'contact-container') as HTMLDivElement;
        const contactTitle = createElem(HTMLTags.P, 'contact-title payment-title', CHECKOUT_CONTACT_INFO_TITLE);
        const contactInfoContent = createElem(HTMLTags.DIV, 'contact-info-content');
        const contactPhone = createElem(HTMLTags.INPUT, 'contact-input-phone');
        const contactMail = createElem(HTMLTags.INPUT, 'contact-input-mail');

        const contactAgreeContainer = createElem(HTMLTags.DIV, 'contact-agree container');
        const contactAgree = createElem(HTMLTags.INPUT, 'contact-input-argeement');
        contactAgree.setAttribute('type', 'checkbox');
        contactAgree.setAttribute('id', 'license');
        const contactAgreeLabel = createElem(
            HTMLTags.LABEL,
            'contact-label-argeement',
            CHECKOUT_LICENSE_AGREEMENT_TEXT
        );
        contactAgreeLabel.setAttribute('for', 'license');
        contactAgreeContainer.append(contactAgree, contactAgreeLabel);

        contactInfoContent.append(contactPhone, contactMail, contactAgreeContainer);
        contactContainer.append(contactTitle, contactInfoContent);
        return contactContainer;
    }

    private createPaymentInfo() {
        const paymentContainer = createElem(HTMLTags.DIV, 'payment-container') as HTMLDivElement;
        const paymentTitle = createElem(HTMLTags.P, 'payment-title payment-title', CHECKOUT_PAYMENT_INFO_TITLE);
        const paymentlInfoContent = createElem(HTMLTags.DIV, 'payment-info-content');
        const paymentlInputCard = createElem(HTMLTags.INPUT, 'payment-input-card');
        const paymentlInputLastname = createElem(HTMLTags.INPUT, 'payment-input-valid');
        const paymentInputAddress = createElem(HTMLTags.INPUT, 'payment-input-cvv');
        paymentlInfoContent.append(paymentlInputCard, paymentlInputLastname, paymentInputAddress);

        paymentContainer.append(paymentTitle, paymentlInfoContent);
        return paymentContainer;
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    public showModal() {
        this.container.classList.add('popup_active');
    }

    public hideModal() {
        this.container.classList.remove('popup_active');
    }

    /* зачем этот метод если у тебя в createPayCard и так возвращается контейнер?
    public render() {
        this.createPayCard();
        return this.container;
    } */
}
