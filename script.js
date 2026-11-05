
"use strict";

document.addEventListener("DOMContentLoaded",()=>{

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const header=$("#header");
const navigation=$("#navigation");
const menuToggle=$("#menuToggle");
const filterButtons=$$(".filter-button");
const suiteCards=$$(".suite-card");
const suiteModal=$("#suiteModal");
const modalDialog=$(".modal-dialog",suiteModal);
const modalClose=$("#modalClose");
const modalImage=$("#modalImage");
const modalCounter=$("#modalCounter");
const modalThumbnails=$("#modalThumbnails");
const modalCategory=$("#modalCategory");
const modalTitle=$("#modalTitle");
const modalDescription=$("#modalDescription");
const modalCapacity=$("#modalCapacity");
const modalType=$("#modalType");
const modalReserve=$("#modalReserve");
const lightbox=$("#lightbox");
const lightboxDialog=$(".lightbox-dialog",lightbox);
const lightboxImage=$("#lightboxImage");
const lightboxCounter=$("#lightboxCounter");
const lightboxClose=$("#lightboxClose");
const galleryButtons=$$("[data-gallery]");
const quickForm=$("#quickBookingForm");
const reservationForm=$("#reservationForm");
const quickFeedback=$("#quickBookingFeedback");
const reservationFeedback=$("#reservationFeedback");

const photo=(id,w=1400)=>
`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const suites={
jardim:{
title:"Suíte Jardim",
category:"ACOMODAÇÃO ESSENCIAL",
type:"Essencial",
capacity:"2 hóspedes",
description:"Uma proposta de acomodação acolhedora, com atmosfera tranquila, materiais naturais e uma estética que valoriza a simplicidade. Este quarto é um conceito demonstrativo, não uma acomodação disponível.",
images:[
photo("photo-1611892440504-42a792e24d32"),
photo("photo-1616594039964-ae9021a400a0"),
photo("photo-1590490360182-c33d57733427")
]
},
horizonte:{
title:"Suíte Horizonte",
category:"ACOMODAÇÃO PREMIUM",
type:"Premium",
capacity:"2 hóspedes",
description:"Um conceito de suíte contemporânea que combina conforto, amplitude e uma apresentação visual sofisticada. As fotografias são referências independentes.",
images:[
photo("photo-1590490360182-c33d57733427"),
photo("photo-1566665797739-1674de7a421a"),
photo("photo-1611892440504-42a792e24d32")
]
},
aurora:{
title:"Suíte Aurora",
category:"ACOMODAÇÃO EXCLUSIVA",
type:"Exclusiva",
capacity:"2 hóspedes",
description:"Uma acomodação conceitual inspirada em experiências de hospitalidade de alto padrão, com atenção à iluminação, às texturas e à sensação de privacidade.",
images:[
photo("photo-1566665797739-1674de7a421a"),
photo("photo-1590490360182-c33d57733427"),
photo("photo-1616594039964-ae9021a400a0")
]
},
refugio:{
title:"Suíte Refúgio",
category:"ACOMODAÇÃO PREMIUM",
type:"Premium",
capacity:"2 hóspedes",
description:"Uma proposta visual que valoriza o descanso e o acolhimento, com ambientes de tons suaves e referências de design contemporâneo.",
images:[
photo("photo-1616594039964-ae9021a400a0"),
photo("photo-1611892440504-42a792e24d32"),
photo("photo-1566665797739-1674de7a421a")
]
}
};

// ANO DO RODAPÉ
const currentYear=$("#currentYear");
if(currentYear)currentYear.textContent=new Date().getFullYear();

// CABEÇALHO
function updateHeader(){
header?.classList.toggle("scrolled",window.scrollY>50);
}
updateHeader();
window.addEventListener("scroll",updateHeader,{passive:true});

// MENU MOBILE
function closeMenu(){
navigation?.classList.remove("open");
menuToggle?.setAttribute("aria-expanded","false");
menuToggle?.setAttribute("aria-label","Abrir menu");
}

menuToggle?.addEventListener("click",()=>{
const opened=navigation.classList.toggle("open");
menuToggle.setAttribute("aria-expanded",String(opened));
menuToggle.setAttribute("aria-label",opened?"Fechar menu":"Abrir menu");
});

$$(".navigation a").forEach(link=>{
link.addEventListener("click",closeMenu);
});

document.addEventListener("click",event=>{
if(
navigation?.classList.contains("open")&&
!navigation.contains(event.target)&&
!menuToggle.contains(event.target)
){
closeMenu();
}
});

window.addEventListener("resize",()=>{
if(window.innerWidth>900)closeMenu();
});

// LINKS ATIVOS
if("IntersectionObserver" in window){
const sectionObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;

$$(".nav-link").forEach(link=>{
link.classList.toggle(
"active",
link.getAttribute("href")===`#${entry.target.id}`
);
});
});
},{
rootMargin:"-25% 0px -60% 0px",
threshold:0
});

