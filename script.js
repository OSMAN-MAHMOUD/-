/* ---------------- print / export helpers ---------------- */
function snapshotHTML(){
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll('.photo-input').forEach(i=>i.removeAttribute('id'));
  return '<!DOCTYPE html>\n' + clone.outerHTML;
}
function openFullPage(){
  const blob = new Blob([snapshotHTML()], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if(!win){ alert('يبدو أن المتصفح منع فتح نافذة جديدة. فعّل النوافذ المنبثقة لهذا الموقع ثم أعد المحاولة، أو احفظ الملف وافتحه مباشرة في المتصفح.'); }
}
function handlePrint(){
  try{ window.print(); }catch(e){ openFullPage(); }
}

/* ---------------- bilingual labels ---------------- */
const L = {
  ar: {
    summary:'نبذة مختصرة', experience:'الخبرة العملية', education:'التعليم', skills:'المهارات',
    contact:'التواصل', courses:'الدورات التدريبية', languages:'اللغات', hobbies:'الهوايات', references:'المرجع',
    addExp:'+ إضافة خبرة عملية', addEdu:'+ إضافة مؤهل تعليمي', addSkill:'+ إضافة مهارة',
    addLang:'+ إضافة لغة', addCourse:'+ إضافة دورة', addHobby:'+ إضافة هواية', addReference:'+ إضافة مرجع',
    namePlaceholder:'الاسم الكامل', rolePlaceholder:'المسمى الوظيفي', summaryPlaceholder:'اكتب نبذة مختصرة عن مسارك المهني.',
    titlePlaceholder:'المسمى الوظيفي', datesPlaceholder:'السنوات', orgPlaceholder:'اسم الجهة',
    descPlaceholder:'وصف مختصر للمهام والإنجازات', degreePlaceholder:'المؤهل الدراسي', yearPlaceholder:'السنة',
    uniPlaceholder:'اسم الجامعة / المعهد', bulletPlaceholder:'عنصر جديد',
    langNamePlaceholder:'اللغة', langLevelPlaceholder:'المستوى', photoHint:'إضافة صورة',
    newExp:{title:'مسمى وظيفي جديد',org:'اسم الجهة',dates:'20xx — 20xx',desc:'وصف المهام والإنجازات.'},
    newEdu:{title:'مؤهل جديد',org:'اسم الجهة التعليمية',dates:'20xx',desc:''},
    newSkill:'مهارة جديدة', newLang:'لغة جديدة', newCourse:'دورة تدريبية جديدة', newHobby:'هواية جديدة', newReference:'الاسم – المسمى الوظيفي – رقم الهاتف',
    sampleName:'عثمان محمود', sampleRole:'مطوّر واجهات أمامية',
    sampleSummary:'مطوّر واجهات أمامية بخبرة عملية في بناء مواقع عربية سريعة وسهلة الاستخدام، مع تركيز خاص على دعم اللغة العربية والاتجاه من اليمين إلى اليسار.',
    sampleContacts:['name@email.com','+966 5x xxx xxxx','الرياض، السعودية','github.com/username']
  },
  en: {
    summary:'Professional Summary', experience:'Experience', education:'Education', skills:'Skills',
    contact:'Contact', courses:'Courses', languages:'Languages', hobbies:'Hobbies', references:'References',
    addExp:'+ Add Experience', addEdu:'+ Add Education', addSkill:'+ Add Skill',
    addLang:'+ Add Language', addCourse:'+ Add Course', addHobby:'+ Add Hobby', addReference:'+ Add Reference',
    namePlaceholder:'Full Name', rolePlaceholder:'Job Title', summaryPlaceholder:'Write a brief summary of your career and goals.',
    titlePlaceholder:'Job Title', datesPlaceholder:'Dates', orgPlaceholder:'Company / Organization',
    descPlaceholder:'Brief description of responsibilities and achievements', degreePlaceholder:'Degree', yearPlaceholder:'Year',
    uniPlaceholder:'University / Institute', bulletPlaceholder:'New item',
    langNamePlaceholder:'Language', langLevelPlaceholder:'Level', photoHint:'Add photo',
    newExp:{title:'New Job Title',org:'Company Name',dates:'20xx — Present',desc:'Description of duties and achievements.'},
    newEdu:{title:'New Qualification',org:'Institution Name',dates:'20xx',desc:''},
    newSkill:'New Skill', newLang:'New Language', newCourse:'New Course', newHobby:'New Hobby', newReference:'Name – Job Title – Phone Number',
    sampleName:'Osman Mahmoud', sampleRole:'Front-End Developer',
    sampleSummary:'Front-end developer experienced in building fast, user-friendly websites, with special focus on Arabic RTL support and clean, responsive interfaces.',
    sampleContacts:['name@email.com','+966 5x xxx xxxx','Riyadh, Saudi Arabia','github.com/username']
  }
};
let currentLang = 'ar';
let currentTpl = 1;
let customColors = null;
 
/* ---------------- data-driven entries (shared across templates) ---------------- */
const data = {
  ar: {
    header:{},
    exp: [
      {title:'مطوّر واجهات أمامية', org:'اسم الشركة', dates:'2023 — الآن', desc:'بناء وصيانة واجهات مستخدم متجاوبة باستخدام HTML وCSS وJavaScript، مع التركيز على الأداء وتجربة المستخدم العربية.'},
      {title:'فني تقنية معلومات', org:'اسم الشركة', dates:'2017 — 2025', desc:'دعم فني وصيانة للأنظمة والشبكات، وحل المشكلات التقنية اليومية للمستخدمين.'}
    ],
    edu: [ {title:'بكالوريوس تطبيقات الحاسوب (BCA)', org:'جامعة عثمانية، حيدر آباد', dates:'2014', desc:''} ],
    skills: ['HTML5','CSS3','JavaScript','دعم RTL العربي','GitHub Pages','Git'],
    langs: [ {name:'العربية', level:5}, {name:'الإنجليزية', level:4} ],
    courses: ['دورة تطوير الواجهات الأمامية', 'دورة تصميم تجربة المستخدم'],
    hobbies: ['القراءة','التصوير','التصميم'],
    references: ['أحمد جميعي – مدير – +999 000 00 00']
  },
  en: {
    header:{},
    exp: [
      {title:'Front-End Developer', org:'Company Name', dates:'2023 — Present', desc:'Building and maintaining responsive user interfaces with HTML, CSS, and JavaScript, with a focus on performance and Arabic-first UX.'},
      {title:'IT Technician', org:'Company Name', dates:'2017 — 2025', desc:'Technical support and maintenance for systems and networks, resolving day-to-day technical issues for users.'}
    ],
    edu: [ {title:'Bachelor of Computer Applications (BCA)', org:'Osmania University, Hyderabad', dates:'2014', desc:''} ],
    skills: ['HTML5','CSS3','JavaScript','Arabic RTL Support','GitHub Pages','Git'],
    langs: [ {name:'Arabic', level:5}, {name:'English', level:4} ],
    courses: ['Front-End Development Course', 'UX Design Course'],
    hobbies: ['Reading','Photography','Design'],
    references: ['Ahmed Jumaie – Manager – +999 000 00 00']
  }
};
let state = data[currentLang];
 
function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }
 
