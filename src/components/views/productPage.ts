import { Props, viewComponent } from '../../types/interfaces';
import createElem from '../../utils/utils';
import AppController from '../app/app';

export default class ProductPage implements viewComponent {
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
        const title = createElem('h1', 'title', 'Product Page');
        const productNumber = createElem('span', '', productId.toString());
        this.container.append(title, productNumber);
    }

    public render(props?: Props) {
        if (props && props['id']) {
            this.createPage(props['id']);
        }

        return this.container;
    }
}
