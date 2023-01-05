import { AUTHOR_FIRST_GIT_LINK, AUTHOR_SECOND_GIT_LINK, TASK_LINK } from '../../constants/source-constants';
import { AUTHOR_FIRST, AUTHOR_SECOND, YEAR } from '../../constants/string-constants';
import { IFooter } from '../../types/interfaces';
import { HTMLTags } from '../../types/types';
import { createElem, createWelcomeLine } from '../../utils/utils';

export default class Footer implements IFooter {
    container: HTMLDivElement;
    wrapper: HTMLDivElement;

    constructor() {
        this.wrapper = createElem(HTMLTags.DIV, 'wrapper') as HTMLDivElement;
        this.container = createElem('footer', 'footer') as HTMLDivElement;
    }

    private createFooterContent() {
        const footerContainer = createElem(HTMLTags.DIV, 'footer-content');
        const authorsContainer = createElem(HTMLTags.DIV, 'authors-content');
        const authorFirst = this.createAuthorGithub(AUTHOR_FIRST, AUTHOR_FIRST_GIT_LINK);
        const authorSecond = this.createAuthorGithub(AUTHOR_SECOND, AUTHOR_SECOND_GIT_LINK);
        const rsContainer = this.createRsContainer();
        authorsContainer.append(authorFirst, authorSecond);
        footerContainer.append(authorsContainer, rsContainer);
        this.wrapper.append(footerContainer);
        return this.wrapper;
    }

    private createAuthorGithub(name: string, link: string) {
        const autorContainer = createElem(HTMLTags.DIV, 'author-container');
        const gitLink = createElem(HTMLTags.LINK, 'git__link');
        gitLink.setAttribute('href', link);
        gitLink.setAttribute('target', '_blank');
        const gitLogo = createElem(HTMLTags.SPAN, 'git-logo');
        const gitUsername = createElem(HTMLTags.SPAN, 'git-username');
        gitUsername.textContent = name;
        gitLink.append(gitLogo, gitUsername);
        autorContainer.append(gitLink);
        return autorContainer;
    }

    private createRsContainer() {
        const rsContainer = createElem(HTMLTags.DIV, 'rs-container');
        const taskLink = createElem(HTMLTags.LINK);
        taskLink.setAttribute('href', TASK_LINK);
        taskLink.setAttribute('target', '_blank');
        const rsLogo = createElem(HTMLTags.SPAN, 'rs-logo');
        const flash = createElem(HTMLTags.SPAN, 'flash');
        const year = createElem(HTMLTags.SPAN, 'year', YEAR);
        taskLink.append(rsLogo);
        rsContainer.append(taskLink, flash, year);
        return rsContainer;
    }

    public renderFooter() {
        const line = createWelcomeLine();
        const footer = this.createFooterContent();
        this.container.append(line, footer);
        return this.container;
    }
}
