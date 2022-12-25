import { viewComponent } from '../../types/interfaces';

export default class Route {
    pageName: string;
    path: string;
    view: viewComponent;

    constructor(name: string, path: string, view: viewComponent) {
        this.pageName = name;
        this.path = path;
        this.view = view;
    }

    getView() {
        return this.view;
    }
}
