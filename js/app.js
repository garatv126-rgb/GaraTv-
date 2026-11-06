(() => {
"use strict";
const cfg=window.GARATV_CONFIG||{};
const configured=cfg.SUPABASE_URL?.startsWith("https://")&&!cfg.SUPABASE_URL.includes("YOUR_")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_");
const sb=configured&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s);
const toast=(msg)=>{const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3200)};
$("#date-line").textContent=new Intl.DateTimeFormat("en-KE",{weekday:"short",day:"numeric",month:"short",year:"numeric"}).format(new Date()).toUpperCase();
$("#hero-date").textContent=new Intl.DateTimeFormat("en-KE",{day:"numeric",month:"long",year:"numeric"}).format(new Date()).toUpperCase();
$("#year").textContent=new Date().getFullYear();
$("#youtube-link").href=cfg.YOUTUBE_URL||"https://www.youtube.com/";
if(cfg.BUSIAN_URL&&!cfg.BUSIAN_URL.includes("YOUR-"))$("#busian-link").href=cfg.BUSIAN_URL;
$("#search-toggle").onclick=()=>$("#search-panel").classList.toggle("open");
$("#menu-toggle").onclick=()=>$("#mobile-nav").classList.toggle("open");
$("#search-submit").onclick=()=>{const q=$("#search-input").value.trim();if(q)filterStories("All",q)};
$("#search-input").addEventListener("keydown",e=>{if(e.key==="Enter")$("#search-submit").click()});
const sample=[
 {id:"s1",headline:"GaraTV opens its newsroom to community voices",dek:"A new platform for verified local, national and international reporting.",category_name:"Kenya",published_at:new Date().toISOString(),slug:"#",is_featured:true},
 {id:"s2",headline:"The stories shaping business and opportunity across Africa",dek:"Enterprise, innovation and the people building new possibilities.",category_name:"Africa",published_at:new Date().toISOString(),slug:"#"},
 {id:"s3",headline:"Global developments: what readers need to know",dek:"A concise look at the issues connecting communities around the world.",category_name:"World",published_at:new Date().toISOString(),slug:"#"},
 {id:"s4",headline:"Local sport and the moments bringing fans together",dek:"Coverage from the grassroots to the international stage.",category_name:"Sports",published_at:new Date().toISOString(),slug:"#"},
 {id:"s5",headline:"Small businesses and the changing digital marketplace",dek:"How technology is creating new ways to reach customers.",category_name:"Business",published_at:new Date().toISOString(),slug:"#"}
];
let stories=sample, activeFilter="All", query="";
function safeText(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const filtered=stories.filter(a=>(activeFilter==="All"||a.category_name===activeFilter)&&(`${a.headline} ${a.dek||""} ${a.category_name||""}`).toLowerCase().includes(query.toLowerCase()));
 const grid=$("#news-grid");
 if(!filtered.length){grid.innerHTML='<div class="empty-state">No stories match that search yet. Try another topic.</div>';return}
 grid.innerHTML=filtered.map((a,i)=>`<article class="news-card"><div class="card-art ${["art-red","art-dark","art-grey"][i%3]}"><span>${safeText((a.category_name||"NEWS").toUpperCase())}</span></div><div class="card-copy"><small>${safeText(a.category_name||"NEWS")} · GARA TV</small><h3>${safeText(a.headline)}</h3><p>${safeText(a.dek||"Read the latest verified report from the GaraTV newsroom.")}</p><a class="text-link article-open" href="#" data-id="${safeText(a.id)}">Read story ↗</a></div></article>`).join("");
 document.querySelectorAll(".article-open").forEach(el=>el.onclick=e=>{e.preventDefault();const a=stories.find(x=>x.id===el.dataset.id);openArticle(a)});
}
function filterStories(cat,q=""){activeFilter=cat;query=q;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===cat));render();$("#latest").scrollIntoView({behavior:"smooth"})}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>filterStories(b.dataset.filter));
document.querySelectorAll("[data-coverage]").forEach(a=>a.onclick=()=>filterStories(a.dataset.coverage));
function openArticle(a){
 if(!a)return;
 openModal(`<span class="eyebrow">${safeText(a.category_name||"NEWS")} · GARA TV</span><h2>${safeText(a.headline)}</h2><p>${safeText(a.dek||"")}</p><p class="modal-note">Article detail view will display the complete published report, author, publication date, approved media, corrections history and eligible labelled advertisements when connected to the production CMS.</p><button class="btn btn-red" onclick="document.getElementById('modal-backdrop').classList.remove('open')">Close story</button>`);
}
$("#refresh-feed").onclick=loadStories;
async function loadStories(){
 if(!sb){$("#feed-status").textContent="Preview content · connect Supabase to load live articles";render();return}
 try{const {data,error}=await sb.from("articles").select("id,headline,dek,category_name,published_at,slug,is_featured").eq("status","published").order("published_at",{ascending:false}).limit(12);if(error)throw error;if(data?.length)stories=data;$("#feed-status").textContent=`${data?.length||0} published stories`;render()}catch(e){$("#feed-status").textContent="News feed temporarily unavailable";console.error(e)}
}
const backdrop=$("#modal-backdrop"),content=$("#modal-content");
function openModal(html){content.innerHTML=html;backdrop.classList.add("open");backdrop.setAttribute("aria-hidden","false")}
function closeModal(){backdrop.classList.remove("open");backdrop.setAttribute("aria-hidden","true")}
$("#modal-close").onclick=closeModal;backdrop.onclick=e=>{if(e.target===backdrop)closeModal()};
document.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b){const type=b.dataset.open;if(type==="contributor")contributorModal();}});
function contributorModal(){
 openModal(`<span class="eyebrow">JOIN THE GARATV NETWORK</span><h2>Apply to become a contributor</h2><p>Anyone can apply. GaraTV reviews each application before granting contributor access. Applying does not guarantee approval or payment.</p>
 <form id="apply-form" class="modal-form">
 <label>Full name<input name="full_name" required maxlength="120"></label><label>Email<input name="email" type="email" required></label>
 <label>Phone number<input name="phone" required></label><label>County / location<input name="location" required></label>
 <label class="wide">Why would you like to contribute?<textarea name="motivation" required minlength="30"></textarea></label>
 <label class="wide">Reporting experience (optional)<textarea name="experience"></textarea></label>
 <label class="wide"><span><input type="checkbox" name="consent" required> I agree to GaraTV reviewing my application and contacting me about it.</span></label>
 <div class="wide"><button class="btn btn-red" type="submit">Send application</button></div></form><p class="modal-note">You will receive an update after editorial review. Do not submit confidential source information in this application.</p>`);
 $("#apply-form").onsubmit=submitApplication;
}
async function submitApplication(e){
 e.preventDefault();const f=e.currentTarget,fd=new FormData(f),btn=f.querySelector("button");btn.disabled=true;btn.textContent="Sending…";
 if(!sb){btn.disabled=false;btn.textContent="Send application";toast("Connect Supabase to receive contributor applications.");return}
 try{
  const {data:auth}=await sb.auth.getUser();
  if(!auth.user){toast("Please create an account or sign in before applying.");btn.disabled=false;btn.textContent="Send application";return}
  const {error}=await sb.from("contributor_applications").insert({user_id:auth.user.id,full_name:fd.get("full_name"),phone:fd.get("phone"),location_text:fd.get("location"),motivation:fd.get("motivation"),experience:fd.get("experience"),application_status:"pending"});
  if(error)throw error;closeModal();toast("Application received. GaraTV will review it.");
 }catch(err){toast(err.message||"Application could not be sent.");btn.disabled=false;btn.textContent="Send application"}
}
$("#account-open").onclick=authModal;
function authModal(){
 openModal(`<span class="eyebrow">YOUR GARATV ACCOUNT</span><h2>Sign in or create an account</h2><p>Access your contributor workspace or newsroom tools using your registered email.</p><form id="auth-form" class="modal-form"><label class="wide">Email address<input name="email" type="email" required></label><label class="wide">Password<input name="password" type="password" required minlength="8"></label><div class="wide"><button class="btn btn-red" type="submit">Sign in</button> <button class="btn btn-outline" type="button" id="signup-btn">Create account</button></div></form><p class="modal-note">Staff access is assigned by GaraTV administrators. Creating an account does not grant editorial permissions.</p>`);
 $("#auth-form").onsubmit=async e=>{e.preventDefault();if(!sb){toast("Supabase is not configured yet.");return}const fd=new FormData(e.currentTarget);const {error}=await sb.auth.signInWithPassword({email:fd.get("email"),password:fd.get("password")});if(error)toast(error.message);else{closeModal();$("#account-open").textContent="Account";toast("Signed in successfully.")}};
 $("#signup-btn").onclick=async()=>{if(!sb){toast("Supabase is not configured yet.");return}const fd=new FormData($("#auth-form"));const {error}=await sb.auth.signUp({email:fd.get("email"),password:fd.get("password")});if(error)toast(error.message);else toast("Check your email to confirm your account.")};
}
$("#newsletter-form").onsubmit=async e=>{
 e.preventDefault();const email=$("#newsletter-email").value.trim(),fb=$("#newsletter-feedback");
 if(!sb){fb.textContent="Newsletter subscription will activate when GaraTV connects its email and database services.";return}
 try{const {error}=await sb.from("newsletter_subscribers").insert({email,consent_at:new Date().toISOString(),status:"pending_confirmation",source:"website"});if(error)throw error;fb.textContent="Please check your email to confirm your subscription."}catch(err){fb.textContent=err.code==="23505"?"This email is already subscribed or awaiting confirmation.":err.message}
};
loadStories();
})();