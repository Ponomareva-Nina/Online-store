import data from '../../products.json';
import { Product, Props } from '../../types/interfaces';
import { SortOptions } from '../../types/types';
import AppController from '../app/app';

export default class StoreModel {
    public appController: AppController;
    private products: Product[];
    public currentProducts: Product[];

    constructor(controller: AppController) {
        this.appController = controller;
        this.products = data.products;
        this.currentProducts = data.products;
    }

    public getMinPrice() {
        let minPrice = this.currentProducts[0].price;
        this.currentProducts.forEach((product) => {
            if (product.price < minPrice) {
                minPrice = product.price;
            }
        });
        return minPrice;
    }

    public getMaxPrice() {
        let maxPrice = this.currentProducts[0].price;
        this.currentProducts.forEach((product) => {
            if (product.price > maxPrice) {
                maxPrice = product.price;
            }
        });
        return maxPrice;
    }

    public getMinStock() {
        let minStock = this.currentProducts[0].quantity;
        this.currentProducts.forEach((product) => {
            if (product.quantity < minStock) {
                minStock = product.quantity;
            }
        });
        return minStock;
    }

    public getMaxStock() {
        let maxStock = this.currentProducts[0].quantity;
        this.currentProducts.forEach((product) => {
            if (product.quantity > maxStock) {
                maxStock = product.quantity;
            }
        });
        return maxStock;
    }

    public getProductById(id: number) {
        return this.products.find((product) => product.id === id);
    }

    public getCurrentProducts() {
        return this.currentProducts;
    }

    public handleParams(params: Props) {
        this.currentProducts = this.products;

        if (params.faculty) {
            this.currentProducts = this.filterByFaculty(params.faculty, this.currentProducts);
        }

        if (params.category) {
            this.currentProducts = this.filterByCategory(params.category, this.currentProducts);
        }

        if (params.search) {
            const searchValue = params.search.join('');
            this.currentProducts = this.filterCardsByKeyword(searchValue, this.currentProducts);
        }

        if (params.sort) {
            const sortValue = params.sort.join('');
            this.currentProducts = this.sortProducts(sortValue, this.currentProducts);
        }
    }

    private filterByCategory(valuesArr: string[], arr: Array<Product>) {
        const filteredArr = arr.filter((product) => {
            return valuesArr.includes(product.category);
        });
        return filteredArr;
    }

    private filterByFaculty(valuesArr: string[], arr: Array<Product>) {
        const filteredArr = arr.filter((product) => {
            return valuesArr.includes(product.faculty);
        });
        return filteredArr;
    }

    private filterCardsByKeyword(value: string, arr: Array<Product>) {
        const filteredProducts: Array<Product> = [];
        arr.forEach((product) => {
            if (
                product.category.toLowerCase().includes(value) ||
                product.description.toLowerCase().includes(value) ||
                product.title.toLowerCase().includes(value) ||
                product.faculty.toLowerCase().includes(value) ||
                product.price.toString() === value ||
                product.discount.toString() === value
            ) {
                filteredProducts.push(product);
            }
        });
        return filteredProducts;
    }

    private sortProducts(value: string, arr: Array<Product>) {
        let sortedProducts: Array<Product> = [];
        if (value === SortOptions.MAX_PRICE) {
            sortedProducts = arr.sort((a, b) => {
                return b.price - a.price;
            });
        }
        if (value === SortOptions.MIN_PRICE) {
            sortedProducts = arr.sort((a, b) => {
                return a.price - b.price;
            });
        }
        if (value === SortOptions.DISCOUNT) {
            sortedProducts = arr.sort((a, b) => {
                return a.discount - b.discount;
            });
        }
        return sortedProducts;
    }
}
