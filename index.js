const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/gamepasses/:userId', async (req, res) => {
    const { userId } = req.params;
    let passes = [];
    let cursor = '';

    try {
        do {
            const url = `https://catalog.roblox.com/v1/search/items?category=GamePass&creatorType=User&creatorTargetId=${userId}&limit=30${cursor ? '&cursor=' + cursor : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.data) {
                for (const item of data.data) {
                    passes.push({
                        id: item.id,
                        name: item.name,
                        price: item.lowestPrice || item.price || 0
                    });
                }
            }

            cursor = data.nextPageCursor || '';
        } while (cursor);

        res.json({ success: true, passes });
    } catch (err) {
        res.json({ success: false, passes: [] });
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
