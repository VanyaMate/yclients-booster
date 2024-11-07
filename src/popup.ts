const app = document.querySelector('#app')!;

app.innerHTML = `
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        display: flex;
        flex-direction: column;
        align-items: safe center;
        justify-content: safe center;
        background: #fee;
    }
    
    #app {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        margin: 10px;
        background: #fff;
        border-radius: 10px;
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
</style>
<h1>Балдежного вам котика</h1>
<video autoplay loop> 
    <source src="/sticker.webm" type="video/webm">
</video>
`;