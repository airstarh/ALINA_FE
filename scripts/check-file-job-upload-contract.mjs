import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FileJobSocket, FileUploadNavigationLock, partitionUploadFiles, fileJobSocketUrl} from '../src/services/FileJobUpload.js';

const uploaderSource=fs.readFileSync(new URL('../src/components/elements/form/AlinaFileUploader.vue',import.meta.url),'utf8');
const localesSource=fs.readFileSync(new URL('../src/locales/index.js',import.meta.url),'utf8');
const warningKey='Video file is up to load. Do not leave the page.';
assert.ok(uploaderSource.includes(`$t("${warningKey}")`),'visible upload warning must use the locale key');
assert.ok(uploaderSource.includes(`this.$t("${warningKey}")`),'navigation lock warning must use the locale key');
assert.ok(localesSource.includes('"Video file is up to load. Do not leave the page.": "Загружаю большой файл. Не трогайте ничего, пожалуйста."'),'Russian large-file warning must be translated');

const files=[{name:'a.png',type:'image/png'},{name:'voice.webm',type:'audio/webm'},{name:'clip.WEBM',type:''},{name:'camera.bin',type:'video/mp4'}];
const split=partitionUploadFiles(files);
assert.deepEqual(split.ordinary.map(f=>f.name),['a.png','voice.webm']);
assert.deepEqual(split.videos.map(f=>f.name),['clip.WEBM','camera.bin']);
assert.equal(fileJobSocketUrl('https://zero.home:50443'), 'wss://zero.home:50443/ws-file');
assert.equal(fileJobSocketUrl('http://zero.home'), 'ws://zero.home/ws-file');

const listeners=new Map();let guard;let guardRemoved=false;let alerts=0;
const fakeWindow={
  document:{addEventListener:(name,fn)=>listeners.set(`document:${name}`,fn),removeEventListener:(name)=>listeners.delete(`document:${name}`)},
  addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:(name)=>listeners.delete(name),
};
const lock=new FileUploadNavigationLock({windowObject:fakeWindow,router:{beforeEach:fn=>{guard=fn;return()=>{guardRemoved=true;};}},message:'busy',alertFunction:()=>alerts++});
lock.start();assert.equal(guard(),false);assert.equal(alerts,1);assert.ok(listeners.has('beforeunload'));
lock.stop();assert.equal(guardRemoved,true);assert.equal(listeners.has('beforeunload'),false);

class FakeWebSocket {
  static latest;
  constructor(url){this.url=url;FakeWebSocket.latest=this;}
  send(value){this.sent=value;}
  close(){}
}
const updates=[];
const socket=new FileJobSocket({baseUrl:'https://zero.home',user:{attributes:{id:17,token:'valid-token-123'}},onJob:job=>updates.push(job),WebSocketImpl:FakeWebSocket});
const waiting=socket.wait('job-1');FakeWebSocket.latest.onopen();
assert.equal(JSON.parse(FakeWebSocket.latest.sent).uid,17);
FakeWebSocket.latest.onmessage({data:JSON.stringify({type:'job',job:{publicId:'job-1',status:'completed',progress:100}})});
await waiting;assert.equal(updates[0].progress,100);
console.log('PASS: file job frontend upload contract');
