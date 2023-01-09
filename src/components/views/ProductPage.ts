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

    private createPage(productId: number) {
        const data = this.appController.storeModel.getProductById(productId);
        if (data) {
            const card = new ProductCard(data, this.appController);
            const cardView = card.createFullCard();
            this.container.append(cardView);
        } else {
            window.location.href = 'https://Ponomareva-Nina.github.io/Online-store/404.html';
        }
    }

    public render(props?: Props) {
        if (props && props['id']) {
            const id = Number(props['id']);
            this.createPage(id);
        }
        return this.container;
    }
}