$$("main section[id]").forEach(section=>{
sectionObserver.observe(section);
});
}

// ANIMAÇÕES
const revealElements=$$(".reveal");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!reducedMotion&&"IntersectionObserver" in window){
document.documentElement.classList.add("js-ready");

const revealObserver=new IntersectionObserver((entries,observer)=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;
entry.target.classList.add("visible");
observer.unobserve(entry.target);
});
},{
threshold:0.08,
rootMargin:"0px 0px -30px 0px"
});

revealElements.forEach(element=>{
revealObserver.observe(element);
});
}else{
revealElements.forEach(element=>{
element.classList.add("visible");
});
}

// FILTROS DAS SUÍTES
filterButtons.forEach(button=>{
button.addEventListener("click",()=>{
const filter=button.dataset.filter;

filterButtons.forEach(item=>{
const active=item===button;
item.classList.toggle("active",active);
item.setAttribute("aria-pressed",String(active));
});

suiteCards.forEach(card=>{
card.hidden=filter!=="todas"&&card.dataset.category!==filter;
});
});
});

// CONTROLE DOS MODAIS
let activeModal=null;
let previousFocus=null;
let currentSuite=null;
let suiteImageIndex=0;
let galleryIndex=0;

function openModal(element){
if(activeModal)closeModal();

previousFocus=document.activeElement;
activeModal=element;
element.classList.add("is-open");
element.setAttribute("aria-hidden","false");
document.body.classList.add("modal-open");

const closeButton=$(".modal-close,.lightbox-close",element);
closeButton?.focus();
}

function closeModal(){
if(!activeModal)return;

const closing=activeModal;
closing.classList.remove("is-open");
closing.setAttribute("aria-hidden","true");
activeModal=null;
document.body.classList.remove("modal-open");

if(closing===suiteModal){
modalImage.removeAttribute("src");
currentSuite=null;
}else if(closing===lightbox){
lightboxImage.removeAttribute("src");
}

if(previousFocus instanceof HTMLElement&&previousFocus.isConnected){
previousFocus.focus();
}
previousFocus=null;
}

// GALERIA DAS SUÍTES
function showSuiteImage(index){
if(!currentSuite)return;

const images=currentSuite.images;
suiteImageIndex=(index+images.length)%images.length;

modalImage.src=images[suiteImageIndex];
modalImage.alt=`Referência visual ${suiteImageIndex+1} da ${currentSuite.title}`;

modalCounter.textContent=
`${String(suiteImageIndex+1).padStart(2,"0")} / ${String(images.length).padStart(2,"0")}`;

modalThumbnails.replaceChildren();

images.forEach((src,i)=>{
const button=document.createElement("button");
const image=document.createElement("img");

button.type="button";
button.classList.toggle("active",i===suiteImageIndex);
button.setAttribute("aria-label",`Visualizar fotografia ${i+1}`);
button.setAttribute("aria-pressed",String(i===suiteImageIndex));

image.src=src;
image.alt="";
image.loading="lazy";

button.appendChild(image);
button.addEventListener("click",()=>showSuiteImage(i));
modalThumbnails.appendChild(button);
});
}

