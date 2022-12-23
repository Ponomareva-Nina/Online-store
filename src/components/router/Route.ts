import { Props, viewComponent } from '../../types/interfaces';

export default class Route {
    pageName: string;
    path: string;
    view: viewComponent;
    props: Props | null;

    constructor(name: string, path: string, view: viewComponent) {
        this.pageName = name;
        this.path = path;
        this.view = view;
        this.props = null;
    }

    setProps() {
        // добавляет в this.props нужного пути значения (id / category / faculty / sort / price / stock)
    }

    getProps() {
        return this.props;
    }

    getView() {
        return this.view;
    }
}
