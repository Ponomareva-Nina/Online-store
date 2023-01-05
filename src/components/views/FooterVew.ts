import { HTMLTags } from '../../types/types';
import { createElem, createWelcomeLine } from '../../utils/utils';

export default class Footer {
    container: HTMLElement;
    wrapper: HTMLElement;

    constructor() {
        this.wrapper = createElem(HTMLTags.DIV, 'wrapper');
        this.container = createElem('footer', 'footer');
    }

    private createFooterContent() {
        const footerContainer = createElem(HTMLTags.DIV, 'footer-content');
        const authorsContainer = createElem(HTMLTags.DIV, 'authors-content');
        const authorFirst = this.createAuthorGithub('Ponomareva-Nina', 'https://github.com/Ponomareva-Nina');
        const authorSecond = this.createAuthorGithub('Milashevsky-Vladimir', 'https://github.com/VladimirM89');
        const rsContainer = this.createRsContainer();
        authorsContainer.append(authorFirst, authorSecond);
        footerContainer.append(authorsContainer, rsContainer);
        this.wrapper.append(footerContainer);
        return this.wrapper;
    }

    private createAuthorGithub(name: string, link: string) {
        const autorContainer = createElem(HTMLTags.DIV, 'author-container');
        const a = createElem(HTMLTags.LINK, 'footer__link');
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        const gitLogo = createElem(HTMLTags.SPAN, 'git-logo');
        const gitUsername = createElem(HTMLTags.SPAN, 'git-username');
        gitUsername.textContent = name;
        a.append(gitLogo, gitUsername);
        autorContainer.append(a);
        return autorContainer;
    }

    private createRsContainer() {
        const rsContainer = createElem(HTMLTags.DIV, 'rs-container');
        const a = createElem(HTMLTags.LINK);
        const link = 'https://github.com/rolling-scopes-school/tasks/tree/master/tasks/online-store-team';
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        const rsLogo = createElem(HTMLTags.SPAN, 'rs-logo');
        const flash = createElem(HTMLTags.SPAN, 'flash');
        const year = createElem(HTMLTags.SPAN, 'year');
        year.textContent = '2022';
        a.append(rsLogo);
        rsContainer.append(a, flash, year);
        return rsContainer;
    }

    public renderFooter() {
        const line = createWelcomeLine();
        const footer = this.createFooterContent();
        this.container.append(line, footer);
        return this.container;
    }
}
