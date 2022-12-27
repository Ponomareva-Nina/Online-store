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

    public addParameter(name: PossibleUrlParams, value: string) {
        const paramsArr = this.parameters[name];
        if (paramsArr && Array.isArray(paramsArr)) {
            paramsArr.push(value);
            this.parameters[name] = paramsArr;
        } else {
            const newParam = new Array(value);
            this.parameters[name] = newParam;
        }
    }

    public deleteParameter(name: PossibleUrlParams, value: string) {
        const parameters = this.parameters[name];

        if (parameters) {
            const index = parameters.indexOf(value);
            parameters.splice(index, 1);
        }
    }

    public getParameters() {
        return this.parameters;
    }

    public getView() {
        return this.view;
    }
}
