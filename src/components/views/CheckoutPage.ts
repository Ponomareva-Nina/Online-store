import { ClassNames } from '../../constants/classnames-constants';
import { LINKS } from '../../constants/route-constants';
import {
    CHECKOUT_BUTTON_CONTENT,
    CHECKOUT_CONTACT_INFO_TITLE,
    CHECKOUT_FILL_INPUTS_TEXT,
    CHECKOUT_LICENSE_AGREEMENT_TEXT,
    CHECKOUT_PAYMENT_INFO_TITLE,
    CHECKOUT_PERSONAL_INFO_TITLE,
    CHECKOUT_SUCCESS_TEXT,
    CREDIT_CARD_MAXIMUM_VALUE,
    CREDIT_CARD_MINIMUM_VALUE,
    CREDIT_CART_MAXIMUM_CVV,
    CREDIT_CART_MINIMUM_CVV,
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
    SLASH_SEPARATOR,
} from '../../constants/string-constants';
import { ICheckoutCard } from '../../types/interfaces';
import { HTMLTags, NullableElement } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class CheckoutPage implements ICheckoutCard {
    public appController: AppController;
    public container: HTMLDivElement;
    private contactAgree: HTMLInputElement;
    private firstname: NullableElement<HTMLInputElement>;
    private lastname: NullableElement<HTMLInputElement>;
    private address: NullableElement<HTMLInputElement>;
    private phone: NullableElement<HTMLInputElement>;
    private mail: NullableElement<HTMLInputElement>;
    private cardNumber: NullableElement<HTMLInputElement>;
    private cardValidTime: NullableElement<HTMLInputElement>;
    private cvv: NullableElement<HTMLInputElement>;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = createElem<HTMLDivElement>(HTMLTags.DIV, 'order-container') as HTMLDivElement;
        this.contactAgree = createElem<HTMLInputElement>(HTMLTags.INPUT, 'contact-input-argeement') as HTMLInputElement;
        this.firstname = null;
        this.lastname = null;
        this.address = null;
        this.phone = null;
        this.mail = null;
        this.cardNumber = null;
        this.cardValidTime = null;
        this.cvv = null;
    }

    public createPayCard(): HTMLDivElement {
        this.appController.destroyAllChildNodes(this.container);
        const form = createElem<HTMLFormElement>('form', 'ordere-form');
        const orderTitle = createElem<HTMLElement>(HTMLTags.P, 'page-header', ORDER_TITLE);
        const personalInfoBlock = this.createPersonalInfo();
        const contactInfoBlock = this.createContactInfo();
        const paymentInfoBlock = this.createPaymentInfo();

        const checkoutButtonContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'checkout-container');
        const checkoutButton = createElem<HTMLInputElement>(HTMLTags.INPUT, 'btn checkout-button');
        checkoutButton.setAttribute('type', 'submit');
        checkoutButton.setAttribute('value', CHECKOUT_BUTTON_CONTENT);
        checkoutButton.addEventListener('click', () => {
            this.checkAllInputsFull();
        });
        checkoutButtonContainer.append(checkoutButton);
        form.append(personalInfoBlock, contactInfoBlock, paymentInfoBlock, checkoutButtonContainer);
        this.container.append(orderTitle, form);
        return this.container;
    }

    private createPersonalInfo(): HTMLDivElement {
        const personalContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'personal-container') as HTMLDivElement;
        const personalTitle = createElem<HTMLElement>(
            HTMLTags.P,
            'personal-title payment-title',
            CHECKOUT_PERSONAL_INFO_TITLE
        );
        const personalInfoContent = createElem<HTMLDivElement>(HTMLTags.DIV, 'personal-info-content');
        const personalInputFirstname = createElem(
            HTMLTags.INPUT,
            'personal-input-firstname payment-input'
        ) as HTMLInputElement;
        personalInputFirstname.setAttribute('placeholder', ORDER_PLACEHOLDER_FIRSTNAME);
        personalInputFirstname.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputFirstname.setAttribute('required', '');
        personalInputFirstname.setAttribute('pattern', INPUT_STRING_FIRSTNAME_LASTNAME_PATTERN);
        personalInputFirstname.addEventListener('input', () => this.checkFirstName(personalInputFirstname));

        const personalInputLastname = createElem(
            HTMLTags.INPUT,
            'personal-input-lastname payment-input'
        ) as HTMLInputElement;
        personalInputLastname.setAttribute('placeholder', ORDER_PLACEHOLDER_LASTNAME);
        personalInputLastname.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputLastname.setAttribute('required', '');
        personalInputLastname.setAttribute('pattern', INPUT_STRING_FIRSTNAME_LASTNAME_PATTERN);
        personalInputLastname.addEventListener('input', () => this.checkLastName(personalInputLastname));

        const personalInputAddress = createElem(
            HTMLTags.INPUT,
            'personal-input-address payment-input'
        ) as HTMLInputElement;
        personalInputAddress.setAttribute('placeholder', ORDER_PLACEHOLDER_ADDRESS);
        personalInputAddress.setAttribute('type', INPUT_TYPE_TEXT);
        personalInputAddress.setAttribute('required', '');
        personalInputAddress.setAttribute('pattern', INPUT_STRING_ADDRESS_PATTERN);
        personalInputAddress.addEventListener('input', () => this.checkAddress(personalInputAddress));
        personalInfoContent.append(personalInputFirstname, personalInputLastname, personalInputAddress);
        personalContainer.append(personalTitle, personalInfoContent);
        return personalContainer;
    }

    private createContactInfo(): HTMLDivElement {
        const contactContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'contact-container') as HTMLDivElement;
        const contactTitle = createElem<HTMLElement>(
            HTMLTags.P,
            'contact-title payment-title',
            CHECKOUT_CONTACT_INFO_TITLE
        );
        const contactInfoContent = createElem<HTMLDivElement>(HTMLTags.DIV, 'contact-info-content');
        const contactPhone = createElem<HTMLInputElement>(
            HTMLTags.INPUT,
            'contact-input-phone payment-input'
        ) as HTMLInputElement;
        contactPhone.setAttribute('placeholder', ORDER_PLACEHOLDER_PHONE);
        contactPhone.setAttribute('type', INPUT_TYPE_TEXT);
        contactPhone.setAttribute('required', '');
        contactPhone.setAttribute('pattern', INPUT_TYPE_PHONE_PATTERN);
        contactPhone.addEventListener('input', () => this.checkPhone(contactPhone));

        const contactMail = createElem<HTMLInputElement>(
            HTMLTags.INPUT,
            'contact-input-mail payment-input'
        ) as HTMLInputElement;
        contactMail.setAttribute('placeholder', ORDER_PLACEHOLDER_MAIL);
        contactMail.setAttribute('type', INPUT_TYPE_TEXT);
        contactMail.setAttribute('required', '');
        contactMail.setAttribute('pattern', INPUT_TYPE_MAIL_PATTERN);
        contactMail.addEventListener('input', () => this.checkMail(contactMail));

        const contactAgreeContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'contact-agree-container');

        this.contactAgree.setAttribute('type', 'checkbox');
        this.contactAgree.setAttribute('required', '');
        this.contactAgree.setAttribute('id', 'license');
        const contactAgreeLabel = createElem<HTMLLabelElement>(
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

    private createPaymentInfo(): HTMLDivElement {
        const paymentContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'payment-container') as HTMLDivElement;
        const paymentTitle = createElem<HTMLElement>(
            HTMLTags.P,
            'payment-title payment-title',
            CHECKOUT_PAYMENT_INFO_TITLE
        );
        const paymentlInfoContent = createElem<HTMLDivElement>(HTMLTags.DIV, 'payment-info-content');
        const paymentInputCardContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'payment-input-card-container');
        const paymentSystemLogo = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'payment-system-logo logo');
        const paymentInputCard = (createElem<HTMLInputElement>(
            HTMLTags.INPUT,
            'payment-input-card payment-input'
        ) as unknown) as HTMLInputElement;
        paymentInputCard.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD);
        paymentInputCard.setAttribute('type', INPUT_TYPE_NUMBER);
        paymentInputCard.setAttribute('min', CREDIT_CARD_MINIMUM_VALUE);
        paymentInputCard.setAttribute('max', CREDIT_CARD_MAXIMUM_VALUE);
        paymentInputCard.setAttribute('required', '');
        paymentInputCard.setAttribute('pattern', INPUT_TYPE_CARD_NUMBER_PATTERN);
        paymentInputCard.addEventListener('input', () => {
            this.checkCardNumber(paymentInputCard);
            paymentInputCard.value = paymentInputCard.value.slice(0, 16);
            const paymentSstemLogoClass = this.checkCardNumber(paymentInputCard);
            if (paymentSstemLogoClass) {
                paymentSystemLogo.classList.remove(ClassNames.CHECKOUT_CARD_VISA);
                paymentSystemLogo.classList.remove(ClassNames.CHECKOUT_CARD_MASTERCARD);
                paymentSystemLogo.classList.remove(ClassNames.CHECKOUT_CARD_A_EXPRESS);
                paymentSystemLogo.classList.remove(ClassNames.CHECKOUT_CARD_NO_CARD);
                paymentSystemLogo.classList.add(paymentSstemLogoClass);
            }
        });
        paymentInputCardContainer.append(paymentSystemLogo, paymentInputCard);

        const paymentInputValid = createElem<HTMLInputElement>(
            HTMLTags.INPUT,
            'payment-input-valid payment-input'
        ) as HTMLInputElement;
        paymentInputValid.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_VALID);
        paymentInputValid.setAttribute('type', INPUT_TYPE_TEXT);
        paymentInputValid.setAttribute('required', '');
        paymentInputValid.setAttribute('pattern', INPUT_TYPE_CARD_VALID_TIME_PATTERN);
        paymentInputValid.addEventListener('input', () => {
            this.checkCardValid(paymentInputValid);
        });

        const paymentInputCvv = createElem<HTMLInputElement>(
            HTMLTags.INPUT,
            'payment-input-cvv payment-input'
        ) as HTMLInputElement;
        paymentInputCvv.setAttribute('placeholder', ORDER_PLACEHOLDER_CARD_CVV);
        paymentInputCvv.setAttribute('type', INPUT_TYPE_NUMBER);
        paymentInputCvv.setAttribute('min', CREDIT_CART_MINIMUM_CVV);
        paymentInputCvv.setAttribute('max', CREDIT_CART_MAXIMUM_CVV);
        paymentInputCvv.setAttribute('required', '');
        paymentInputCvv.setAttribute('pattern', INPUT_TYPE_CARD_CVV_PATTERN);
        paymentInputCvv.addEventListener('input', () => {
            paymentInputCvv.value = paymentInputCvv.value.slice(0, 3);
            this.checkCardCVV(paymentInputCvv);
        });

        paymentlInfoContent.append(paymentInputCardContainer, paymentInputValid, paymentInputCvv);

        paymentContainer.append(paymentTitle, paymentlInfoContent);
        return paymentContainer;
    }

    public showModal(): void {
        this.container.classList.add('popup_active');
        document.body.classList.add('inactive-order');
        document.body.addEventListener('click', (e: MouseEvent) => {
            this.checkClickWhenOrderOpen(e);
        });
        this.contactAgree.checked = false;
    }

    public hideModal(): void {
        this.container.classList.remove('popup_active');
        document.body.classList.remove('inactive-order');
        document.body.removeEventListener('click', (e: MouseEvent) => {
            this.checkClickWhenOrderOpen(e);
        });
        this.contactAgree.checked = false;
    }

    private checkClickWhenOrderOpen(e: MouseEvent): void {
        const target = e.target as HTMLElement;
        const currentTarget = e.currentTarget as HTMLElement;
        if (target.classList.contains('inactive-order') && !currentTarget.classList.contains('order-container')) {
            this.hideModal();
        }
    }

    private checkFirstName(firstnameInput: HTMLInputElement): void {
        if (firstnameInput.validity.valid) {
            this.firstname = firstnameInput;
        }
    }

    private checkLastName(personalInputLastname: HTMLInputElement): void {
        if (personalInputLastname.validity.valid) {
            this.lastname = personalInputLastname;
        }
    }

    private checkAddress(personalInputAddress: HTMLInputElement): void {
        if (personalInputAddress.validity.valid) {
            this.address = personalInputAddress;
        }
    }

    private checkPhone(contactPhone: HTMLInputElement): void {
        if (contactPhone.validity.valid) {
            this.phone = contactPhone;
        }
    }

    private checkMail(contactMail: HTMLInputElement): void {
        if (contactMail.validity.valid) {
            this.mail = contactMail;
        }
    }

    private checkCardNumber(cardNumber: HTMLInputElement): string {
        const paymentSystemIdStr = cardNumber.value.slice(0, 1);
        if (cardNumber.validity.valid) {
            this.cardNumber = cardNumber;
        }
        const paymentSystemId = Number(paymentSystemIdStr);
        switch (paymentSystemId) {
            case 4:
                return ClassNames.CHECKOUT_CARD_VISA;
            case 5:
                return ClassNames.CHECKOUT_CARD_MASTERCARD;
            case 3:
                return ClassNames.CHECKOUT_CARD_A_EXPRESS;
            default:
                return ClassNames.CHECKOUT_CARD_NO_CARD;
        }
    }

    private checkCardValid(paymentInputValid: HTMLInputElement): string | undefined {
        if (!paymentInputValid.value.match(/[0-9]/g)) {
            paymentInputValid.value = '';
            return;
        }
        if (paymentInputValid.value.length === 3) {
            if (paymentInputValid.value[2] === SLASH_SEPARATOR) {
                return;
            } else {
                paymentInputValid.value = paymentInputValid.value
                    .split('')
                    .map((item, index) => {
                        if (index === 2) {
                            return (item = `${SLASH_SEPARATOR}${item}`);
                        } else {
                            return item;
                        }
                    })
                    .join('');
            }
        }
        if (paymentInputValid.value.length > 5) {
            paymentInputValid.value = paymentInputValid.value.substring(0, 5);
        }
        if (paymentInputValid.validity.valid) {
            this.cardValidTime = paymentInputValid;
        }
    }

    private checkCardCVV(paymentInputCvv: HTMLInputElement): void {
        if (paymentInputCvv.validity.valid) {
            this.cvv = paymentInputCvv;
        }
    }

    private checkAllInputsFull(): void {
        if (
            this.firstname?.validity.valid &&
            this.lastname?.validity.valid &&
            this.address?.validity.valid &&
            this.phone?.validity.valid &&
            this.mail?.validity.valid &&
            this.cardNumber?.validity.valid &&
            this.cardValidTime?.validity.valid &&
            this.cvv?.validity.valid &&
            this.contactAgree.checked
        ) {
            setTimeout(() => {
                this.appController.router.changeCurrentPage(LINKS.About);
            }, 3000);
            alert(CHECKOUT_SUCCESS_TEXT);
            this.appController.cartModel.eraseAllAfterPurchaseg();
            this.hideModal();
            this.eraseAllInputWithSavedInfo();
        } else {
            alert(CHECKOUT_FILL_INPUTS_TEXT);
        }
    }

    private eraseAllInputWithSavedInfo(): void {
        this.firstname = null;
        this.lastname = null;
        this.address = null;
        this.phone = null;
        this.mail = null;
        this.cardNumber = null;
        this.cardValidTime = null;
        this.cvv = null;
    }
}