function expEntryHTML(d){
  const t=L[currentLang];
  return `<div class="entry">
    <button class="del-btn" data-del>×</button>
    <div class="row1">
      <span class="ttl" contenteditable="true" data-placeholder="${t.titlePlaceholder}">${d.title}</span>
      <span class="dates" contenteditable="true" data-placeholder="${t.datesPlaceholder}">${d.dates}</span>
    </div>
    <div class="org" contenteditable="true" data-placeholder="${t.orgPlaceholder}">${d.org}</div>
    <div class="desc" contenteditable="true" data-placeholder="${t.descPlaceholder}">${d.desc}</div>
  </div>`;
}
function eduEntryHTML(d){
  const t=L[currentLang];
  return `<div class="entry">
    <button class="del-btn" data-del>×</button>
    <div class="row1">
      <span class="ttl" contenteditable="true" data-placeholder="${t.degreePlaceholder}">${d.title}</span>
      <span class="dates" contenteditable="true" data-placeholder="${t.yearPlaceholder}">${d.dates}</span>
    </div>
    <div class="org" contenteditable="true" data-placeholder="${t.uniPlaceholder}">${d.org}</div>
  </div>`;
}
function chipHTML(text){
  return `<span class="chip">${text}<button class="del-btn" data-del>×</button></span>`;
}
function bulletHTML(text){
  return `<div class="entry bullet-item">
    <button class="del-btn" data-del>×</button>
    <div class="bullet-text" contenteditable="true" data-placeholder="${L[currentLang].bulletPlaceholder}">${text}</div>
  </div>`;
}
function langHTML(d){
  const t=L[currentLang];
  return `<div class="entry lang-item">
    <button class="del-btn" data-del>×</button>
    <div class="lang-row">
      <span contenteditable="true" data-placeholder="${t.langNamePlaceholder}">${d.name}</span>
      <span contenteditable="true" data-placeholder="${t.langLevelPlaceholder}">${'●'.repeat(d.level)}${'○'.repeat(5-d.level)}</span>
    </div>
  </div>`;
}
 
