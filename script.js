const KEY="handesk_v1";
let state={users:[],current:null,students:[],evaluations:[],reports:[],performance:[],ideas:[]};

function load(){try{return JSON.parse(localStorage.getItem(KEY))||state}catch{return state}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function userData(){const u=state.current;const d=load();const base={students:[],evaluations:[],reports:[],performance:[],ideas:[]};const x=d.data?.[u]||{};Object.assign(state,base,x)}
function saveUser(){const d=load();d.data=d.data||{};d.data[state.current]={students:state.students,evaluations:state.evaluations,reports:state.reports,performance:state.performance,ideas:state.ideas};d.users=state.users;localStorage.setItem(KEY,JSON.stringify(d))}
function setSection(id){document.querySelectorAll(".section").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.section===id));render()}
function renderUsers(){const box=document.getElementById("existing-users");const d=load();state.users=d.users||[];box.innerHTML=state.users.length?state.users.map(u=>`<div class="user-item" data-u="${esc(u.user)}"><span><strong>${esc(u.name)}</strong><br><small>@${esc(u.user)}</small></span><button class="danger" data-del="${esc(u.user)}">×</button></div>`).join(""):`<div class="empty">Belum ada profil guru.</div>`;box.querySelectorAll(".user-item").forEach(e=>e.onclick=()=>{if(e.target.dataset.del){state.users=state.users.filter(x=>x.user!==e.target.dataset.del);const d=load();d.users=state.users;localStorage.setItem(KEY,JSON.stringify(d));renderUsers();return}login(e.dataset.u)})}
function login(user){state.current=user;userData();document.getElementById("login-screen").classList.add("hidden");document.getElementById("app").classList.remove("hidden");document.getElementById("nav-user").textContent=load().users.find(x=>x.user===user)?.name||user;document.getElementById("dash-name").textContent=document.getElementById("nav-user").textContent;render()}
function render(){
 document.getElementById("stat-students").textContent=state.students.length;
 const avg=state.evaluations.length?Math.round(state.evaluations.reduce((a,b)=>a+Number(b.score),0)/state.evaluations.length):0;
 document.getElementById("stat-average").textContent=avg;
 document.getElementById("stat-reports").textContent=state.reports.length;
 document.getElementById("stat-ideas").textContent=state.ideas.filter(x=>x.status!=="Selesai").length;
 document.getElementById("priority-list").innerHTML=[
  ["Evaluasi","Input nilai dan catatan perkembangan siswa."],
  ["Laporan",state.reports.length?`${state.reports.length} laporan sudah tersimpan.`:"Buat laporan pembelajaran pertama."],
  ["Refleksi",state.performance.length?`${state.performance.length} catatan kinerja tersedia.`:"Catat refleksi kinerja mengajar."]
 ].map(x=>`<div class="list-item"><strong>${x[0]}</strong><span class="muted">${x[1]}</span></div>`).join("");
 const classes={};state.students.forEach(s=>classes[s.class]=(classes[s.class]||0)+1);
 document.getElementById("class-summary").innerHTML=Object.keys(classes).length?Object.entries(classes).map(([k,v])=>`<div class="list-item"><strong>${esc(k)}</strong><span class="muted">${v} siswa</span></div>`).join(""):`<div class="empty">Belum ada data kelas.</div>`;
 renderStudents();renderEval();renderReports();renderPerf();renderIdeas();
}
function renderStudents(){document.getElementById("student-count").textContent=state.students.length;const box=document.getElementById("student-list");box.innerHTML=state.students.length?`<table class="table"><tr><th>Nama</th><th>Kelas</th><th>Catatan</th><th></th></tr>${state.students.map(s=>`<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.class)}</td><td>${esc(s.note||"—")}</td><td><button class="danger" onclick="delStudent('${s.id}')">hapus</button></td></tr>`).join("")}</table>`:`<div class="empty">Belum ada siswa.</div>`;const sel=document.getElementById("eval-student");sel.innerHTML=state.students.length?state.students.map(s=>`<option value="${s.id}">${esc(s.name)} — ${esc(s.class)}</option>`).join(""):`<option value="">Tambahkan siswa terlebih dahulu</option>`}
function renderEval(){const box=document.getElementById("eval-list");box.innerHTML=state.evaluations.length?`<table class="table"><tr><th>Siswa</th><th>Mapel</th><th>Nilai</th><th>Catatan</th></tr>${state.evaluations.slice().reverse().map(e=>{const s=state.students.find(x=>x.id===e.student);return `<tr><td>${esc(s?.name||"—")}</td><td>${esc(e.subject)}</td><td><strong>${e.score}</strong></td><td>${esc(e.comment||"—")}</td></tr>`}).join("")}</table>`:`<div class="empty">Belum ada evaluasi.</div>`}
function renderReports(){document.getElementById("report-list").innerHTML=state.reports.length?state.reports.slice().reverse().map(r=>`<article class="report-card"><div class="idea-meta"><span>${esc(r.period||"Tanpa periode")}</span><button class="danger" onclick="delReport('${r.id}')">hapus</button></div><strong>${esc(r.title)}</strong><p>${esc(r.body)}</p></article>`).join(""):`<div class="empty">Belum ada laporan.</div>`}
function renderPerf(){document.getElementById("perf-list").innerHTML=state.performance.length?state.performance.slice().reverse().map(p=>`<article class="perf-card"><div class="idea-meta"><span>${esc(p.area)}</span><span>Skor ${p.score}/5</span></div><p>${esc(p.note||"Tanpa refleksi")}</p></article>`).join(""):`<div class="empty">Belum ada refleksi.</div>`}
function renderIdeas(){document.getElementById("idea-list").innerHTML=state.ideas.length?state.ideas.slice().reverse().map(i=>`<article class="idea-card"><div class="idea-meta"><span>${esc(i.status)}</span><button class="danger" onclick="delIdea('${i.id}')">hapus</button></div><strong>${esc(i.title)}</strong><p><b>Tujuan:</b> ${esc(i.goal||"—")}</p><p><b>Langkah:</b> ${esc(i.steps||"—")}</p></article>`).join(""):`<div class="empty">Belum ada ide.</div>`}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
document.getElementById("login-form").onsubmit=e=>{e.preventDefault();const name=document.getElementById("login-name").value.trim(),user=document.getElementById("login-user").value.trim();const d=load();d.users=d.users||[];if(!d.users.some(x=>x.user===user))d.users.push({name,user});localStorage.setItem(KEY,JSON.stringify(d));state.users=d.users;login(user)}
document.getElementById("logout").onclick=()=>{document.getElementById("app").classList.add("hidden");document.getElementById("login-screen").classList.remove("hidden");renderUsers()}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>setSection(b.dataset.section));
document.getElementById("student-form").onsubmit=e=>{e.preventDefault();state.students.push({id:uid(),name:studentName.value.trim(),class:studentClass.value.trim(),note:studentNote.value.trim()});e.target.reset();saveUser();render()}
document.getElementById("eval-form").onsubmit=e=>{e.preventDefault();if(!evalStudent.value)return;state.evaluations.push({id:uid(),student:evalStudent.value,subject:evalSubject.value.trim(),score:Number(evalScore.value),comment:evalComment.value.trim()});e.target.reset();saveUser();render()}
document.getElementById("report-form").onsubmit=e=>{e.preventDefault();state.reports.push({id:uid(),title:reportTitle.value.trim(),period:reportPeriod.value.trim(),body:reportBody.value.trim()});e.target.reset();saveUser();render()}
document.getElementById("performance-form").onsubmit=e=>{e.preventDefault();state.performance.push({id:uid(),area:perfArea.value,score:Number(perfScore.value),note:perfNote.value.trim()});e.target.reset();perfScore.value=4;saveUser();render()}
document.getElementById("idea-form").onsubmit=e=>{e.preventDefault();state.ideas.push({id:uid(),title:ideaTitle.value.trim(),goal:ideaGoal.value.trim(),steps:ideaSteps.value.trim(),status:ideaStatus.value});e.target.reset();saveUser();render()}
function delStudent(id){state.students=state.students.filter(x=>x.id!==id);state.evaluations=state.evaluations.filter(x=>x.student!==id);saveUser();render()}
function delReport(id){state.reports=state.reports.filter(x=>x.id!==id);saveUser();render()}
function delIdea(id){state.ideas=state.ideas.filter(x=>x.id!==id);saveUser();render()}
document.getElementById("print-report").onclick=()=>{const text=state.reports.map(r=>`${r.title}\n${r.period}\n\n${r.body}`).join("\n\n----------------\n\n");const w=window.open("","_blank");w.document.write(`<pre style="font:14px/1.6 sans-serif;white-space:pre-wrap;padding:30px">${esc(text)}</pre>`);w.print()}
renderUsers();
