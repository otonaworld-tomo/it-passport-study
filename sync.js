import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

const el=id=>document.getElementById(id);
const status=(message,state='off')=>{el('syncStatus').textContent=message;el('syncDot').className='dot '+state};
let userRef=null,unsubscribe=null,pushTimer=null,applying=false;
window.cloudSync={push(state){
  if(!userRef||applying)return;
  clearTimeout(pushTimer);
  pushTimer=setTimeout(async()=>{
    try{status('同期中…','busy');await setDoc(userRef,{state,updatedAt:state.updatedAt||Date.now()});status('同期済み','on')}
    catch(e){status('同期できません（端末内には保存済み）');console.error(e)}
  },350);
}};

if(firebaseConfig.apiKey.startsWith('PASTE_')){
  status('Firebaseの初期設定が必要です');
  el('authSignedOut').classList.add('hidden');
  el('syncHelp').textContent='firebase-config.js にFirebaseの設定値を入力すると同期を利用できます。';
}else{
  const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
  const friendly=e=>e?.code==='auth/invalid-credential'?'メールアドレスまたはパスワードが違います。':e?.code==='auth/email-already-in-use'?'このメールアドレスは登録済みです。':e?.code==='auth/weak-password'?'パスワードは6文字以上にしてください。':e?.message||'処理に失敗しました。';
  el('signIn').onclick=async()=>{try{status('ログイン中…','busy');await signInWithEmailAndPassword(auth,el('authEmail').value.trim(),el('authPassword').value)}catch(e){status(friendly(e))}};
  el('signUp').onclick=async()=>{try{status('アカウント作成中…','busy');await createUserWithEmailAndPassword(auth,el('authEmail').value.trim(),el('authPassword').value)}catch(e){status(friendly(e))}};
  el('signOut').onclick=()=>signOut(auth);
  onAuthStateChanged(auth,async user=>{
    unsubscribe?.();unsubscribe=null;userRef=null;
    el('authSignedOut').classList.toggle('hidden',!!user);el('authSignedIn').classList.toggle('hidden',!user);
    if(!user){status('未ログイン');return}
    el('authUser').textContent=user.email;status('クラウドから読込中…','busy');userRef=doc(db,'users',user.uid);
    try{
      const snap=await getDoc(userRef),local=window.studySyncBridge.get();
      if(snap.exists()&&snap.data().state){
        const remote=snap.data().state;
        if((local.updatedAt||0)>(remote.updatedAt||0))await setDoc(userRef,{state:local,updatedAt:local.updatedAt});
        else{applying=true;window.studySyncBridge.apply(remote);applying=false}
      }else await setDoc(userRef,{state:local,updatedAt:local.updatedAt||Date.now()});
      unsubscribe=onSnapshot(userRef,s=>{const remote=s.data()?.state,localNow=window.studySyncBridge.get();if(remote&&(remote.updatedAt||0)>(localNow.updatedAt||0)){applying=true;window.studySyncBridge.apply(remote);applying=false}status('同期済み','on')},e=>{status('同期接続エラー');console.error(e)});
    }catch(e){status('同期の初期化に失敗しました');console.error(e)}
  });
}