function renderAll(){
  document.querySelectorAll('.entries-exp').forEach(c=>{ c.innerHTML=''; state.exp.forEach(d=>c.appendChild(el(expEntryHTML(d)))); });
  document.querySelectorAll('.entries-edu').forEach(c=>{ c.innerHTML=''; state.edu.forEach(d=>c.appendChild(el(eduEntryHTML(d)))); });
  document.querySelectorAll('.chips-skills').forEach(c=>{ c.innerHTML=''; state.skills.forEach(s=>c.appendChild(el(chipHTML(s)))); });
  document.querySelectorAll('.langs').forEach(c=>{ c.innerHTML=''; state.langs.forEach(d=>c.appendChild(el(langHTML(d)))); });
  document.querySelectorAll('.list-courses').forEach(c=>{ c.innerHTML=''; state.courses.forEach(s=>c.appendChild(el(bulletHTML(s)))); });
  document.querySelectorAll('.list-hobbies').forEach(c=>{ c.innerHTML=''; state.hobbies.forEach(s=>c.appendChild(el(bulletHTML(s)))); });
  document.querySelectorAll('.list-references').forEach(c=>{ c.innerHTML=''; state.references.forEach(s=>c.appendChild(el(bulletHTML(s)))); });
}
renderAll();
 
/* add buttons */
document.addEventListener('click', (e)=>{
  const add = e.target.closest('[data-add]');
  if(add){
    const type = add.dataset.add;
    const t = L[currentLang];
    if(type==='exp') state.exp.push({...t.newExp});
    if(type==='edu') state.edu.push({...t.newEdu});
    if(type==='skill') state.skills.push(t.newSkill);
    if(type==='lang') state.langs.push({name:t.newLang, level:3});
    if(type==='course') state.courses.push(t.newCourse);
    if(type==='hobby') state.hobbies.push(t.newHobby);
    if(type==='reference') state.references.push(t.newReference);
    renderAll();
  }
  const del = e.target.closest('[data-del]');
  if(del){
    const entry = del.closest('.entry, .chip');
    entry.remove();
    syncStateFromDOM();
  }
});
 
function syncStateFromDOM(){
  const firstPage = document.querySelector('.entries-exp');
  if(firstPage){
    state.exp = [...firstPage.querySelectorAll('.entry')].map(en=>({
      title: en.querySelector('.ttl').innerHTML, dates: en.querySelector('.dates').innerHTML,
      org: en.querySelector('.org').innerHTML, desc: en.querySelector('.desc').innerHTML
    }));
  }
  const eduC = document.querySelector('.entries-edu');
  if(eduC){
    state.edu = [...eduC.querySelectorAll('.entry')].map(en=>({
      title: en.querySelector('.ttl').innerHTML, dates: en.querySelector('.dates').innerHTML,
      org: en.querySelector('.org').innerHTML, desc:''
    }));
  }
  const skC = document.querySelector('.chips-skills');
  if(skC){ state.skills = [...skC.querySelectorAll('.chip')].map(c=>c.firstChild.textContent.trim()); }
  const lC = document.querySelector('.langs');
  if(lC){
    state.langs = [...lC.querySelectorAll('.lang-item')].map(en=>{
      const spans = en.querySelectorAll('span');
      return {name: spans[0].innerHTML, level: 3, levelHTML: spans[1].innerHTML};
    });
  }
  const courseC = document.querySelector('.list-courses');
  if(courseC){ state.courses = [...courseC.querySelectorAll('.bullet-item')].map(en=>en.querySelector('.bullet-text').innerHTML); }
  const hobbyC = document.querySelector('.list-hobbies');
  if(hobbyC){ state.hobbies = [...hobbyC.querySelectorAll('.bullet-item')].map(en=>en.querySelector('.bullet-text').innerHTML); }
  const refC = document.querySelector('.list-references');
  if(refC){ state.references = [...refC.querySelectorAll('.bullet-item')].map(en=>en.querySelector('.bullet-text').innerHTML); }
}
document.addEventListener('focusout', (e)=>{
  if(e.target.matches('[contenteditable="true"]')) syncStateFromDOM();
});
 
