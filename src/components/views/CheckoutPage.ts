import {
    CHECKOUT_BUTTON_CONTENT,
    CHECKOUT_CONTACT_INFO_TITLE,
    CHECKOUT_LICENSE_AGREEMENT_TEXT,
    CHECKOUT_PAYMENT_INFO_TITLE,
    CHECKOUT_PERSONAL_INFO_TITLE,
    ORDER_TITLE,
} from '../../constants/string-constants';
import { ICheckoutCard } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class CheckoutPage implements ICheckoutCard {
    public container: DocumentFragment;
    public appController: AppController;
    private personalContainer: HTMLDivElement;
    private contactContainer: HTMLDivElement;
    private paymentContainer: HTMLDivElement;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
        this.personalContainer = createElem(HTMLTags.DIV, 'personal-container') as HTMLDivElement;
        this.contactContainer = createElem(HTMLTags.DIV, 'contact-container') as HTMLDivElement;
        this.paymentContainer = createElem(HTMLTags.DIV, 'payment-container') as HTMLDivElement;
    }

    public createPayCard() {
        this.destroyAllChildNodes(this.container);
        const orderContainer = createElem(HTMLTags.DIV, 'order-container');
        const orderTitle = createElem(HTMLTags.P, 'page-header', ORDER_TITLE);
        // const personalContainer = createElem(HTMLTags.DIV, 'personal-container');
        this.createPersonalInfo();
        this.createContactInfo();
        this.createPaymentInfo();
        // const contactContainer = createElem(HTMLTags.DIV, 'contact-container');
        // const paymentContainer = createElem(HTMLTags.DIV, 'payment-container');
        const checkoutButtonContainer = createElem(HTMLTags.DIV, 'checkout-container');
        const checkoutButton = createElem(HTMLTags.BUTTON, 'btn checkout-button', CHECKOUT_BUTTON_CONTENT);
        checkoutButtonContainer.append(checkoutButton);
        orderContainer.append(
            orderTitle,
            this.personalContainer,
            this.contactContainer,
            this.paymentContainer,
            checkoutButtonContainer
        );
        this.container.append();
    }

    private createPersonalInfo() {
        this.destroyAllChildNodes(this.personalContainer);
        const personalTitle = createElem(HTMLTags.P, 'personal-title payment-title', CHECKOUT_PERSONAL_INFO_TITLE);

        const personalInfoContent = createElem(HTMLTags.DIV, 'personal-info-content');
        const personalInputFirstname = createElem(HTMLTags.INPUT, 'personal-input-firstname');
        const personalInputLastname = createElem(HTMLTags.INPUT, 'personal-input-lastname');
        const personalInputAddress = createElem(HTMLTags.INPUT, 'personal-input-address');
        personalInfoContent.append(personalInputFirstname, personalInputLastname, personalInputAddress);

        this.personalContainer.append(personalTitle, personalInfoContent);
    }

    private createContactInfo() {
        this.destroyAllChildNodes(this.contactContainer);
        const contactTitle = createElem(HTMLTags.P, 'contact-title payment-title', CHECKOUT_CONTACT_INFO_TITLE);

        const contactInfoContent = createElem(HTMLTags.DIV, 'contact-info-content');
        const contactPhone = createElem(HTMLTags.INPUT, 'contact-input-phone');
        const contactMail = createElem(HTMLTags.INPUT, 'contact-input-mail');

        const contactAgreeContainer = createElem(HTMLTags.DIV, 'contact-agree container');
        const contactAgree = createElem(HTMLTags.INPUT, 'contact-input-argeement');
        contactAgree.setAttribute('type', 'radio');
        contactAgree.setAttribute('id', 'license');
        const contactAgreeLabel = createElem(
            HTMLTags.LABEL,
            'contact-label-argeement',
            CHECKOUT_LICENSE_AGREEMENT_TEXT
        );
        contactAgreeLabel.setAttribute('for', 'license');
        contactAgreeContainer.append(contactAgree, contactAgreeLabel);

        contactInfoContent.append(contactPhone, contactMail, contactAgreeContainer);

        this.personalContainer.append(contactTitle, contactInfoContent);
    }

    private createPaymentInfo() {
        this.destroyAllChildNodes(this.personalContainer);
        const paymentTitle = createElem(HTMLTags.P, 'payment-title payment-title', CHECKOUT_PAYMENT_INFO_TITLE);

        const paymentlInfoContent = createElem(HTMLTags.DIV, 'payment-info-content');
        const paymentlInputCard = createElem(HTMLTags.INPUT, 'payment-input-card');
        const paymentlInputLastname = createElem(HTMLTags.INPUT, 'payment-input-valid');
        const paymentInputAddress = createElem(HTMLTags.INPUT, 'payment-input-cvv');
        paymentlInfoContent.append(paymentlInputCard, paymentlInputLastname, paymentInputAddress);

        this.personalContainer.append(paymentTitle, paymentlInfoContent);
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    public render() {
        this.createPayCard();
        return this.container;
    }
}
