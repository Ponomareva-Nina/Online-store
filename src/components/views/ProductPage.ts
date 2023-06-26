import { LINK_TO_404_PAGE } from '../../constants/source-constants';
import { Props, ViewComponent } from '../../types/interfaces';
import AppController from '../app/app';
import ProductCard from './ProductCard';

export default class ProductPage implements ViewComponent {
    public container: DocumentFragment;
    public appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
    }

    private createPage(productId: number): void {
        const data = this.appController.storeModel.getProductById(productId);
        if (data) {
            const card = new ProductCard(data, this.appController);
            const cardView = card.createFullCard();
            this.container.append(cardView);
        } else {
            window.location.href = LINK_TO_404_PAGE;
        }
    }

    public render(props?: Props): DocumentFragment {
        if (props && props['id']) {
            const id = Number(props['id']);
            this.createPage(id);
        }
        return this.container;
    }
}