/* photo upload */
document.addEventListener('change', (e)=>{
  if(e.target.matches('.photo-input')){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ document.querySelectorAll('.photo-wrap').forEach(p=>{ p.style.backgroundImage = `url(${reader.result})`; }); };
    reader.readAsDataURL(file);
  }
});
 
/* ---------------- color theme ---------------- */
function setColors(acc,acc2){ customColors={acc,acc2}; applyColors(); }
function resetColors(){ customColors=null; applyColors(); }
function applyColors(){
  const page = document.getElementById('cv');
  if(!page) return;
  if(customColors){ page.style.setProperty('--acc',customColors.acc); page.style.setProperty('--acc2',customColors.acc2); }
  else{ page.style.removeProperty('--acc'); page.style.removeProperty('--acc2'); }
}
 
/* ---------------- template switching ---------------- */
function currentPhoto(){ const p = document.querySelector('.photo-wrap'); return p ? p.style.backgroundImage : ''; }
 
function grabHeader(){
  const page = document.getElementById('cv');
  const q = sel => page.querySelector(sel)?.innerHTML ?? '';
  return {
    name: q('.t1-name, .t2-name, .t3-name, .t4-name, .t5-name, .t6-name, .t7-name, .t8-name, .t9-name, .t10-name, .t11-name, .t12-name, .t13-name, .t14-name'),
    role: q('.t1-role, .t2-role, .t3-role, .t5-role, .t6-role, .t7-role, .t8-role, .t9-role, .t10-role, .t11-role, .t12-role, .t13-role, .t14-role'),
    contacts: [...page.querySelectorAll('.t1-contact span, .t3-contact span, .t6-contact span, .t9-contact span, .t12-contact span, .t14-contact span, .sidebar .item, .sidebar .contact-text, .contact-line')].map(s=>s.innerHTML),
    summary: q('.summary-text'),
    photo: currentPhoto()
  };
}
 
function baseHead(h){
  const t=L[currentLang];
  if(!h.contacts || h.contacts.length===0){ h.contacts = [...t.sampleContacts]; }
  if(!h.summary){ h.summary = t.sampleSummary; }
  return h;
}
 
function photoDiv(){ return `<label class="photo-wrap"><input type="file" accept="image/*" class="photo-input" hidden><div class="hint">${L[currentLang].photoHint}</div></label>`; }
 
function sectionsMainSide(){
  const t=L[currentLang];
  return `
    <div class="block"><h2 class="sec">${t.experience}</h2><div class="entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div>
    <div class="block"><h2 class="sec">${t.education}</h2><div class="entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div>`;
}
function sectionsSide(){
  const t=L[currentLang];
  return `
    <div class="block"><h2 class="sec">${t.skills}</h2><div class="chips-skills"></div><button class="add-row" data-add="skill">${t.addSkill}</button></div>
    <div class="block"><h2 class="sec">${t.languages}</h2><div class="langs"></div><button class="add-row" data-add="lang">${t.addLang}</button></div>`;
}
 
function buildTpl1(h){
  const t=L[currentLang];
  return `
  <div class="t1-head">
    ${photoDiv()}
    <div>
      <div class="t1-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
      <div class="t1-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
      <div class="t1-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join('')}</div>
    </div>
  </div>
  <div class="body">
    <div class="main">
      <div class="block"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:13px;line-height:1.9;color:#4a463e;">${h.summary}</div></div>
      ${sectionsMainSide()}
    </div>
    <div class="side">${sectionsSide()}</div>
  </div>`;
}
 
function buildTpl2(h){
  const t=L[currentLang];
  return `
  <div class="sidebar">
    ${photoDiv()}
    <div class="t2-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
    <div class="t2-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    <h2 class="sec">${t.contact}</h2>
    ${h.contacts.map(c=>`<div class="item" contenteditable="true">${c}</div>`).join('')}
    <h2 class="sec">${t.skills}</h2>
    <div class="chips-skills"></div>
    <button class="add-row" data-add="skill" style="border-color:#3a4048;color:#cfd3da;">${t.addSkill}</button>
    <h2 class="sec">${t.languages}</h2>
    <div class="langs"></div>
    <button class="add-row" data-add="lang" style="border-color:#3a4048;color:#cfd3da;">${t.addLang}</button>
  </div>
  <div class="main">
    <div class="block"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:13px;line-height:1.9;color:#454b56;margin-bottom:8px;">${h.summary}</div></div>
    ${sectionsMainSide()}
  </div>`;
}
 
