import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';


export default defineConfig({
    plugins: [
        /*        obfuscatorPlugin({
         options: {
         debugProtection: true,
         // deadCodeInjection: true,         // NOT WORKING
         optionsPreset: 'low-obfuscation',
         renameGlobals: true,
         // renameProperties : true,         // NOT WORKING
         splitStrings         : true,
         controlFlowFlattening: true,
         transformObjectKeys  : true,
         },
         }),*/
        crx({ manifest }),
    ],
    css    : {
        modules: {
            generateScopedName: '[name]_[local]_[hash:base64:5]',
        },
    },
    resolve: {
        alias: {
            '@': '/src',
            '$': '/',
        },
    },
});