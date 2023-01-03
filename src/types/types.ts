export type NullableElement<T> = T | null;

export enum PossibleUrlParams {
    ID = 'id',
    CATEGORY = 'category',
    FACULTY = 'faculty',
    SORT = 'sort',
    PRICE = 'price',
    STOCK = 'stock',
}

export type MethodVoid = () => void;

export enum HTMLElements {
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
}
