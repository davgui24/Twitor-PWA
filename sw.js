//  IMPORTS
importScripts('js/sw-utils.js');
 
 const STATIC_CACHE = 'static_v2';
 const DYNAMIC_CACHE = 'dynamic_v1';
 const INMUTABLE_CACHE = 'inmutable_v1';


 const APP_SHELL = [
     '/',
     'index.html',
     'css/style.css',
     'img/favicon.ico',
     'img/avatars/spiderman.jpg',
     'img/avatars/hulk.jpg',
     'img/avatars/ironman.jpg',
     'img/avatars/thor.jpg',
     'img/avatars/wolverine.jpg',
     'js/app.js',
     'js/sw-utils.js'
 ];


 const APP_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];


self.addEventListener('install', e =>{

    const cacheStatic = caches.open(STATIC_CACHE)
                .then(cache => cache.addAll(APP_SHELL));
    
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
                .then(cache => cache.addAll(APP_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e =>{
    const respuesta = caches.keys().then(kyes =>{
        kyes.forEach(kye =>{
            if(kye !== STATIC_CACHE && kye.includes('static')){
                return caches.delete(kye);
            }
        });
    });

    e.waitUntil(respuesta);
});


self.addEventListener('fetch', e =>{

    const respuesta = caches.match(e.request).then(res =>{

        if(res){
            return res;
        }else{
            return fetch(e.request).then(newRes =>{
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });
        }
    });

    e.waitUntil(respuesta);
});

