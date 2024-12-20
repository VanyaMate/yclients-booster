import { defineConfig, PluginOption } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';


export default defineConfig(({ mode }) => {
    const plugins: PluginOption[] = [];
    const isProductionMode        = mode === 'production';
    const cssScopeName            = isProductionMode ? '[hash:base64:5]'
                                                     : '[name]_[local]_[hash:base64:5]';

    if (isProductionMode) {
        plugins.push(obfuscatorPlugin({
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
        }));
    }

    plugins.push(crx({ manifest }));

    return {
        plugins: plugins,
        css    : {
            modules: {
                generateScopedName: cssScopeName,
            },
        },
        resolve: {
            alias: {
                '@': '/src',
                '$': '/',
            },
        },
    };
});