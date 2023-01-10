import { LINKS } from '../../constants/route-constants';
import {
    START_PAGE_ABOUT_DESCR,
    START_PAGE_BUTTON,
    START_PAGE_TITLE_ABOUT,
    START_PAGE_TITLE_TRENDS,
} from '../../constants/string-constants';
import { HTMLTags } from '../../types/types';
import { createElem } from '../../utils/utils';
import AppController from '../app/app';

export default class StartPageView {
    public container: DocumentFragment;
    public appController: AppController;

    constructor(controller: AppController) {
        this.appController = controller;
        this.container = document.createDocumentFragment();
    }

    private createAboutContainer() {
        const aboutContainer = createElem(HTMLTags.DIV, 'about-container');
        const titleAbout = createElem(HTMLTags.H2, 'page-header', START_PAGE_TITLE_ABOUT);
        const descriptionAbout = createElem(HTMLTags.P, 'text-description', START_PAGE_ABOUT_DESCR);
        const imgAbout = createElem(HTMLTags.DIV, 'img-description');
        imgAbout.append(descriptionAbout);
        aboutContainer.append(titleAbout, imgAbout);
        return aboutContainer;
    }

    private createTrendsContainer() {
        const trendsContainer = createElem(HTMLTags.DIV, 'trends-container');
        const titleTrends = createElem(HTMLTags.H2, 'page-header', START_PAGE_TITLE_TRENDS);
        trendsContainer.append(titleTrends);
        return trendsContainer;
    }

    private createButton() {
        const buttonContainer = createElem(HTMLTags.DIV, 'button-container');
        const buttonStart = createElem(HTMLTags.BUTTON, 'btn button-start', START_PAGE_BUTTON);
        const linkButton = createElem(HTMLTags.LINK, 'link-button');
        linkButton.setAttribute('href', LINKS.Store);
        linkButton.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const href = target.getAttribute('href') || '';
            this.appController.router.changeCurrentPage(href);
        });
        linkButton.append(buttonStart);
        buttonContainer.append(linkButton);
        return buttonContainer;
    }

    private createPage() {
        this.destroyAllChildNodes(this.container);
        const about = this.createAboutContainer();
        //const trends = this.createTrendsContainer();
        const button = this.createButton();
        this.container.append(about /*, trends*/, button);
    }

    private destroyAllChildNodes(parent: Node) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    public render() {
        this.createPage();
        return this.container;
    }
}
