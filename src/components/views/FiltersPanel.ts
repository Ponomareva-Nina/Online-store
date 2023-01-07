import { createElem } from '../../utils/utils';
import { HTMLTags } from '../../types/types';
import { ClassNames } from '../../constants/classnames-constants';
import { SEARCH_INPUT_PLACEHOLDER } from '../../constants/string-constants';

export default class FiltersPanel {
    public container: DocumentFragment;

    constructor() {
        this.container = document.createDocumentFragment();
    }

    createSearchInput() {
        const componentContainer = createElem(HTMLTags.DIV, ClassNames.SEARCH_INPUT_CONTAINER);
        const inputEl = createElem(HTMLTags.INPUT, ClassNames.SEARCH_INPUT) as HTMLInputElement;
        inputEl.setAttribute('type', 'text');
        inputEl.setAttribute('id', 'search');
        inputEl.setAttribute('placeholder', SEARCH_INPUT_PLACEHOLDER);
        const inputLabel = createElem(HTMLTags.LABEL, ClassNames.SEARCH_INPUT_LABEL);
        inputLabel.setAttribute('for', 'search');
        componentContainer.append(inputLabel, inputEl);
        return [inputEl, componentContainer];
    }
}