function buildTpl3(h){
  const t=L[currentLang];
  return `
  <div class="t3-head">
    <div class="t3-top">
      <div>
        <div class="t3-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
        <div class="t3-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
      </div>
      ${photoDiv()}
    </div>
    <div class="t3-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join('')}</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="block"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:13px;line-height:1.9;color:#4a453d;">${h.summary}</div></div>
      ${sectionsMainSide()}
    </div>
    <div class="side">${sectionsSide()}</div>
  </div>`;
}
 
function buildTpl4(h){
  const t=L[currentLang];
  return `
  <div class="t4-header">
    <div class="t4-header-inner">
      ${photoDiv()}
      <div>
        <div class="t4-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
        <div class="summary-text t4-desc" contenteditable="true" data-placeholder="${t.summaryPlaceholder}">${h.summary}</div>
      </div>
    </div>
    <div class="t4-wave"></div>
  </div>
  <div class="t4-cols">
    <div class="sidebar">
      ${h.contacts.map((c,i)=>`<div class="contact-item"><span class="icon">${['✆','✉','⚲','⚭'][i]||'•'}</span><span class="contact-text" contenteditable="true">${c}</span></div>`).join('')}
      <div class="pill-outline">${t.courses}</div><div class="list-courses"></div><button class="add-row" data-add="course">${t.addCourse}</button>
      <div class="pill-outline">${t.languages}</div><div class="langs"></div><button class="add-row" data-add="lang">${t.addLang}</button>
      <div class="pill-outline">${t.hobbies}</div><div class="list-hobbies"></div><button class="add-row" data-add="hobby">${t.addHobby}</button>
    </div>
    <div class="main">
      <div class="block"><div class="pill-fill">${t.experience}</div><div class="entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div>
      <div class="block"><div class="pill-fill">${t.education}</div><div class="entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div>
      <div class="block"><div class="pill-fill">${t.skills}</div><div class="chips-skills"></div><button class="add-row" data-add="skill">${t.addSkill}</button></div>
    </div>
  </div>`;
}
 
function buildTpl5(h){
  const t=L[currentLang];
  return `
  <div class="t5-side">
    ${photoDiv()}
    <div class="t5-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
    <div class="t5-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    <h2 class="sec">${t.summary}</h2>
    <div class="summary-text desc-block" contenteditable="true" data-placeholder="${t.summaryPlaceholder}">${h.summary}</div>
    <h2 class="sec">${t.contact}</h2>
    ${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}
    <h2 class="sec">${t.languages}</h2>
    <div class="langs"></div>
    <button class="add-row" data-add="lang">${t.addLang}</button>
    <h2 class="sec">${t.hobbies}</h2>
    <div class="list-hobbies"></div>
    <button class="add-row" data-add="hobby">${t.addHobby}</button>
  </div>
  <div class="t5-main">
    <h2 class="sec"><span class="badge">🎓</span>${t.education}</h2>
    <div class="timeline entries-edu"></div>
    <button class="add-row" data-add="edu" style="border-color:rgba(255,255,255,.3);color:#e9ecef;">${t.addEdu}</button>
    <h2 class="sec" style="margin-top:22px;"><span class="badge">💼</span>${t.experience}</h2>
    <div class="timeline entries-exp"></div>
    <button class="add-row" data-add="exp" style="border-color:rgba(255,255,255,.3);color:#e9ecef;">${t.addExp}</button>
    <h2 class="sec" style="margin-top:22px;"><span class="badge">⚙</span>${t.skills}</h2>
    <div class="chips-skills"></div>
    <button class="add-row" data-add="skill" style="border-color:rgba(255,255,255,.3);color:#e9ecef;">${t.addSkill}</button>
  </div>`;
}
 
