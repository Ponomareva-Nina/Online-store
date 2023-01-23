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

    public addParameter(name: PossibleUrlParams, value: string): void {
        let paramsArr = this.parameters[name];
        if (paramsArr && Array.isArray(paramsArr)) {
            if (
                name === PossibleUrlParams.SEARCH ||
                name === PossibleUrlParams.SORT ||
                name === PossibleUrlParams.VIEW
            ) {
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

    public updatePriceParameter(minValue: string, maxValue: string): void {
        this.parameters.stock = [];
        this.parameters.price = [minValue, maxValue];
    }

    public updateStockParameter(minValue: string, maxValue: string): void {
        this.parameters.price = [];
        this.parameters.stock = [minValue, maxValue];
    }

    public deleteParameter(name: PossibleUrlParams, value: string): void {
        const parameters = this.parameters[name];

        if (parameters) {
            const index = parameters.indexOf(value);
            parameters.splice(index, 1);
        }
    }

    public getParameters(): Props {
        return this.parameters;
    }

    public getView(): ViewComponent {
        return this.view;
    }

    public clearParameters(): void {
        Object.keys(this.parameters).forEach((key) => delete this.parameters[key as keyof Props]);
    }

    public clearFilters(): void {
        Object.keys(this.parameters).forEach((key) => {
            if (key !== PossibleUrlParams.ID && key !== PossibleUrlParams.SORT && key !== PossibleUrlParams.VIEW) {
                delete this.parameters[key as keyof Props];
            }
        });
    }
}
