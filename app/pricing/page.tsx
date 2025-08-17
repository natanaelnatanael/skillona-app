"use client";
async function buy(plan:"basic"|"pro"){
  const r = await fetch("/api/checkout", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ plan })});
  const { url } = await r.json(); window.location.href = url;
}
export default function Pricing(){
  return <main style={{maxWidth:720,margin:"60px auto",padding:"0 16px"}}>
    <h2 style={{fontSize:26,marginBottom:8}}>Pricing</h2>
    <div style={{display:"grid",gap:12}}>
      <button onClick={()=>buy("basic")} style={{padding:"12px 16px",borderRadius:12}}>Buy Basic</button>
      <button onClick={()=>buy("pro")} style={{padding:"12px 16px",borderRadius:12}}>Buy Pro</button>
    </div>
  </main>;
}