function buildTpl6(h){
  const t=L[currentLang];
  return `
  <div class="t6-header">
    <div>
      <div class="t6-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
      <div class="t6-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
      <div class="t6-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join('')}</div>
    </div>
    ${photoDiv()}
  </div>
  <div class="t6-cols">
    <div class="sidebar">
      <h2 class="sec">${t.summary}</h2>
      <div class="summary-text desc-block" contenteditable="true" data-placeholder="${t.summaryPlaceholder}">${h.summary}</div>
      <h2 class="sec">${t.education}</h2>
      <div class="entries-edu"></div>
      <button class="add-row" data-add="edu">${t.addEdu}</button>
      <h2 class="sec">${t.skills}</h2>
      <div class="langs"></div>
      <button class="add-row" data-add="lang">${t.addLang}</button>
      <h2 class="sec">${t.hobbies}</h2>
      <div class="list-hobbies"></div>
      <button class="add-row" data-add="hobby">${t.addHobby}</button>
    </div>
    <div class="main">
      <h2 class="sec">${t.experience}</h2>
      <div class="entries-exp"></div>
      <button class="add-row" data-add="exp">${t.addExp}</button>
    </div>
  </div>`;
}
 
function buildTpl7(h){
  const t=L[currentLang];
  return `
  <div class="t7-head">
    <div class="t7-shape"></div>
    <div class="t7-top">
      <div>
        <div class="t7-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
        <div class="t7-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
      </div>
      ${photoDiv()}
    </div>
  </div>
  <div class="t7-body">
    <div class="main">
      <div class="block"><h2 class="sec">${t.education}</h2><div class="entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div>
      <div class="block"><h2 class="sec">${t.experience}</h2><div class="entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div>
    </div>
    <div class="side">
      <div class="block"><h2 class="sec">${t.contact}</h2>${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}</div>
      <div class="block"><h2 class="sec">${t.skills}</h2><div class="chips-skills"></div><button class="add-row" data-add="skill">${t.addSkill}</button></div>
      <div class="block"><h2 class="sec">${t.languages}</h2><div class="langs"></div><button class="add-row" data-add="lang">${t.addLang}</button></div>
    </div>
  </div>`;
}
 
function buildTpl8(h){
  const t=L[currentLang];
  return `
  <div class="t8-header">
    <div class="badge-check">✓</div>
    <div>
      <div class="t8-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
      <div class="t8-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    </div>
  </div>
  <div class="t8-cols">
    <div class="sidebar">
      ${photoDiv()}
      <h2 class="sec">${t.contact}</h2>
      ${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}
      <h2 class="sec">${t.skills}</h2>
      <div class="chips-skills"></div>
      <button class="add-row" data-add="skill">${t.addSkill}</button>
      <h2 class="sec">${t.languages}</h2>
      <div class="langs"></div>
      <button class="add-row" data-add="lang">${t.addLang}</button>
    </div>
    <div class="main">
      <div class="block"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:11.5px;line-height:1.8;color:#4c515a;">${h.summary}</div></div>
      <div class="block"><h2 class="sec">${t.experience}</h2><div class="entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div>
      <div class="block"><h2 class="sec">${t.education}</h2><div class="entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div>
      <div class="block"><h2 class="sec">${t.references}</h2><div class="list-references"></div><button class="add-row" data-add="reference">${t.addReference}</button></div>
    </div>
  </div>`;
}
 
function buildTpl9(h){
  const t=L[currentLang];
  return `
  <div class="t9-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
  <div class="t9-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
  <div class="t9-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join(' | ')}</div>
  <h2 class="sec">${t.summary}</h2>
  <div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:12.5px;line-height:1.8;">${h.summary}</div>
  <h2 class="sec">${t.experience}</h2>
  <div class="entries-exp"></div>
  <button class="add-row" data-add="exp">${t.addExp}</button>
  <h2 class="sec">${t.education}</h2>
  <div class="entries-edu"></div>
  <button class="add-row" data-add="edu">${t.addEdu}</button>
  <h2 class="sec">${t.skills}</h2>
  <div class="chips-skills"></div>
  <button class="add-row" data-add="skill">${t.addSkill}</button>
  <h2 class="sec">${t.languages}</h2>
  <div class="langs"></div>
  <button class="add-row" data-add="lang">${t.addLang}</button>
  <h2 class="sec">${t.courses}</h2>
  <div class="list-courses"></div>
  <button class="add-row" data-add="course">${t.addCourse}</button>
  <h2 class="sec">${t.hobbies}</h2>
  <div class="list-hobbies"></div>
  <button class="add-row" data-add="hobby">${t.addHobby}</button>`;
}
 
