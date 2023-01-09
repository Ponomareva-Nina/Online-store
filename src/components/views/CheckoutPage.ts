import {
    CHECKOUT_BUTTON_CONTENT,
    CHECKOUT_CONTACT_INFO_TITLE,
    CHECKOUT_LICENSE_AGREEMENT_TEXT,
    CHECKOUT_PAYMENT_INFO_TITLE,
    CHECKOUT_PERSONAL_INFO_TITLE,
    ORDER_PLACEHOLDER_ADDRESS,
    ORDER_PLACEHOLDER_CARD,
    ORDER_PLACEHOLDER_CARD_CVV,
    ORDER_PLACEHOLDER_CARD_VALID,
    ORDER_PLACEHOLDER_FIRSTNAME,
    ORDER_PLACEHOLDER_LASTNAME,
    ORDER_PLACEHOLDER_MAIL,
    ORDER_PLACEHOLDER_PHONE,
    ORDER_TITLE,
} from '../../constants/string-constants';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';

export default class CheckoutPage {
    public container: HTMLDivElement;

    constructor() {
        this.container = createElem(HTMLTags.DIV, 'order-container') as HTMLDivElement;
    }

    public createPayCard() {
        this.destroyAllChildNodes(this.container);
        const orderTitle = createElem(HTMLTags.P, 'page-header', ORDER_TITLE);
        const personalInfoBlock = this.createPersonalInfo();
        const contactInfoBlock = this.createContactInfo();
        const paymentInfoBlock = this.createPaymentInfo();

        const checkoutButtonContainer = createElem(HTMLTags.DIV, 'checkout-container');
        const checkoutButton = createElem(HTMLTags.BUTTON, 'btn checkout-button', CHECKOUT_BUTTON_CONTENT);
        checkoutButton.addEventListener('click', () => {
            this.hideModal();
        });
        checkoutButtonContainer.append(checkoutButton);
        this.container.append(
            orderTitle,
            personalInfoBlock,
            contactInfoBlock,
            paymentInfoBlock,
            checkoutButtonContainer
        );
        return this.container;
    }

    private createPersonalInfo() {
        const personalContainer = createElem(HTMLTags.DIV, 'personal-container') as HTMLDivElement;
        const personalTitle = createElem(HTMLTags.P, 'personal-title payment-title', CHECKOUT_PERSONAL_INFO_TITLE);
        const personalInfoContent = createElem(HTMLTags.DIV, 'personal-info-content');
        const personalInputFirstname = createElem(HTMLTags.INPUT, 'personal-input-firstname payment-input');
        personalInputFirstname.setAttribute('placeholder', ORDER_PLACEHOLDER_FIRSTNAME);
        const personalInputLastname = createElem(HTMLTags.INPUT, 'personal-input-lastname payment-input');
        personalInputLastname.setAttribute('placeholder', ORDER_PLACEHOLDER_LASTNAME);
        const personalInputAddress = createElem(HTMLTags.INPUT, 'personal-input-address payment-input');
        personalInputAddress.setAttribute('placeholder', ORDER_PLACEHOLDER_ADDRESS);
        personalInfoContent.append(personalInputFirstname, personalInputLastname, personalInputAddress);
        personalContainer.append(personalTitle, personalInfoContent);
        return personalContainer;
    }

    private createContactInfo() {
        const contactContainer = createElem(HTMLTags.DIV, 'contact-container') as HTMLDivElement;
        const contactTitle = createElem(HTMLTags.P, 'contact-title payment-title', CHECKOUT_CONTACT_INFO_TITLE);
        const contactInfoContent = createElem(HTMLTags.DIV, 'contact-info-content');
        const contactPhone = createElem(HTMLTags.INPUT, 'contact-input-phone payment-input');
        contactPhone.setAttribute('placeholder', ORDER_PLACEHOLDER_PHONE);
        const contactMail = createElem(HTMLTags.INPUT, 'contact-input-mail payment-input');
        contactMail.setAttribute('placeholder', ORDER_PLACEHOLDER_MAIL);

        const contactAgreeContainer = createElem(HTMLTags.DIV, 'contact-agree-container');
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
        const paymentInputCard = createElem(HTMLTags.INPUT, 'payment-input-card payment-input');
        paymentInputCard.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD);
        const paymentInputLastname = createElem(HTMLTags.INPUT, 'payment-input-valid payment-input');
        paymentInputLastname.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_VALID);
        const paymentInputAddress = createElem(HTMLTags.INPUT, 'payment-input-cvv payment-input');
        paymentInputAddress.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_CVV);
        paymentlInfoContent.append(paymentInputCard, paymentInputLastname, paymentInputAddress);

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
        document.body.classList.add('inactive-order');
        // document.body.addEventListener('click', (e: MouseEvent) => {
        //     this.container.classList.add('popup_active');
        //     document.body.classList.add('inactive-order');
        //     const target = e.target as HTMLElement;
        //     if (target.classList.contains('') && target.classList.contains('close-order')) {
        //         this.container.classList.remove('popup_active');
        //         document.body.classList.remove('inactive-order');
        //     }
        // });
    }

    public hideModal() {
        // document.body.removeEventListener('click', (e: MouseEvent) => {
        //     this.container.classList.add('popup_active');
        //     document.body.classList.add('inactive-order');
        //     const target = e.target as HTMLElement;
        //     if (target.classList.contains('') && target.classList.contains('close-order')) {
        //         this.container.classList.remove('popup_active');
        //         document.body.classList.remove('inactive-order');
        //     }
        // });
        this.container.classList.remove('popup_active');
        document.body.classList.remove('inactive-order');
    }
}
