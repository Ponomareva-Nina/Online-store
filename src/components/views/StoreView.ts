import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class StoreView {
    container: DocumentFragment;
    appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
    }

    private createPage() {
        const className = 'main';
        const text = 'MERCH FOR WIZZARDS AND MUGGLES';
        const header = createElem(HTMLTags.PAGE_HEADER, className, text);
        this.container.append(header);
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
