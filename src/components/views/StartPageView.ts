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

    private createAboutContainer(): HTMLDivElement {
        const aboutContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'about-container');
        const titleAbout = createElem<HTMLElement>(HTMLTags.H2, 'page-header', START_PAGE_TITLE_ABOUT);
        const descriptionAbout = createElem<HTMLElement>(HTMLTags.P, 'text-description', START_PAGE_ABOUT_DESCR);
        const imgAbout = createElem<HTMLDivElement>(HTMLTags.DIV, 'img-description');
        imgAbout.append(descriptionAbout);
        aboutContainer.append(titleAbout, imgAbout);
        return aboutContainer;
    }

    private createTrendsContainer(): HTMLDivElement {
        const trendsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'trends-container');
        const titleTrends = createElem<HTMLElement>(HTMLTags.H2, 'page-header', START_PAGE_TITLE_TRENDS);
        trendsContainer.append(titleTrends);
        return trendsContainer;
    }

    private createButton(): HTMLDivElement {
        const buttonContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'button-container');
        const buttonStart = createElem<HTMLButtonElement>(HTMLTags.BUTTON, 'btn button-start', START_PAGE_BUTTON);
        const linkButton = createElem<HTMLLinkElement>(HTMLTags.LINK, 'link-button');
        linkButton.setAttribute('href', LINKS.Store);
        linkButton.addEventListener('click', () => {
            this.appController.router.changeCurrentPage(LINKS.Store);
        });
        linkButton.append(buttonStart);
        buttonContainer.append(linkButton);
        return buttonContainer;
    }

    private createPage(): void {
        this.appController.destroyAllChildNodes(this.container);
        const about = this.createAboutContainer();
        const button = this.createButton();
        this.container.append(about, button);
    }

    public render(): DocumentFragment {
        this.createPage();
        return this.container;
    }
}
