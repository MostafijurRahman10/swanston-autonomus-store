import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['server/index.js'],{stdio:'inherit'}),spawn('node_modules/.bin/vite',['--host','127.0.0.1'],{stdio:'inherit'})];for(const child of children)child.on('exit',code=>{if(code)process.exitCode=code;children.forEach(c=>c.kill())});process.on('SIGINT',()=>children.forEach(c=>c.kill()));
