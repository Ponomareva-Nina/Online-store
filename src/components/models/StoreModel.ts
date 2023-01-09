import data from '../../products.json';
import { Product, Props } from '../../types/interfaces';
import { SortOptions } from '../../types/types';
import AppController from '../app/app';

export default class StoreModel {
    public appController: AppController;
    private products: Product[];
    public currentProducts: Product[];
    absoluteMinPrice: number;
    absoluteMaxPrice: number;
    absoluteMinStock: number;
    absoluteMaxStock: number;

    constructor(controller: AppController) {
        this.appController = controller;
        this.products = data.products;
        this.currentProducts = data.products;
        this.absoluteMinPrice = 3;
        this.absoluteMaxPrice = 190;
        this.absoluteMinStock = 3;
        this.absoluteMaxStock = 123;
    }

    public getCurrentMinPrice() {
        let minPrice = this.currentProducts[0].price;
        this.currentProducts.forEach((product) => {
            if (product.price < minPrice) {
                minPrice = product.price;
            }
        });
        return minPrice;
    }

    public getCurrentMaxPrice() {
        let maxPrice = this.currentProducts[0].price;
        this.currentProducts.forEach((product) => {
            if (product.price > maxPrice) {
                maxPrice = product.price;
            }
        });
        return maxPrice;
    }

    public getCurrentMinStock() {
        let minStock = this.currentProducts[0].quantity;
        this.currentProducts.forEach((product) => {
            if (product.quantity < minStock) {
                minStock = product.quantity;
            }
        });
        return minStock;
    }

    public getCurrentMaxStock() {
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

        if (params.price) {
            const [min, max] = params.price;
            this.currentProducts = this.filterByPriceRange(Number(min), Number(max), this.currentProducts);
        }

        if (params.stock) {
            const [min, max] = params.stock;
            this.currentProducts = this.filterByStockRange(Number(min), Number(max), this.currentProducts);
        }

        if (params.sort) {
            const sortValue = params.sort.join('');
            this.currentProducts = this.sortProducts(sortValue, this.currentProducts);
        }
    }

    private filterByStockRange(minValue: number, maxValue: number, arr: Array<Product>) {
        const filteredArr = arr.filter((product) => {
            return product.quantity >= minValue && product.quantity <= maxValue;
        });
        return filteredArr;
    }

    private filterByPriceRange(minValue: number, maxValue: number, arr: Array<Product>) {
        const filteredArr = arr.filter((product) => {
            return product.price >= minValue && product.price <= maxValue;
        });
        return filteredArr;
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
                return b.discount - a.discount;
            });
        }
        return sortedProducts;
    }
}