function buildTpl10(h){
  const t=L[currentLang];
  return `
  <div class="sidebar">
    ${photoDiv()}
    <div class="t10-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
    <div class="t10-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    <h2 class="sec">${t.contact}</h2>
    ${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}
    <h2 class="sec">${t.skills}</h2>
    <div class="chips-skills"></div>
    <button class="add-row" data-add="skill">${t.addSkill}</button>
  </div>
  <div class="main">
    <div class="block"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:12.5px;line-height:1.85;color:#4a4d53;">${h.summary}</div></div>
    <div class="block"><h2 class="sec">${t.education}</h2><div class="timeline entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div>
    <div class="block"><h2 class="sec">${t.hobbies}</h2><div class="list-hobbies"></div><button class="add-row" data-add="hobby">${t.addHobby}</button></div>
    <div class="block"><h2 class="sec">${t.experience}</h2><div class="timeline entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div>
  </div>`;
}
 
function buildTpl11(h){
  const t=L[currentLang];
  return `
  <div class="t11-top">
    <div class="t11-photo-block">${photoDiv()}</div>
    <div class="t11-name-block">
      <div class="t11-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
      <div class="t11-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    </div>
  </div>
  <div class="t11-cols">
    <div class="sidebar">
      <h2 class="sec">${t.contact}</h2>
      ${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}
      <h2 class="sec">${t.skills}</h2>
      <div class="chips-skills"></div>
      <button class="add-row" data-add="skill">${t.addSkill}</button>
      <h2 class="sec">${t.education}</h2>
      <div class="entries-edu"></div>
      <button class="add-row" data-add="edu">${t.addEdu}</button>
      <h2 class="sec">${t.courses}</h2>
      <div class="list-courses"></div>
      <button class="add-row" data-add="course">${t.addCourse}</button>
    </div>
    <div class="main">
      <h2 class="sec">${t.experience}</h2>
      <div class="timeline entries-exp"></div>
      <button class="add-row" data-add="exp">${t.addExp}</button>
    </div>
  </div>`;
}
 
function buildTpl12(h){
  const t=L[currentLang];
  return `
  <div class="t12-header">
    ${photoDiv()}
    <div class="t12-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
    <div class="t12-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
    <div class="t12-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join('')}</div>
  </div>
  <div class="body">
    <div class="block"><div class="badge">🎯</div><div class="content"><h2 class="sec">${t.summary}</h2><div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:12.5px;line-height:1.85;color:#4a4e56;">${h.summary}</div></div></div>
    <div class="block"><div class="badge">🎓</div><div class="content"><h2 class="sec">${t.education}</h2><div class="entries-edu"></div><button class="add-row" data-add="edu">${t.addEdu}</button></div></div>
    <div class="block"><div class="badge">💼</div><div class="content"><h2 class="sec">${t.experience}</h2><div class="entries-exp"></div><button class="add-row" data-add="exp">${t.addExp}</button></div></div>
    <div class="block"><div class="badge">⚙</div><div class="content"><h2 class="sec">${t.skills}</h2><div class="chips-skills skills-grid"></div><button class="add-row" data-add="skill">${t.addSkill}</button></div></div>
  </div>`;
}
 
function buildTpl13(h){
  const t=L[currentLang];
  return `
  <div class="t13-header">
    <div class="t13-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
    <div class="t13-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
  </div>
  <div class="t13-body">
    <div class="main">
      <div class="quote summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}">${h.summary}</div>
      <h2 class="sec"><span class="num">01</span>${t.experience}</h2>
      <div class="entries-exp"></div>
      <button class="add-row" data-add="exp">${t.addExp}</button>
      <h2 class="sec" style="margin-top:26px;"><span class="num">02</span>${t.education}</h2>
      <div class="entries-edu"></div>
      <button class="add-row" data-add="edu">${t.addEdu}</button>
    </div>
    <div class="side">
      <div class="block"><h2 class="sec"><span class="num">03</span>${t.skills}</h2><div class="chips-skills"></div><button class="add-row" data-add="skill">${t.addSkill}</button></div>
      <div class="block"><h2 class="sec"><span class="num">04</span>${t.languages}</h2><div class="langs"></div><button class="add-row" data-add="lang">${t.addLang}</button></div>
      <div class="block"><h2 class="sec"><span class="num">05</span>${t.contact}</h2>${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}</div>
    </div>
  </div>`;
}
 
