import { AUTHOR_FIRST_GIT_LINK, AUTHOR_SECOND_GIT_LINK, TASK_LINK } from '../../constants/source-constants';
import { AUTHOR_FIRST, AUTHOR_SECOND, YEAR } from '../../constants/string-constants';
import { IFooter } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem, createWelcomeLine } from '../../utils/utils';

export default class Footer implements IFooter {
    public container: HTMLDivElement;
    public wrapper: HTMLDivElement;

    constructor() {
        this.wrapper = createElem<HTMLDivElement>(HTMLTags.DIV, 'wrapper');
        this.container = createElem<HTMLDivElement>('footer', 'footer');
    }

    private createFooterContent(): HTMLDivElement {
        const footerContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'footer-content');
        const authorsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'authors-content');
        const authorFirst = this.createAuthorGithub(AUTHOR_FIRST, AUTHOR_FIRST_GIT_LINK);
        const authorSecond = this.createAuthorGithub(AUTHOR_SECOND, AUTHOR_SECOND_GIT_LINK);
        const rsContainer = this.createRsContainer();
        authorsContainer.append(authorFirst, authorSecond);
        footerContainer.append(authorsContainer, rsContainer);
        this.wrapper.append(footerContainer);
        return this.wrapper;
    }

    private createAuthorGithub(name: string, link: string): HTMLDivElement {
        const autorContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'author-container');
        const gitLink = createElem<HTMLLinkElement>(HTMLTags.LINK, 'git__link');
        gitLink.setAttribute('href', link);
        gitLink.setAttribute('target', '_blank');
        const gitLogo = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'git-logo');
        const gitUsername = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'git-username');
        gitUsername.textContent = name;
        gitLink.append(gitLogo, gitUsername);
        autorContainer.append(gitLink);
        return autorContainer;
    }

    private createRsContainer(): HTMLDivElement {
        const rsContainer = createElem<HTMLDivElement>(HTMLTags.DIV, 'rs-container');
        const taskLink = createElem<HTMLLinkElement>(HTMLTags.LINK, 'course-link');
        taskLink.setAttribute('href', TASK_LINK);
        taskLink.setAttribute('target', '_blank');
        const rsLogo = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'rs-logo');
        const flash = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'flash');
        const year = createElem<HTMLSpanElement>(HTMLTags.SPAN, 'year', YEAR);
        taskLink.append(rsLogo);
        rsContainer.append(taskLink, flash, year);
        return rsContainer;
    }

    public renderFooter(): HTMLDivElement {
        const line = createWelcomeLine();
        const footer = this.createFooterContent();
        this.container.append(line, footer);
        return this.container;
    }
}
