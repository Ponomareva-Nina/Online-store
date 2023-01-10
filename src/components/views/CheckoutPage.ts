import { LINKS } from '../../constants/route-constants';
import {
    CHECKOUT_BUTTON_CONTENT,
    CHECKOUT_CONTACT_INFO_TITLE,
    CHECKOUT_LICENSE_AGREEMENT_TEXT,
    CHECKOUT_PAYMENT_INFO_TITLE,
    CHECKOUT_PERSONAL_INFO_TITLE,
    INPUT_STRING_ADDRESS_PATTERN,
    INPUT_STRING_FIRSTNAME_LASTNAME_PATTERN,
    INPUT_TYPE_CARD_CVV_PATTERN,
    INPUT_TYPE_CARD_NUMBER_PATTERN,
    INPUT_TYPE_CARD_VALID_TIME_PATTERN,
    INPUT_TYPE_MAIL_PATTERN,
    INPUT_TYPE_NUMBER,
    INPUT_TYPE_PHONE_PATTERN,
    INPUT_TYPE_TEXT,
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
import AppController from '../app/app';

export default class CheckoutPage {
    public appController: AppController;
    public container: HTMLDivElement;
    private contactAgree: HTMLInputElement;
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    mail: string;
    agree: boolean;
    cardNumber: string;
    cardValidTime: string;
    cvv: string;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = createElem(HTMLTags.DIV, 'order-container') as HTMLDivElement;
        this.contactAgree = createElem(HTMLTags.INPUT, 'contact-input-argeement') as HTMLInputElement;
        this.firstname = '';
        this.lastname = '';
        this.address = '';
        this.phone = '';
        this.mail = '';
        this.agree = false;
        this.cardNumber = '';
        this.cardValidTime = '';
        this.cvv = '';
    }

    public createPayCard() {
        this.destroyAllChildNodes(this.container);
        const form = createElem('form', 'ordere-form');
        const orderTitle = createElem(HTMLTags.P, 'page-header', ORDER_TITLE);
        const personalInfoBlock = this.createPersonalInfo();
        const contactInfoBlock = this.createContactInfo();
        const paymentInfoBlock = this.createPaymentInfo();

        const checkoutButtonContainer = createElem(HTMLTags.DIV, 'checkout-container');
        const checkoutButton = createElem(HTMLTags.INPUT, 'btn checkout-button');
        checkoutButton.setAttribute('type', 'submit');
        checkoutButton.setAttribute('value', CHECKOUT_BUTTON_CONTENT);
        checkoutButton.addEventListener('click', () => {
            this.checkIsUserAgree();
            this.checkAllInputsFull();
        });
        checkoutButtonContainer.append(checkoutButton);
        form.append(personalInfoBlock, contactInfoBlock, paymentInfoBlock, checkoutButtonContainer);
        this.container.append(orderTitle, form);
        return this.container;
    }

    private createPersonalInfo() {
        const personalContainer = createElem(HTMLTags.DIV, 'personal-container') as HTMLDivElement;
        const personalTitle = createElem(HTMLTags.P, 'personal-title payment-title', CHECKOUT_PERSONAL_INFO_TITLE);
        const personalInfoContent = createElem(HTMLTags.DIV, 'personal-info-content');
        const personalInputFirstname = createElem(
            HTMLTags.INPUT,
            'personal-input-firstname payment-input'
        ) as HTMLInputElement;
        personalInputFirstname.setAttribute('placeholder', ORDER_PLACEHOLDER_FIRSTNAME);
        personalInputFirstname.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputFirstname.setAttribute('required', '');
        personalInputFirstname.setAttribute('pattern', INPUT_STRING_FIRSTNAME_LASTNAME_PATTERN);
        personalInputFirstname.addEventListener('change', () => this.checkFirstName(personalInputFirstname.value));

        const personalInputLastname = createElem(
            HTMLTags.INPUT,
            'personal-input-lastname payment-input'
        ) as HTMLInputElement;
        personalInputLastname.setAttribute('placeholder', ORDER_PLACEHOLDER_LASTNAME);
        personalInputLastname.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputLastname.setAttribute('required', '');
        personalInputLastname.setAttribute('pattern', INPUT_STRING_FIRSTNAME_LASTNAME_PATTERN);
        personalInputLastname.addEventListener('change', () => this.checkLastName(personalInputLastname.value));

        const personalInputAddress = createElem(
            HTMLTags.INPUT,
            'personal-input-address payment-input'
        ) as HTMLInputElement;
        personalInputAddress.setAttribute('placeholder', ORDER_PLACEHOLDER_ADDRESS);
        personalInputAddress.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputAddress.setAttribute('required', '');
        personalInputAddress.setAttribute('pattern', INPUT_STRING_ADDRESS_PATTERN);
        personalInputAddress.addEventListener('change', () => this.checkAddress(personalInputAddress.value));
        personalInfoContent.append(personalInputFirstname, personalInputLastname, personalInputAddress);
        personalContainer.append(personalTitle, personalInfoContent);
        return personalContainer;
    }

    private createContactInfo() {
        const contactContainer = createElem(HTMLTags.DIV, 'contact-container') as HTMLDivElement;
        const contactTitle = createElem(HTMLTags.P, 'contact-title payment-title', CHECKOUT_CONTACT_INFO_TITLE);
        const contactInfoContent = createElem(HTMLTags.DIV, 'contact-info-content');
        const contactPhone = createElem(HTMLTags.INPUT, 'contact-input-phone payment-input') as HTMLInputElement;
        contactPhone.setAttribute('placeholder', ORDER_PLACEHOLDER_PHONE);
        contactPhone.setAttribute('type', INPUT_TYPE_TEXT);
        contactPhone.setAttribute('required', '');
        contactPhone.setAttribute('pattern', INPUT_TYPE_PHONE_PATTERN);
        contactPhone.addEventListener('change', () => this.checkPhone(contactPhone.value));

        const contactMail = createElem(HTMLTags.INPUT, 'contact-input-mail payment-input') as HTMLInputElement;
        contactMail.setAttribute('placeholder', ORDER_PLACEHOLDER_MAIL);
        contactMail.setAttribute('type', INPUT_TYPE_TEXT);
        contactMail.setAttribute('required', '');
        contactMail.setAttribute('pattern', INPUT_TYPE_MAIL_PATTERN);
        contactMail.addEventListener('change', () => this.checkMail(contactMail.value));

        const contactAgreeContainer = createElem(HTMLTags.DIV, 'contact-agree-container');

        this.contactAgree.setAttribute('type', 'checkbox');
        this.contactAgree.setAttribute('id', 'license');
        const contactAgreeLabel = createElem(
            HTMLTags.LABEL,
            'contact-label-argeement',
            CHECKOUT_LICENSE_AGREEMENT_TEXT
        );
        contactAgreeLabel.setAttribute('for', 'license');
        contactAgreeContainer.append(this.contactAgree, contactAgreeLabel);

        contactInfoContent.append(contactPhone, contactMail, contactAgreeContainer);
        contactContainer.append(contactTitle, contactInfoContent);
        return contactContainer;
    }

    private createPaymentInfo() {
        const paymentContainer = createElem(HTMLTags.DIV, 'payment-container') as HTMLDivElement;
        const paymentTitle = createElem(HTMLTags.P, 'payment-title payment-title', CHECKOUT_PAYMENT_INFO_TITLE);
        const paymentlInfoContent = createElem(HTMLTags.DIV, 'payment-info-content');
        const paymentInputCardContainer = createElem(HTMLTags.DIV, 'payment-input-card-container');
        const paymentSystemLogo = createElem(HTMLTags.SPAN, 'payment-system-logo logo');
        const paymentInputCard = (createElem(
            HTMLTags.INPUT,
            'payment-input-card payment-input'
        ) as unknown) as HTMLInputElement;
        paymentInputCard.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD);
        paymentInputCard.setAttribute('type', INPUT_TYPE_NUMBER);
        paymentInputCard.setAttribute('min', '1000000000000000');
        paymentInputCard.setAttribute('max', '9999999999999999');
        paymentInputCard.setAttribute('required', '');
        paymentInputCard.setAttribute('pattern', INPUT_TYPE_CARD_NUMBER_PATTERN);
        paymentInputCard.addEventListener('input', () => {
            this.checkCardNumber(paymentInputCard.value);
            paymentInputCard.value = paymentInputCard.value.slice(0, 16);
            const paymentSstemLogoClass = this.checkCardNumber(paymentInputCard.value);
            if (paymentSstemLogoClass) {
                paymentSystemLogo.classList.remove('visa-logo');
                paymentSystemLogo.classList.remove('mastercard-logo');
                paymentSystemLogo.classList.remove('a-express-logo');
                paymentSystemLogo.classList.remove('nocard-logo');
                paymentSystemLogo.classList.add(paymentSstemLogoClass);
            }
        });
        paymentInputCardContainer.append(paymentSystemLogo, paymentInputCard);

        const paymentInputValid = createElem(HTMLTags.INPUT, 'payment-input-valid payment-input') as HTMLInputElement;
        paymentInputValid.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_VALID);
        paymentInputValid.setAttribute('type', INPUT_TYPE_TEXT);
        paymentInputValid.setAttribute('required', '');
        paymentInputValid.setAttribute('pattern', INPUT_TYPE_CARD_VALID_TIME_PATTERN);
        paymentInputValid.addEventListener('input', () => {
            this.checkCardValid(paymentInputValid);
        });

        const paymentInputCvv = createElem(HTMLTags.INPUT, 'payment-input-cvv payment-input') as HTMLInputElement;
        paymentInputCvv.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_CVV);
        paymentInputCvv.setAttribute('type', INPUT_TYPE_NUMBER);
        paymentInputCvv.setAttribute('min', '100');
        paymentInputCvv.setAttribute('max', '999');
        paymentInputCvv.setAttribute('required', '');
        paymentInputCvv.setAttribute('pattern', INPUT_TYPE_CARD_CVV_PATTERN);
        paymentInputCvv.addEventListener('input', () => {
            paymentInputCvv.value = paymentInputCvv.value.slice(0, 3);
            this.checkCardCVV(paymentInputCvv.value);
        });

        paymentlInfoContent.append(paymentInputCardContainer, paymentInputValid, paymentInputCvv);

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
        document.body.addEventListener('click', (e: MouseEvent) => {
            this.checkClickWhenOrderOpen(e);
        });
    }

    public hideModal() {
        this.container.classList.remove('popup_active');
        document.body.classList.remove('inactive-order');
        document.body.removeEventListener('click', (e: MouseEvent) => {
            this.checkClickWhenOrderOpen(e);
        });
    }

    private checkClickWhenOrderOpen(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const currentTarget = e.currentTarget as HTMLElement;
        if (target.classList.contains('inactive-order') && !currentTarget.classList.contains('order-container')) {
            this.hideModal();
        }
    }

    private checkIsUserAgree() {
        if (this.contactAgree.checked) {
            this.agree = true;
            return true;
        }
        this.agree = false;
        return false;
    }

    private checkFirstName(firstname: string) {
        this.firstname = firstname;
    }

    private checkLastName(lastname: string) {
        this.lastname = lastname;
    }

    private checkAddress(address: string) {
        this.address = address;
    }

    private checkPhone(contactPhone: string) {
        this.phone = contactPhone;
    }

    private checkMail(contactMail: string) {
        this.mail = contactMail;
    }

    private checkCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber;
        const paymentSystemIdStr = cardNumber.slice(0, 1);
        const paymentSystemId = Number(paymentSystemIdStr);
        switch (paymentSystemId) {
            case 4:
                return 'visa-logo';
            case 5:
                return 'mastercard-logo';
            case 3:
                return 'a-express-logo';
            default:
                return 'nocard-logo';
        }
    }

    private checkCardValid(paymentInputValid: HTMLInputElement) {
        if (!paymentInputValid.value.match(/[0-9]/g)) {
            paymentInputValid.value = '';
            return;
        }
        if (paymentInputValid.value.length === 3) {
            if (paymentInputValid.value[2] === '/') {
                return;
            } else {
                paymentInputValid.value = paymentInputValid.value
                    .split('')
                    .map((item, index) => {
                        if (index === 2) {
                            return (item = `/${item}`);
                        } else {
                            return item;
                        }
                    })
                    .join('');
            }
        }
        if (paymentInputValid.value.length > 5) {
            paymentInputValid.value = paymentInputValid.value.substring(0, 5);
            this.cardValidTime = paymentInputValid.value;
        }
    }

    private checkCardCVV(paymentInputCvv: string) {
        this.cvv = paymentInputCvv;
    }

    private checkAllInputsFull() {
        if (
            this.firstname.length !== 0 &&
            this.lastname.length !== 0 &&
            this.address.length !== 0 &&
            this.phone.length !== 0 &&
            this.mail.length !== 0 &&
            this.cardNumber.length !== 0 &&
            this.cardValidTime.length !== 0 &&
            this.cvv.length !== 0 &&
            !this.agree
        ) {
            alert('Please checkout again and agree with Private Police');
            this.eraseAllInputWithSavedInfo();
        } else if (
            this.firstname.length !== 0 &&
            this.lastname.length !== 0 &&
            this.address.length !== 0 &&
            this.phone.length !== 0 &&
            this.mail.length !== 0 &&
            this.cardNumber.length !== 0 &&
            this.cardValidTime.length !== 0 &&
            this.cvv.length !== 0 &&
            this.agree
        ) {
            setTimeout(() => {
                this.appController.router.changeCurrentPage(LINKS.About);
            }, 3000);
            alert('Your order has been placed. Thank you!\nYou will be redirected to main page');
            this.appController.cartModel.eraseAllAfterPurchaseg();
            this.hideModal();
            this.agree = false;
            this.eraseAllInputWithSavedInfo();
        }
    }

    private eraseAllInputWithSavedInfo() {
        this.firstname = '';
        this.lastname = '';
        this.address = '';
        this.phone = '';
        this.mail = '';
        this.agree = false;
        this.cardNumber = '';
        this.cardValidTime = '';
        this.cvv = '';
        this.contactAgree.checked = false;
    }
}