function openSuite(key){
const suite=suites[key];
if(!suite)return;

currentSuite=suite;
suiteImageIndex=0;

modalCategory.textContent=suite.category;
modalTitle.textContent=suite.title;
modalDescription.textContent=suite.description;
modalCapacity.textContent=suite.capacity;
modalType.textContent=suite.type;

showSuiteImage(0);
openModal(suiteModal);
}

$$("[data-suite]").forEach(button=>{
button.addEventListener("click",()=>{
openSuite(button.dataset.suite);
});
});

modalClose?.addEventListener("click",closeModal);

$$("[data-close-suite]").forEach(element=>{
element.addEventListener("click",closeModal);
});

modalReserve?.addEventListener("click",()=>{
const selected=Object.entries(suites).find(
([key,value])=>value===currentSuite
);

if(selected){
const suiteSelect=$("#suiteSelect");
if(suiteSelect)suiteSelect.value=selected[0];
}

closeModal();
});

// LIGHTBOX DA GALERIA
const gallery=galleryButtons.map(button=>{
const image=$("img",button);

return{
src:image?.src||"",
alt:image?.alt||"Fotografia ilustrativa do hotel"
};
});

function showGalleryImage(index){
if(!gallery.length)return;

galleryIndex=(index+gallery.length)%gallery.length;
const item=gallery[galleryIndex];

lightboxImage.src=item.src;
lightboxImage.alt=item.alt;

lightboxCounter.textContent=
`${String(galleryIndex+1).padStart(2,"0")} / ${String(gallery.length).padStart(2,"0")}`;
}

galleryButtons.forEach((button,index)=>{
button.addEventListener("click",()=>{
showGalleryImage(index);
openModal(lightbox);
});
});

lightboxClose?.addEventListener("click",closeModal);

$$("[data-close-lightbox]").forEach(element=>{
element.addEventListener("click",closeModal);
});

$("#lightboxPrevious")?.addEventListener("click",()=>{
showGalleryImage(galleryIndex-1);
});

$("#lightboxNext")?.addEventListener("click",()=>{
showGalleryImage(galleryIndex+1);
});

// TECLADO E ACESSIBILIDADE
document.addEventListener("keydown",event=>{
if(event.key==="Escape"){
closeMenu();
closeModal();
return;
}

if(!activeModal)return;

if(activeModal===lightbox){
if(event.key==="ArrowRight"){
event.preventDefault();
showGalleryImage(galleryIndex+1);
}
if(event.key==="ArrowLeft"){
event.preventDefault();
showGalleryImage(galleryIndex-1);
}
}

if(activeModal===suiteModal){
if(event.key==="ArrowRight"){
event.preventDefault();
showSuiteImage(suiteImageIndex+1);
}
if(event.key==="ArrowLeft"){
event.preventDefault();
showSuiteImage(suiteImageIndex-1);
}
}

if(event.key==="Tab"){
const dialog=activeModal===suiteModal?modalDialog:lightboxDialog;
const focusable=$$(
'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex="0"]',
dialog
).filter(element=>element.getClientRects().length>0);

if(!focusable.length){
event.preventDefault();
dialog.focus();
return;
}

const first=focusable[0];
const last=focusable[focusable.length-1];

if(event.shiftKey&&document.activeElement===first){
event.preventDefault();
last.focus();
}else if(!event.shiftKey&&document.activeElement===last){
event.preventDefault();
first.focus();
}
}
});

// FAQ
const faqItems=$$(".faq-item");

faqItems.forEach(item=>{
item.addEventListener("toggle",()=>{
if(!item.open)return;

faqItems.forEach(other=>{
if(other!==item)other.open=false;
});
});
});

// DATAS DAS RESERVAS
const dateInputs={
quickCheckin:$("#quickCheckin"),
quickCheckout:$("#quickCheckout"),
checkin:$("#checkin"),
checkout:$("#checkout")
};

function localDateString(date){
const year=date.getFullYear();
const month=String(date.getMonth()+1).padStart(2,"0");
const day=String(date.getDate()).padStart(2,"0");
return`${year}-${month}-${day}`;
}

