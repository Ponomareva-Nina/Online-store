const routes = [
    {
        path: '/',
        component: 'startPage',
    },
    {
        path: '/store',
        component: 'storeView',
    },
    {
        path: '/cart',
        component: 'cartView',
    },
    {
        path: '/products/:productId',
        component: 'productPage',
    },
];

export default routes;
