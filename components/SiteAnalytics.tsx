'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const CONSENT_KEY='ma-analytics-consent';
const VISITOR_KEY='ma-visitor-id';

function getVisitorId(){
  let id=window.localStorage.getItem(VISITOR_KEY);
  if(!id){
    id=crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY,id);
  }
  return id;
}

export default function SiteAnalytics(){
  const pathname=usePathname();
  const [consent,setConsent]=useState<'unknown'|'yes'|'no'>('unknown');

  useEffect(()=>{
    const saved=window.localStorage.getItem(CONSENT_KEY);
    if(saved==='yes'||saved==='no') setConsent(saved);
    else setConsent('unknown');
  },[]);

  useEffect(()=>{
    if(consent!=='yes' || !pathname || pathname.startsWith('/admin')) return;

    fetch('/api/analytics/visit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      keepalive:true,
      body:JSON.stringify({
        visitorId:getVisitorId(),
        path:pathname,
        referrer:document.referrer||''
      })
    }).catch(()=>{});
  },[pathname,consent]);

  if(consent!=='unknown') return null;

  return <div className="analyticsConsent" role="dialog" aria-label="Analytics consent">
    <div><strong>Privacy & analytics</strong><p>We use privacy-conscious visit statistics to improve the store. No IP address is stored; signed-in visits may be linked to your account.</p></div>
    <div className="analyticsConsentActions"><button onClick={()=>{localStorage.setItem(CONSENT_KEY,'yes');setConsent('yes')}}>Allow analytics</button><button onClick={()=>{localStorage.setItem(CONSENT_KEY,'no');setConsent('no')}}>No thanks</button></div>
  </div>;
}