function buildTpl14(h){
  const t=L[currentLang];
  return `
  <div class="grid">
    <div class="card header-card">
      ${photoDiv()}
      <div>
        <div class="t14-name" contenteditable="true" data-placeholder="${t.namePlaceholder}">${h.name||t.sampleName}</div>
        <div class="t14-role" contenteditable="true" data-placeholder="${t.rolePlaceholder}">${h.role||t.sampleRole}</div>
        <div class="t14-contact">${h.contacts.map(c=>`<span contenteditable="true">${c}</span>`).join('')}</div>
      </div>
    </div>
    <div class="card summary-card">
      <h2 class="sec"><span class="dot"></span>${t.summary}</h2>
      <div class="summary-text" contenteditable="true" data-placeholder="${t.summaryPlaceholder}" style="font-size:12.5px;line-height:1.85;color:#3a3f4a;">${h.summary}</div>
    </div>
    <div class="card exp-card">
      <h2 class="sec"><span class="dot"></span>${t.experience}</h2>
      <div class="entries-exp"></div>
      <button class="add-row" data-add="exp">${t.addExp}</button>
    </div>
    <div class="card skills-card">
      <h2 class="sec"><span class="dot"></span>${t.skills}</h2>
      <div class="chips-skills"></div>
      <button class="add-row" data-add="skill">${t.addSkill}</button>
    </div>
    <div class="card langs-card">
      <h2 class="sec"><span class="dot"></span>${t.languages}</h2>
      <div class="langs"></div>
      <button class="add-row" data-add="lang">${t.addLang}</button>
    </div>
    <div class="card edu-card" style="grid-column:span 2;">
      <h2 class="sec"><span class="dot"></span>${t.education}</h2>
      <div class="entries-edu"></div>
      <button class="add-row" data-add="edu">${t.addEdu}</button>
    </div>
    <div class="card hobbies-card" style="grid-column:span 2;">
      <h2 class="sec"><span class="dot"></span>${t.hobbies}</h2>
      <div class="list-hobbies"></div>
      <button class="add-row" data-add="hobby">${t.addHobby}</button>
    </div>
    <div class="card courses-card" style="grid-column:span 2;">
      <h2 class="sec"><span class="dot"></span>${t.courses}</h2>
      <div class="list-courses"></div>
      <button class="add-row" data-add="course">${t.addCourse}</button>
    </div>
    <div class="card contact-card" style="grid-column:span 2;">
      <h2 class="sec"><span class="dot"></span>${t.contact}</h2>
      ${h.contacts.map(c=>`<div class="contact-line" contenteditable="true">${c}</div>`).join('')}
    </div>
  </div>`;
}
 
const templates = { 1:buildTpl1, 2:buildTpl2, 3:buildTpl3, 4:buildTpl4, 5:buildTpl5, 6:buildTpl6, 7:buildTpl7, 8:buildTpl8, 9:buildTpl9, 10:buildTpl10, 11:buildTpl11, 12:buildTpl12, 13:buildTpl13, 14:buildTpl14 };
const FLEX_PAGE_TPLS = [2,5,10];
 
function switchTemplate(n, headerOverride){
  n = parseInt(n,10);
  const h = headerOverride || baseHead(grabHeader());
  currentTpl = n;
  const page = document.getElementById('cv');
  page.className = 'page tpl-' + n;
  page.style.display = FLEX_PAGE_TPLS.includes(n) ? 'flex' : 'block';
  page.setAttribute('dir', currentLang==='ar' ? 'rtl' : 'ltr');
  page.setAttribute('lang', currentLang);
  page.innerHTML = templates[n](h);
  if(h.photo){ document.querySelectorAll('.photo-wrap').forEach(p=>p.style.backgroundImage=h.photo); }
  renderAll();
  applyColors();
  document.querySelectorAll('.tpl-btn').forEach(b=>b.classList.toggle('active', b.dataset.tpl==String(n)));
}
 
function setLang(lang){
  if(lang===currentLang) return;
  data[currentLang].header = baseHead(grabHeader());
  currentLang = lang;
  state = data[lang];
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  const saved = data[lang].header;
  const h = (saved && saved.name) ? saved : baseHead({});
  switchTemplate(currentTpl, h);
}
 
document.querySelectorAll('.tpl-btn').forEach(btn=>{ btn.addEventListener('click', ()=> switchTemplate(btn.dataset.tpl)); });
document.querySelectorAll('.lang-btn').forEach(btn=>{ btn.addEventListener('click', ()=> setLang(btn.dataset.lang)); });
 
switchTemplate(1);