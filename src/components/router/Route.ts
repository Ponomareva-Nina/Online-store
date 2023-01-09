import { Props, ViewComponent } from '../../types/interfaces';
import { PossibleUrlParams } from '../../types/types';

export default class Route {
    pageName: string;
    path: string;
    view: ViewComponent;
    parameters: Props;

    constructor(name: string, path: string, view: ViewComponent) {
        this.pageName = name;
        this.path = path;
        this.view = view;
        this.parameters = {};
    }

    public addParameter(name: PossibleUrlParams, value: string) {
        let paramsArr = this.parameters[name];
        if (paramsArr && Array.isArray(paramsArr)) {
            if (name === PossibleUrlParams.SEARCH || name === PossibleUrlParams.SORT) {
                paramsArr = [value];
            } else {
                paramsArr.push(value);
            }
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

    public clearParameters() {
        Object.keys(this.parameters).forEach((key) => delete this.parameters[key as keyof Props]);
    }
}
