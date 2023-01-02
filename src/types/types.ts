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
    PAGE_H2 = 'h2',
    TAG_DIV = 'div',
    TAG_SPAN = 'span',
    TAG_LINK = 'a',
    TAG_NAV = 'nav',
    TAG_UL = 'ul',
    TAG_LIST = 'li',
}
