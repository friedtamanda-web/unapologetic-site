/* tul-forms.js: one shared, script-blocker-proof form layer for theunapologeticleader.com.
   Every form posts straight to Klaviyo's client API (same pattern as the scorecard gate),
   shows success only when Klaviyo answers 202, and says so plainly when it doesn't.
   Also sends GA4 events for leads, signups and Gumroad clicks.

   Markup contracts:
   - Lead form:     <form data-kl-event="Speaking Inquiry" [data-kl-subscribe="LISTID"] [data-kl-ok="..."] [data-kl-done="#id"]>
   - Dispatch form: <form data-kl-list="TejKnW" data-kl-source="TUL Dispatch">
   Company Twvzce is Klaviyo's public site key (safe in the browser). */
(function(){
  var CO='Twvzce', REV='2024-10-15', API='https://a.klaviyo.com/client/';
  var FALLBACK='hello@frdtlab.com';

  /* styles for the native Dispatch form and the status lines */
  var css='.tulf{display:grid;gap:8px;margin:18px 0 6px;max-width:520px}'+
    '.tulf label{font-size:.86rem;font-weight:600;color:inherit}'+
    '.tulf-row{display:flex;flex-wrap:wrap;gap:10px}'+
    '.tulf input[type=email]{flex:1 1 220px;min-height:46px;padding:12px 14px;font:inherit;font-size:1rem;border:2px solid #1D1720;border-radius:6px;background:#fff;color:#1D1720}'+
    '.tulf input[type=email]:focus-visible{outline:3px solid #8C1D40;outline-offset:2px}'+
    '.tulf button{min-height:46px;padding:12px 22px;font:inherit;font-weight:600;font-size:.95rem;border:0;border-radius:999px;background:#8C1D40;color:#FBF6F5;cursor:pointer}'+
    '.tulf button:hover{background:#6E1431}.tulf button:focus-visible{outline:3px solid #1D1720;outline-offset:2px}'+
    '.tulf button[disabled]{opacity:.7;cursor:wait}'+
    '.tulf-fine{font-size:.84rem;opacity:.85;margin:0}'+
    '.tulf-msg{font-size:1.02rem;line-height:1.5;margin:10px 0 0}'+
    '.tulf-msg[hidden]{display:none}.tulf-err{color:#8C1D40;font-weight:600}.tulf-err a{color:inherit}';
  try{var st=document.createElement('style');st.id='tulf-css';st.textContent=css;document.head.appendChild(st);}catch(_){}

  function ga(name,params){try{if(window.gtag)gtag('event',name,params||{});}catch(_){}}
  function klOnsite(email,eventName,props){
    try{if(window.klaviyo&&email){window.klaviyo.push(['identify',{'$email':email}]);if(eventName)window.klaviyo.push(['track',eventName,props||{}]);}}catch(_){}
  }
  function post(path,body){
    return fetch(API+path+'?company_id='+CO,{method:'POST',keepalive:true,
      headers:{'Content-Type':'application/vnd.api+json','accept':'application/vnd.api+json','revision':REV},
      body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error('klaviyo '+r.status);return r;});
  }
  function eventBody(name,email,firstName,props){
    var p={email:email}; if(firstName)p.first_name=firstName;
    return {data:{type:'event',attributes:{properties:props,unique_id:name+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
      metric:{data:{type:'metric',attributes:{name:name}}},profile:{data:{type:'profile',attributes:p}}}}};
  }
  function subBody(listId,email,source){
    return {data:{type:'subscription',attributes:{custom_source:source,profile:{data:{type:'profile',attributes:{email:email}}}},relationships:{list:{data:{type:'list',id:listId}}}}};
  }
  function validEmail(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);}
  function msgEl(f){
    var m=f.querySelector('.tulf-msg');
    if(!m){m=document.createElement('p');m.className='tulf-msg';m.hidden=true;f.appendChild(m);}
    return m;
  }
  function showErr(f,text){
    var m=msgEl(f); m.className='tulf-msg tulf-err'; m.setAttribute('role','alert');
    m.innerHTML=''; m.appendChild(document.createTextNode(text+' '));
    var a=document.createElement('a'); a.href='mailto:'+FALLBACK; a.textContent=FALLBACK; m.appendChild(a); m.appendChild(document.createTextNode('.'));
    m.hidden=false;
  }
  function showOk(f,text){
    var done=f.getAttribute('data-kl-done'), d=done&&document.querySelector(done);
    var p;
    if(d&&!f.hasAttribute('data-kl-ok')){p=d;d.setAttribute('role','status');}
    else{p=document.createElement('p'); p.className='tulf-msg'; p.setAttribute('role','status'); p.textContent=text; f.parentNode.insertBefore(p,f.nextSibling);}
    p.setAttribute('tabindex','-1'); f.hidden=true; f.style.display='none';
    if(d){d.hidden=false;d.style.display='block';}
    try{p.focus({preventScroll:true});}catch(_){}
  }
  function busy(f,on){
    var b=f.querySelector('button[type=submit],button:not([type])');
    if(!b)return;
    if(on){b.setAttribute('data-label',b.textContent);b.textContent='Sending...';b.disabled=true;}
    else{b.textContent=b.getAttribute('data-label')||b.textContent;b.disabled=false;}
  }

  document.addEventListener('submit',function(e){
    var f=e.target; if(!f||!f.getAttribute)return;
    var ev=f.getAttribute('data-kl-event'), list=f.getAttribute('data-kl-list');
    if(!ev&&!list)return;
    e.preventDefault();
    if(f.getAttribute('data-busy')==='1')return;
    var fd=new FormData(f), props={}, email='', name='';
    fd.forEach(function(v,k){ v=(''+v).trim(); if(!v||k.charAt(0)==='_')return;
      if(/^e-?mail$/i.test(k)){email=v;return;} if(/^name$/i.test(k))name=v;
      props[k]=props[k]?props[k]+', '+v:v; });
    var old=f.querySelector('.tulf-msg.tulf-err'); if(old)old.hidden=true;
    if(!validEmail(email)){
      var inp=f.querySelector('input[type=email]'); if(inp){inp.setAttribute('aria-invalid','true');inp.focus();}
      showErr(f,'Add a valid email address, then send it again. Or write to');
      return;
    }
    var first=name?name.split(/\s+/)[0]:'';
    props.page=location.pathname; props.brand='Unapologetic Leader';
    f.setAttribute('data-busy','1'); busy(f,true);
    var main, extras=[];
    if(ev){
      props.form=ev;
      main=post('events/',eventBody(ev,email,first,props));
      extras.push(post('events/',eventBody('New Lead',email,first,props)).catch(function(){}));
      var sub=f.getAttribute('data-kl-subscribe');
      if(sub)extras.push(post('subscriptions/',subBody(sub,email,ev)).catch(function(){}));
    }else{
      main=post('subscriptions/',subBody(list,email,f.getAttribute('data-kl-source')||'TUL Dispatch'));
    }
    main.then(function(){
      return Promise.all(extras);
    }).then(function(){
      f.removeAttribute('data-busy'); busy(f,false);
      klOnsite(email,null);
      if(ev){
        ga('generate_lead',{form_name:ev,lead_source:'tul_site'});
        showOk(f,f.getAttribute('data-kl-ok')||'Got it. Thank you. We will be in touch soon.');
      }else{
        ga('sign_up',{method:f.getAttribute('data-kl-source')||'TUL Dispatch'});
        showOk(f,f.getAttribute('data-kl-ok')||"You're on the list. The next Dispatch lands in your inbox.");
      }
    }).catch(function(){
      f.removeAttribute('data-busy'); busy(f,false);
      ga('form_error',{form_name:ev||'TUL Dispatch'});
      showErr(f,"That didn't go through. Please try again in a moment, or write to");
    });
  });

  /* GA4: Gumroad Edition clicks (begin_checkout) */
  var ED={fieldguide:['Build What’s Next. Stay Human. (field guide)',9],vzzds:['Carrying vs. Caring workbook',24],
          djzgxj:['The Human Cost of Competence journal',29],ptdar:['What Am I Carrying? diagnostic kit',47]};
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href*="gumroad.com/l/"]'):null; if(!a)return;
    var m=/gumroad\.com\/l\/([a-z0-9]+)/i.exec(a.href); var k=m&&m[1].toLowerCase(), it=ED[k]||[k,0];
    ga('begin_checkout',{currency:'USD',value:it[1],items:[{item_id:k,item_name:it[0],price:it[1],quantity:1}],link_page:location.pathname});
    try{if(window.klaviyo)window.klaviyo.push(['track','TUL Edition Click',{edition:it[0],price:it[1],page:location.pathname}]);}catch(_){}
  },true);
})();
