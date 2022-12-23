import { viewComponent } from '../../types/interfaces';

export default class Route {
    name: string;
    path: string;
    view: viewComponent;
    props: object | null;

    constructor(name: string, path: string, view: viewComponent) {
        this.name = name;
        this.path = path;
        this.view = view;
        this.props = null;
    }

    getView() {
        return this.view;
    }
}
