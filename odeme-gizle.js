/* ==============================================================
   ODEME SECENEKLERI GIZLEME (odeme-gizle.js) - Ticimax
   Ne yapar : Urun sayfalarinda "Odeme Secenekleri" sekmesini ve
              icerigini (havale kutusu + banka taksit tablolari)
              tum urunlerde gizler. Sekme acik gelirse
              "Urun Ozellikleri" sekmesine gecer.
   Nerede   : Script Yonetimi > Tum Sayfalar (tek <script src>)
   Not      : Taksit ayarlarina dokunmaz; sadece gorunumu gizler.
   Kaldirmak: Yuvadaki <script src=".../odeme-gizle.js"> satirini silmek.
   ============================================================== */

/* Sekmeyi metninden bulur (tema sinif adlarina bagli degil). */
(function(){
  if(window.__bbOdeme) return; window.__bbOdeme=1;
  var ETIKET='ödeme seçenekleri', sekmeTamam=false;
  function norm(s){ return (s||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR'); }
  function aktifMi(el){ return /active|aktif|selected|current|secili/i.test((el.className||'')+' '+(el.getAttribute('aria-selected')||'')+' '+((el.querySelector('[class*=active],[class*=aktif],[class*=selected],[aria-selected=true]'))?'active':'')); }
  function sekmeyiGizle(){
    var adaylar=document.querySelectorAll('li,a,span,button,div,h2,h3,label');
    for(var i=0;i<adaylar.length;i++){
      var el=adaylar[i];
      if(el.__bbOG || norm(el.textContent)!==ETIKET) continue;
      var sekme=el.closest('li');
      if(!sekme){ sekme=el; while(sekme.parentElement && norm(sekme.parentElement.textContent)===ETIKET) sekme=sekme.parentElement; }
      if(sekme.__bbOG){ el.__bbOG=1; continue; }
      var acikti=aktifMi(sekme);
      sekme.style.setProperty('display','none','important'); sekme.__bbOG=el.__bbOG=1; sekmeTamam=true;
      if(acikti && sekme.parentElement){
        var kardes=[].filter.call(sekme.parentElement.children,function(k){ return k!==sekme; })[0];
        if(kardes){ var tik=kardes.querySelector('a,button')||kardes; tik.click(); }
      }
    }
    return sekmeTamam;
  }
  function icerigiGizle(){
    var tablolar=[].filter.call(document.querySelectorAll('table'),function(t){ return /taksit tutar/i.test(norm(t.textContent)); });
    if(!tablolar.length) return false;
    var el=tablolar[0];
    function hepsiIcinde(x){ for(var j=0;j<tablolar.length;j++) if(!x.contains(tablolar[j])) return false; return true; }
    while(el.parentElement && el.parentElement!==document.body && !hepsiIcinde(el)) el=el.parentElement;
    var ust=el;
    while(ust.parentElement && ust.parentElement!==document.body && norm(ust.textContent).indexOf('havale ile ödeme')<0) ust=ust.parentElement;
    if(norm(ust.textContent).indexOf('havale ile ödeme')>-1 && norm(ust.textContent).indexOf('ürün özellikleri')<0) el=ust;
    if(!el.hasAttribute('data-bb-og')){ el.style.setProperty('display','none','important'); el.setAttribute('data-bb-og','1'); }
    return true;
  }
  if(!document.querySelector) return;
  var n=0,t=setInterval(function(){
    if(!window.productDetailModel){ if(++n>25) clearInterval(t); return; }
    var a=sekmeyiGizle(), b=icerigiGizle();
    if((a&&b)||++n>40) clearInterval(t);
  },300);
})();