function parseLocalDate(value){
if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;

const [year,month,day]=value.split("-").map(Number);
const date=new Date(year,month-1,day);

if(
date.getFullYear()!==year||
date.getMonth()!==month-1||
date.getDate()!==day
)return null;

return date;
}

function addDays(value,days){
const date=parseLocalDate(value);
if(!date)return"";
date.setDate(date.getDate()+days);
return localDateString(date);
}

function setupDatePair(checkin,checkout){
if(!checkin||!checkout)return;

function updateLimits(){
const today=localDateString(new Date());
checkin.min=today;

if(checkin.value&&checkin.value<today){
checkin.value="";
}

const minimumCheckout=checkin.value
?addDays(checkin.value,1)
:addDays(today,1);

checkout.min=minimumCheckout;

if(checkout.value&&checkout.value<minimumCheckout){
checkout.value="";
}
}

checkin.addEventListener("change",updateLimits);
checkout.addEventListener("change",updateLimits);
updateLimits();

return updateLimits;
}

const updateQuickDates=setupDatePair(
dateInputs.quickCheckin,
dateInputs.quickCheckout
);

const updateReservationDates=setupDatePair(
dateInputs.checkin,
dateInputs.checkout
);

document.addEventListener("visibilitychange",()=>{
if(!document.hidden){
updateQuickDates?.();
updateReservationDates?.();
}
});

// VALIDAÇÃO DE RESERVA
function validateDates(checkinValue,checkoutValue){
if(!checkinValue||!checkoutValue){
return"Selecione as datas de check-in e check-out.";
}

const checkin=parseLocalDate(checkinValue);
const checkout=parseLocalDate(checkoutValue);
const today=parseLocalDate(localDateString(new Date()));

if(!checkin||!checkout){
return"Informe datas válidas.";
}

if(checkin<today){
return"O check-in não pode ser anterior à data atual.";
}

if(checkout<=checkin){
return"O check-out deve ser posterior ao check-in.";
}

return null;
}

function formatDate(value){
const date=parseLocalDate(value);
if(!date)return"";
return new Intl.DateTimeFormat("pt-BR",{
day:"2-digit",
month:"2-digit",
year:"numeric"
}).format(date);
}

// FORMULÁRIO RÁPIDO
quickForm?.addEventListener("submit",event=>{
event.preventDefault();

const checkin=dateInputs.quickCheckin.value;
const checkout=dateInputs.quickCheckout.value;
const guests=$("#quickGuests").value;

const error=validateDates(checkin,checkout);

if(error){
quickFeedback.textContent=error;
return;
}

const guestText=guests==="1"?"hóspede":"hóspedes";

quickFeedback.textContent=
`Simulação: ${formatDate(checkin)} a ${formatDate(checkout)}, ${guests} ${guestText}. Nenhuma disponibilidade foi consultada e nenhuma reserva foi realizada.`;
});

// FORMULÁRIO COMPLETO
reservationForm?.addEventListener("submit",event=>{
event.preventDefault();

const checkin=dateInputs.checkin.value;
const checkout=dateInputs.checkout.value;
const suiteKey=$("#suiteSelect").value;
const guests=$("#guests").value;

const error=validateDates(checkin,checkout);

if(error){
reservationFeedback.textContent=error;
return;
}

if(!suites[suiteKey]){
reservationFeedback.textContent="Selecione uma acomodação.";
return;
}

reservationFeedback.textContent=
`Demonstração concluída: ${suites[suiteKey].title}, ${formatDate(checkin)} a ${formatDate(checkout)}, ${guests} ${guests==="1"?"hóspede":"hóspedes"}. Nenhuma reserva foi realizada e nenhum dado foi enviado ou armazenado.`;
});

// VERIFICAÇÃO DE IMAGENS
document.querySelectorAll("img").forEach(img=>{
img.addEventListener("error",()=>{
console.warn("Imagem indisponível:",img.currentSrc||img.src);
});
});

// Ativa submissões somente após instalar os controles demonstrativos.
document.querySelectorAll("[data-demo-submit]").forEach(button=>{button.disabled=false;});
});
