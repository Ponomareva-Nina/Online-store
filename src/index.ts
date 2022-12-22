import './global.scss';
import Router from './components/router/router';
import routes from './components/router/routes';

const router = new Router(routes);
const test1 = <HTMLElement>document.querySelector('.btn1');
if (test1) {
    test1.addEventListener('click', () => {
        router.loadRoute('');
    });
}
const test2 = <HTMLElement>document.querySelector('.btn2');
if (test2) {
    test2.addEventListener('click', () => {
        router.loadRoute('about');
    });
}
const test3 = <HTMLElement>document.querySelector('.btn3');
if (test3) {
    test3.addEventListener('click', () => {
        router.loadRoute('contact');
    });
}
const test4 = <HTMLElement>document.querySelector('.btn4');
if (test4) {
    test4.addEventListener('click', () => {
        router.loadRoute('products', '1');
    });
}
const test5 = <HTMLElement>document.querySelector('.btn5');
if (test5) {
    test5.addEventListener('click', () => {
        router.loadRoute('products', '2');
    });
}
