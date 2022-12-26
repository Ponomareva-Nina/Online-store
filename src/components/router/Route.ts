import { Props, viewComponent } from '../../types/interfaces';
import { PossibleUrlParams } from '../../types/types';

export default class Route {
    pageName: string;
    path: string;
    view: viewComponent;
    parameters: Props;

    constructor(name: string, path: string, view: viewComponent) {
        this.pageName = name;
        this.path = path;
        this.view = view;
        this.parameters = {};
    }

    addParameter(name: PossibleUrlParams, value: string) {
        const paramsArr = this.parameters[name];
        if (paramsArr && Array.isArray(paramsArr)) {
            paramsArr.push(value);
            this.parameters[name] = paramsArr;
        } else {
            const newParam = new Array(value);
            this.parameters[name] = newParam;
        }
    }

    deleteParameter(name: PossibleUrlParams, value: string) {
        const index = this.parameters[name]?.indexOf(value) as number;
        if (index !== -1) {
            this.parameters[name]?.splice(index, 1);
        }
    }

    getParameters() {
        return this.parameters;
    }

    getView() {
        return this.view;
    }
}
