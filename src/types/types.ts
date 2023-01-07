export type NullableElement<T> = T | null;

export enum PossibleUrlParams {
    ID = 'id',
    CATEGORY = 'category',
    FACULTY = 'faculty',
    SORT = 'sort',
    PRICE = 'price',
    STOCK = 'stock',
    SEARCH = 'search',
}

export type MethodVoid = () => void;

export enum HTMLTags {
    PAGE_HEADER = 'h1',
    H2 = 'h2',
    SECTION = 'section',
    DIV = 'div',
    BUTTON = 'button',
    SPAN = 'span',
    LINK = 'a',
    NAV = 'nav',
    LIST = 'li',
    UL = 'ul',
    INPUT = 'input',
    LABEL = 'label',
    P = 'p',
    IMG = 'img',
    H3 = 'h3',
}

export enum SortOptions {
    MIN_PRICE = 'min-price',
    MAX_PRICE = 'max-price',
    DISCOUNT = 'discount',
}

export enum SortLabels {
    MIN_PRICE = 'Price (low to high)',
    MAX_PRICE = 'Price (high to low)',
    DISCOUNT = 'Discount',
}
