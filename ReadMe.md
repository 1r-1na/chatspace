1. Go to folder 'server' and run `npm i`, then run `node .`.
2. Go to folder 'client' and run `npm i`, then run `npm run build`.
3. Open browser and type `http://localhost:5000/#/chats`.
4. Make sure Serviceworker is newly registered and clear site data.
5. Before going offline fetch everything at least once and disable `Update on reload`.
6. Somehow storage is not properly initialized therefore reload page at least a second time before going offline.
