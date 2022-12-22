import { Routes } from '../../types/interfaces';

const routes: Routes[] = [
    {
        path: '/',
        getTemplate: () => '<h1>Home</h1>',
    },
    {
        path: '/about',
        getTemplate: () => '<h1>About</h1>',
    },
    {
        path: '/contact',
        getTemplate: () => '<h1>Contact</h1>',
    },
    {
        path: '/products/:productId',
        getTemplate: (params) => `<h1>Product ${params.productId}</h1>`,
    },
];

export default routes;
