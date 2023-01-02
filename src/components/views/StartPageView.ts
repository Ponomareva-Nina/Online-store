import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class StartPageView {
    container: DocumentFragment;
    appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
    }

    private createPage() {
        const title = createElem('h1', 'title', 'Start Page');
        this.container.append(title);
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
