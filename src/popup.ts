import { Component } from '@/shared/component/Component.ts';


new Component<HTMLDivElement>('div', { id: 'app' }, [
    new Component<HTMLStyleElement>('style', {
        innerHTML: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        
            body {
                background: #fee;
                width: fit-content;
                height: fit-content;
            }
            
            #app {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
                margin: 10px;
                background: #fff;
                border-radius: 20px;
            }
        
            h1 {
                font-family: Consolas, 'monospace';
                text-align: center;
                color: #111;
                font-size: 1.7em;
            }
            
            video {
                border-radius: 10px;
            }
        `,
    }),
    new Component<HTMLHeadingElement>('h1', { innerHTML: 'Балдежного вам котика' }),
    new Component<HTMLVideoElement>(
        'video',
        {
            autoplay: true,
            loop    : true,
        },
        [
            new Component<HTMLSourceElement>('source', {
                src : '/sticker.webm',
                type: 'video/webm',
            }),
        ],
    ),
])
    .insert(document.body, 'beforeend');