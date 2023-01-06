import { createElem } from '../../utils/utils';
import { HTMLTags } from '../../types/types';
import { ClassNames } from '../../constants/classnames-constants';

export default class FiltersPanel {
    public container: DocumentFragment;

    constructor() {
        this.container = document.createDocumentFragment();
    }

    createSearchInput() {
        const componentContainer = createElem(HTMLTags.DIV, ClassNames.SEARCH_INPUT_CONTAINER);
        const inputEl = createElem(HTMLTags.INPUT, ClassNames.SEARCH_INPUT);
        inputEl.setAttribute('type', 'text');
        componentContainer.append(inputEl);
        return componentContainer;
    }
}
