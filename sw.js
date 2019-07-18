let cacheName = 'fgs-apontamento-v1.0.0';
let filesToCache = [
    './',
    'index.html',
    'script.js',
    'sw.js',

    // Cache de imagens
    'assets/img/logo.png',
    'assets/img/icons/calendar.svg',
    'assets/img/icons/camping.svg',
    'assets/img/icons/contract.svg',
    'assets/img/icons/map-location.svg',
    'assets/img/icons/networking.svg',
    'assets/img/icons/review.svg',
    'assets/img/icons/time-passing.svg',
    'assets/img/icons/tractor.svg',
    'assets/img/icons/transaction.svg',
    'assets/img/icons/wall-calendar.svg',

    // Cache de JS
    'assets/js/alerts.js',
    'assets/js/app.js',
    'assets/js/pages.js',

    // Cache de CSS
    'assets/less/styles.min.css',

    // Cache de módulos
    'assets/node_modules/axios/dist/axios.js',
    'assets/node_modules/izitoast/dist/js/iziToast.min.js',
    'assets/node_modules/izitoast/dist/css/iziToast.min.css',
    'assets/node_modules/phonon/dist/js/phonon.js',
    'assets/node_modules/phonon/dist/fonts/material-design-icons.eot',
    'assets/node_modules/phonon/dist/fonts/material-design-icons.svg',
    'assets/node_modules/phonon/dist/fonts/material-design-icons.ttf',
    'assets/node_modules/phonon/dist/fonts/material-design-icons.woff',
    'assets/node_modules/phonon/dist/css/phonon.min.css',
    'assets/node_modules/phonon/dist/css/theme.css',
    'assets/node_modules/vue/dist/vue.js',

    // Cache de template
    'tpl/dashboard.html',
    'tpl/report/step-one.html',
    'tpl/report/step-two.html',
    'tpl/report/step-three.html',
    'tpl/report/step-four.html',
    'tpl/report/step-five.html',
    'tpl/report/step-six.html',
    'tpl/report/step-seven.html',
    'tpl/report/step-eight.html',
    'tpl/report/step-nine.html',
    'tpl/report/step-ten.html',
    'tpl/report/step-eleven.html',
    'tpl/report/step-twelve.html',
    'tpl/report/step-thirteen.html',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installer');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});