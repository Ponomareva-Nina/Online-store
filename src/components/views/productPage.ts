import { Props, ViewComponent } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class ProductPage implements ViewComponent {
    container: DocumentFragment;
    appController: AppController;
    productId: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
        this.productId = 0;
    }

    private createPage(productId: number) {
        this.productId = productId;
        const title = createElem(HTMLTags.PAGE_HEADER, 'title', 'Product Page');
        const productNumber = createElem(HTMLTags.SPAN, '', productId.toString());
        this.container.append(title, productNumber);
    }

    public render(props?: Props) {
        if (props && props['id']) {
            this.createPage(Number(props['id']));
        }

        return this.container;
    }
}
