const baseURL = '/';
const indexURL = '/index.html';
const networkFetchEvent = 'fetch';
const swInstallEvent = 'install';
const swInstalledEvent = 'installed';
const swActivateEvent = 'activate';
const staticCachePrefix = 'blazor-cache-v';
const staticCacheName = 'blazor-cache-v1';
const requiredFiles = [
"/_framework/blazor.boot.json",
"/_framework/blazor.server.js",
"/_framework/blazor.webassembly.js",
"/_framework/wasm/mono.js",
"/_framework/wasm/mono.wasm",
"/_framework/_bin/home-content.dll",
"/_framework/_bin/HtmlKit.dll",
"/_framework/_bin/Microsoft.AspNetCore.Authorization.dll",
"/_framework/_bin/Microsoft.AspNetCore.Blazor.dll",
"/_framework/_bin/Microsoft.AspNetCore.Blazor.HttpClient.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.Forms.dll",
"/_framework/_bin/Microsoft.AspNetCore.Components.Web.dll",
"/_framework/_bin/Microsoft.AspNetCore.Metadata.dll",
"/_framework/_bin/Microsoft.Bcl.AsyncInterfaces.dll",
"/_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll",
"/_framework/_bin/Microsoft.Extensions.DependencyInjection.dll",
"/_framework/_bin/Microsoft.Extensions.Logging.Abstractions.dll",
"/_framework/_bin/Microsoft.Extensions.Options.dll",
"/_framework/_bin/Microsoft.Extensions.Primitives.dll",
"/_framework/_bin/Microsoft.JSInterop.dll",
"/_framework/_bin/Mono.WebAssembly.Interop.dll",
"/_framework/_bin/mscorlib.dll",
"/_framework/_bin/System.Buffers.dll",
"/_framework/_bin/System.ComponentModel.Annotations.dll",
"/_framework/_bin/System.Core.dll",
"/_framework/_bin/System.dll",
"/_framework/_bin/System.Memory.dll",
"/_framework/_bin/System.Net.Http.dll",
"/_framework/_bin/System.Numerics.Vectors.dll",
"/_framework/_bin/System.Runtime.CompilerServices.Unsafe.dll",
"/_framework/_bin/System.Text.Encodings.Web.dll",
"/_framework/_bin/System.Text.Json.dll",
"/_framework/_bin/System.Threading.Tasks.Extensions.dll",
"/_framework/_bin/WebAssembly.Bindings.dll",
"/_framework/_bin/WebAssembly.Net.Http.dll",
"/favicon.ico",
"/fontawsome/css/all.css",
"/fontawsome/webfonts/fa-brands-400.eot",
"/fontawsome/webfonts/fa-brands-400.svg",
"/fontawsome/webfonts/fa-brands-400.ttf",
"/fontawsome/webfonts/fa-brands-400.woff",
"/fontawsome/webfonts/fa-brands-400.woff2",
"/fontawsome/webfonts/fa-regular-400.eot",
"/fontawsome/webfonts/fa-regular-400.svg",
"/fontawsome/webfonts/fa-regular-400.ttf",
"/fontawsome/webfonts/fa-regular-400.woff",
"/fontawsome/webfonts/fa-regular-400.woff2",
"/fontawsome/webfonts/fa-solid-900.eot",
"/fontawsome/webfonts/fa-solid-900.svg",
"/fontawsome/webfonts/fa-solid-900.ttf",
"/fontawsome/webfonts/fa-solid-900.woff",
"/fontawsome/webfonts/fa-solid-900.woff2",
"/icon-192.png",
"/icon-512.png",
"/index.html",
"/main.js",
"/Style.css",
"/Style.min.css",
"/ServiceWorkerRegister.js",
"/manifest.json"
];
// * listen for the install event and pre-cache anything in filesToCache * //
self.addEventListener(swInstallEvent, event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(requiredFiles);
            })
    );
});
self.addEventListener(swActivateEvent, function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (staticCacheName !== cacheName && cacheName.startsWith(staticCachePrefix)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener(networkFetchEvent, event => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === baseURL) {
            event.respondWith(caches.match(indexURL));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            if (requestUrl.origin === location.origin) {
                                caches.open(staticCacheName).then(cache => {
                                    cache.put(event.request.url, response);
                                });
                            }
                        }
                        return response.clone();
                    });
            }).catch(error => {
                console.error(error);
            })
    );
});
