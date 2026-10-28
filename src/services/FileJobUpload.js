const VIDEO_EXTENSIONS=new Set(['mp4','webm','mov','m4v','avi','mkv','mpeg','mpg','ogv','3gp']);

export function isVideoUpload(file){
  const mime=String(file?.type||'').toLowerCase();
  const name=String(file?.name||'').toLowerCase();
  const extension=name.includes('.')?name.split('.').pop():'';
  if(mime.startsWith('audio/'))return false;
  return mime.startsWith('video/')||VIDEO_EXTENSIONS.has(extension);
}

export function partitionUploadFiles(files){
  return Array.from(files||[]).reduce((result,file)=>{
    result[isVideoUpload(file)?'videos':'ordinary'].push(file);
    return result;
  },{ordinary:[],videos:[]});
}

export function fileJobSocketUrl(baseUrl){
  const fallback=typeof window!=='undefined'?window.location.href:'http://localhost/';
  const url=new URL(baseUrl,fallback);
  url.protocol=url.protocol==='https:'?'wss:':'ws:';
  url.pathname='/ws-file';url.search='';url.hash='';
  return url.toString().replace(/\/$/,'');
}

export class FileJobSocket {
  constructor({baseUrl,user,onJob,WebSocketImpl=WebSocket,reconnectDelay=1000}){
    this.url=fileJobSocketUrl(baseUrl);this.user=user;this.onJob=onJob;
    this.WebSocketImpl=WebSocketImpl;this.reconnectDelay=reconnectDelay;
    this.active=false;this.socket=null;this.timer=null;this.publicId=null;
  }
  wait(publicId){
    this.publicId=publicId;this.active=true;
    return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;this.connect();});
  }
  connect(){
    if(!this.active)return;
    const socket=this.socket=new this.WebSocketImpl(this.url);
    socket.onopen=()=>socket.send(JSON.stringify({type:'subscribe',publicId:this.publicId,uid:Number(this.user.attributes.id),token:this.user.attributes.token}));
    socket.onmessage=(event)=>{
      let data;try{data=JSON.parse(event.data);}catch{return;}
      if(data.type==='error'){this.finish(new Error(data.message||'File job failed.'));return;}
      if(!['subscribed','job'].includes(data.type)||!data.job)return;
      this.onJob?.(data.job);
      if(data.job.status==='completed')this.finish();
      else if(['failed','cancelled'].includes(data.job.status))this.finish(new Error(data.job.error||'File job failed.'));
    };
    socket.onclose=()=>{if(this.active){clearTimeout(this.timer);this.timer=setTimeout(()=>this.connect(),this.reconnectDelay);}};
  }
  finish(error=null){
    const resolve=this.resolve,reject=this.reject;this.stop();
    error?reject?.(error):resolve?.();
  }
  stop(){
    this.active=false;clearTimeout(this.timer);this.timer=null;
    if(this.socket){this.socket.onclose=null;this.socket.close();this.socket=null;}
  }
}

export class FileUploadNavigationLock {
  constructor({router,message,windowObject=window,alertFunction=alert}){
    this.router=router;this.message=message;this.window=windowObject;this.alert=alertFunction;
    this.beforeUnload=(event)=>{event.preventDefault();event.returnValue='';};
    this.captureClick=(event)=>{if(event.target?.closest?.('a[href]')){event.preventDefault();event.stopImmediatePropagation();this.alert(this.message);}};
  }
  start(){
    if(this.active)return;this.active=true;
    this.window.addEventListener('beforeunload',this.beforeUnload);
    this.window.document.addEventListener('click',this.captureClick,true);
    this.removeGuard=this.router?.beforeEach?.(()=>{this.alert(this.message);return false;});
  }
  stop(){
    if(!this.active)return;this.active=false;
    this.window.removeEventListener('beforeunload',this.beforeUnload);
    this.window.document.removeEventListener('click',this.captureClick,true);
    this.removeGuard?.();this.removeGuard=null;
  }
}
