/* Figuras interactivas de Sistemas basados en Microprocesador. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- helpers Sistemas basados en Microprocesador ---- */
const NR=(x,d)=>{if(!isFinite(x))return '—';const s=x.toFixed(d===undefined?2:d);return (Math.abs(parseFloat(s))<1e-12?(0).toFixed(d===undefined?2:d):s).replace('.',',');};
const N0=x=>NR(x,0),N1=x=>NR(x,1),N2=x=>NR(x,2),N3=x=>NR(x,3),N4=x=>NR(x,4);
const sup=s=>String(s).replace(/-/g,'−');
const HEX=(v,n)=>'0x'+(v>>>0).toString(16).toUpperCase().padStart(n||2,'0');
const BIN=v=>(v>>>0).toString(2).padStart(8,'0');
function Rbox(a,x,y,w,h,col,r){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fillStyle=col;g.fill();}
function Rline(a,x,y,w,h,col,r,lw){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.strokeStyle=col;g.lineWidth=lw||1.5;g.stroke();}
function alpha(a,v,fn){a.g.save();a.g.globalAlpha=v;fn();a.g.restore();}
/* dibuja un byte como 8 celdas de bit */
function byteBits(a,x,y,v,col,w,etiq){w=w||26;
  for(let i=7;i>=0;i--){const bit=(v>>i)&1, cx=x+(7-i)*(w+3);
    if(bit)Rbox(a,cx,y,w,24,col,3); else Rline(a,cx,y,w,24,C.grid,3,1.2);
    a.txt(String(bit),cx+w/2,y+17,bit?C.bg:C.muted,13,'center');
    if(etiq)a.txt(etiq[7-i],cx+w/2,y-6,C.muted,9.5,'center');}}

/* 1 · Arquitectura y mapa de memoria */
SIMS.arquitectura=el=>build(el,{w:680,h:316,
 selects:[{k:'rp0',l:'Bit RP0 de STATUS',v:'0',opts:[['0','RP0 = 0 → banco 0'],['1','RP0 = 1 → banco 1']]}],
 sliders:[{k:'dir',l:'Dirección accedida',v:6,min:0,max:15,step:1,u:'h'},
  {k:'fosc',l:'Oscilador',v:4,min:1,max:20,step:1,u:'MHz'}],
 draw(a){a.clear();const s=a.st,b1=s.rp0==='1';
  const b0=['INDF','TMR0','PCL','STATUS','FSR','PORTA','PORTB','—','EEDATA','EEADR','PCLATH','INTCON','GPR','GPR','GPR','GPR'];
  const b1n=['INDF','OPTION','PCL','STATUS','FSR','TRISA','TRISB','—','EECON1','EECON2','PCLATH','INTCON','espejo','espejo','espejo','espejo'];
  const ox=44,oy=66,cw=128,rh=15;
  [['BANCO 0',ox,b0,!b1],['BANCO 1',ox+cw+30,b1n,b1]].forEach(([tit,x,lista,act])=>{
    a.txt(tit,x+cw/2,oy-16,act?C.a:C.muted,12.5,'center');
    Rline(a,x-4,oy-6,cw+8,16*rh+10,act?C.a:C.grid,5,act?2:1.2);
    lista.forEach((n,i)=>{const y=oy+i*rh;
      if(i===s.dir&&act){Rbox(a,x-1,y-1,cw+2,rh,C.a,2);}
      a.txt(HEX(i+(act&&b1?0x80:0)),x+4,y+11,i===s.dir&&act?C.bg:C.muted,9.5);
      a.txt(n,x+46,y+11,i===s.dir&&act?C.bg:(act?C.text:C.muted),10.5);});});
  /* panel */
  const bx=366,by=62;
  a.txt('Acceso a la dirección '+HEX(s.dir),bx,by-16,C.a,13);
  a.txt('Con RP0 = '+(b1?'1':'0')+' se accede a',bx,by+10,C.muted,12);
  a.txt(b1?b1n[s.dir]:b0[s.dir],bx,by+36,C.b,22);
  if(s.dir===6||s.dir===5){
    a.txt(b1?'(configuración de dirección)':'(dato del puerto)',bx,by+58,C.muted,11.5);
    a.txt('⚠ el mismo número de dirección',bx,by+88,C.d,11.5);
    a.txt('da DOS registros distintos',bx,by+106,C.d,11.5);
    a.txt('según el banco',bx,by+124,C.d,11.5);}
  else if(s.dir===1)a.txt(b1?'(configura el TMR0)':'(cuenta del TMR0)',bx,by+58,C.muted,11.5);
  else if(s.dir>=12)a.txt('registro de propósito general',bx,by+58,C.muted,11.5);
  a.txt('Ciclo de instrucción',bx,by+154,C.muted,12);
  a.txt('T = 4 / '+N0(s.fosc)+' MHz = '+N2(4/s.fosc)+' µs',bx,by+178,C.c,15);
  a.txt('1 µs exacto a 4 MHz',bx,by+202,C.muted,11);
  a.txt('Memoria del PIC16F84A',bx,by+230,C.muted,11.5);
  a.txt('programa 1 K × 14 bits · RAM 68 B · EEPROM 64 B',bx,by+248,C.text,10.5);
  a.html(b1
   ? 'Con <b>RP0 = 1</b> estás en el <b>banco 1</b>, donde viven los registros de <b>configuración</b>: TRISA, TRISB y OPTION. Aquí se decide qué patillas son entradas y cómo funciona el TMR0.<br>Se llega con <code>bsf STATUS,RP0</code> y <b>hay que volver</b> con <code>bcf STATUS,RP0</code>.'
   : 'Con <b>RP0 = 0</b> estás en el <b>banco 0</b>, el de trabajo: PORTA, PORTB, TMR0 y tus variables a partir de 0x0C.<br>Mueve la dirección hasta 06h y cambia de banco: verás que el mismo número da <b>TRISB o PORTB</b> según RP0. Olvidar ese cambio es el error número uno de la asignatura.');
 }});

/* 2 · Ejecución de instrucciones */
SIMS.instrucciones=el=>build(el,{w:680,h:306,
 selects:[{k:'ins',l:'Instrucción',v:'subwf',opts:[['movlw','movlw k    — W ← constante'],['movwf','movwf f    — f ← W'],['addwf','addwf f,d  — f + W'],['subwf','subwf f,d  — f − W  (comparar)'],['andwf','andwf f,d  — f AND W'],['iorwf','iorwf f,d  — f OR W'],['xorwf','xorwf f,d  — f XOR W'],['decfsz','decfsz f,d — decrementa y salta si 0'],['rlf','rlf f,d    — rota a la izquierda']]},
  {k:'d',l:'Bit de destino',v:'0',opts:[['0','d = 0 → el resultado va a W'],['1','d = 1 → el resultado va al registro f']]}],
 sliders:[{k:'w',l:'Valor de W',v:10,min:0,max:255,step:1},{k:'f',l:'Valor del registro f',v:25,min:0,max:255,step:1}],
 draw(a){a.clear();const s=a.st,W=s.w,F=s.f,d=s.d==='1';
  let res=0,C_=null,Z=null,salta=false,txt='';
  switch(s.ins){
   case 'movlw': res=F; txt='W ← '+F; break;
   case 'movwf': res=W; txt='f ← W'; break;
   case 'addwf': {const t=F+W; res=t&0xFF; C_=t>255?1:0; Z=res===0?1:0; txt='f + W = '+F+' + '+W+' = '+t; break;}
   case 'subwf': {const t=F-W; res=(t+256)&0xFF; C_=t>=0?1:0; Z=res===0?1:0; txt='f − W = '+F+' − '+W+' = '+t; break;}
   case 'andwf': res=F&W; Z=res===0?1:0; txt='f AND W'; break;
   case 'iorwf': res=F|W; Z=res===0?1:0; txt='f OR W'; break;
   case 'xorwf': res=F^W; Z=res===0?1:0; txt='f XOR W'; break;
   case 'decfsz': {res=(F-1+256)&0xFF; salta=res===0; txt='f − 1 = '+res+(salta?'  → SALTA la siguiente':''); break;}
   case 'rlf': {res=((F<<1)|0)&0xFF; C_=(F>>7)&1; txt='rota a la izquierda a través del carry'; break;}
  }
  const destW = s.ins==='movlw' || (!d && s.ins!=='movwf');
  const nW = s.ins==='movwf'?W:(destW?res:W);
  const nF = s.ins==='movwf'?res:(!destW&&s.ins!=='movlw'?res:F);
  /* antes */
  const ox=48,oy=72;
  a.txt('ANTES',ox,oy-24,C.muted,12.5);
  a.txt('W',ox,oy+18,C.muted,12);byteBits(a,ox+26,oy,W,C.muted,22);
  a.txt(HEX(W)+' = '+W,ox+228,oy+18,C.muted,12);
  a.txt('f',ox,oy+54,C.muted,12);byteBits(a,ox+26,oy+36,F,C.muted,22);
  a.txt(HEX(F)+' = '+F,ox+228,oy+54,C.muted,12);
  /* operación */
  a.txt(s.ins+(s.ins==='movlw'?'  '+F:(['movwf'].includes(s.ins)?'  f':'  f,'+s.d)),ox,oy+96,C.a,15);
  a.txt(txt,ox+150,oy+96,C.text,12.5);
  /* después */
  a.txt('DESPUÉS',ox,oy+134,C.c,12.5);
  a.txt('W',ox,oy+176,C.muted,12);byteBits(a,ox+26,oy+158,nW,nW!==W?C.a:C.muted,22);
  a.txt(HEX(nW)+' = '+nW,ox+228,oy+176,nW!==W?C.a:C.muted,12);
  a.txt('f',ox,oy+212,C.muted,12);byteBits(a,ox+26,oy+194,nF,nF!==F?C.a:C.muted,22);
  a.txt(HEX(nF)+' = '+nF,ox+228,oy+212,nF!==F?C.a:C.muted,12);
  /* banderas */
  const bx=430,by=78;
  a.txt('Banderas de STATUS',bx,by-20,C.muted,12);
  [['Z',Z,'resultado cero'],['C',C_,s.ins==='subwf'?'f ≥ W (sin préstamo)':'acarreo']].forEach((v,i)=>{
    const y=by+i*44;
    a.txt(v[0],bx,y+16,C.muted,13);
    if(v[1]===null){Rline(a,bx+24,y,28,24,C.grid,3,1.2);a.txt('—',bx+38,y+17,C.muted,12,'center');}
    else{if(v[1])Rbox(a,bx+24,y,28,24,C.c,3);else Rline(a,bx+24,y,28,24,C.grid,3,1.2);
      a.txt(String(v[1]),bx+38,y+17,v[1]?C.bg:C.muted,13,'center');}
    a.txt(v[2],bx+62,y+17,C.muted,11);});
  a.txt('Destino',bx,by+114,C.muted,12);
  a.txt(destW?'el resultado va a W':'el resultado va al registro f',bx,by+136,C.a,12.5);
  if(s.ins==='subwf'){a.txt('Comparación',bx,by+172,C.muted,12);
    a.txt(Z?'f = W (iguales)':(C_?'f > W':'f < W'),bx,by+194,C.b,15);}
  if(salta)a.txt('se salta la instrucción siguiente',bx,by+172,C.d,12);
  a.html(s.ins==='subwf'
   ? 'La instrucción <b>subwf</b> calcula <b>f − W</b>, no al revés. Con destino 0 el registro f no se toca y sólo cambian las banderas: así se compara. <b>Z = 1</b> significa iguales y <b>C = 1</b> significa f ≥ W, porque en el PIC el carry en la resta indica «<b>no hubo préstamo</b>».'
   : s.ins==='decfsz'
   ? '<b>decfsz</b> decrementa y, si el resultado es cero, <b>se salta la instrucción siguiente</b>. No salta a ninguna etiqueta: por eso se pone un <code>goto</code> detrás. Cuando salta, cuesta 2 ciclos en vez de 1.'
   : 'Cambia el <b>bit de destino</b> y observa qué registro se modifica: con <b>d = 0</b> el resultado va a W y f se conserva; con <b>d = 1</b> se escribe sobre f. Confundirlos es el error más frecuente al empezar.');
 }});

/* 3 · Máscaras */
SIMS.mascaras=el=>build(el,{w:680,h:290,
 selects:[{k:'op',l:'Operación',v:'and',opts:[['and','AND — aislar / borrar bits'],['or','OR — forzar bits a 1'],['xor','XOR — invertir bits']]}],
 sliders:[{k:'dato',l:'Dato leído del puerto',v:182,min:0,max:255,step:1},
  {k:'masc',l:'Máscara',v:15,min:0,max:255,step:1}],
 draw(a){a.clear();const s=a.st;
  const r = s.op==='and'? (s.dato&s.masc) : (s.op==='or'? (s.dato|s.masc) : (s.dato^s.masc));
  const ox=96,oy=74,w=40;
  const etiq=['b7','b6','b5','b4','b3','b2','b1','b0'];
  a.txt('dato',ox-14,oy+18,C.muted,12.5,'right');
  byteBits(a,ox,oy,s.dato,C.muted,w,etiq);
  a.txt(HEX(s.dato),ox+8*(w+3)+10,oy+18,C.muted,12);
  a.txt('máscara',ox-14,oy+62,C.muted,12.5,'right');
  byteBits(a,ox,oy+44,s.masc,C.b,w);
  a.txt(HEX(s.masc),ox+8*(w+3)+10,oy+62,C.b,12);
  a.txt({and:'AND',or:'OR',xor:'XOR'}[s.op],ox-14,oy+40,C.a,14,'right');
  a.line(ox,oy+72,ox+8*(w+3)-3,oy+72,C.muted,1.5);
  a.txt('resultado',ox-14,oy+100,C.a,12.5,'right');
  byteBits(a,ox,oy+82,r,C.a,w);
  a.txt(HEX(r),ox+8*(w+3)+10,oy+100,C.a,12.5);
  /* qué le ha pasado a cada bit */
  for(let i=7;i>=0;i--){const cx=ox+(7-i)*(w+3)+w/2;
    const db=(s.dato>>i)&1, mb=(s.masc>>i)&1, rb=(r>>i)&1;
    let et='';
    if(s.op==='and') et = mb? 'pasa':'borra';
    else if(s.op==='or') et = mb? 'fuerza':'pasa';
    else et = mb? 'invierte':'pasa';
    a.txt(et,cx,oy+124,rb!==db?C.d:C.muted,9.5,'center');}
  /* panel */
  const bx=96,by=224;
  const usos={and:['Aislar el nibble bajo','andlw b\'00001111\'','Borrar los bits altos de una lectura'],
   or:['Forzar bits a 1','iorlw b\'10000000\'','Activar el bit 7 sin tocar los demás'],
   xor:['Invertir bits','xorlw b\'11111111\'','Complementar; o comparar: Z = 1 si eran iguales']}[s.op];
  a.txt('Uso típico: '+usos[0],bx,by,C.a,13);
  a.txt(usos[1],bx+280,by,C.c,12.5);
  a.txt(usos[2],bx,by+22,C.muted,12);
  a.html(s.op==='and'
   ? '<b>AND</b> conserva los bits donde la máscara vale 1 y <b>borra</b> los demás. Es la operación para <b>aislar</b>: leer un puerto entero y quedarse sólo con las patillas que interesan. Prueba con la máscara 0x0F: se queda el nibble bajo y desaparece el alto.'
   : s.op==='or'
   ? '<b>OR</b> <b>fuerza a 1</b> los bits donde la máscara vale 1 y deja el resto como estaba. Sirve para activar salidas sin leer antes su estado. Para un solo bit, <code>bsf</code> hace lo mismo en una sola instrucción.'
   : '<b>XOR</b> <b>invierte</b> los bits donde la máscara vale 1. Es la única forma de conmutar un bit sin saber su estado previo, y además sirve para comparar: si el resultado es cero (Z = 1), el dato era igual a la máscara.');
 }});

/* 4 · Cuenta de ciclos */
SIMS.ciclos=el=>build(el,{w:680,h:324,
 selects:[{k:'tipo',l:'Estructura',v:'doble',opts:[['simple','Un bucle'],['doble','Dos bucles anidados'],['triple','Tres bucles anidados']]}],
 sliders:[{k:'n',l:'Variable interior  n',v:82,min:1,max:255,step:1},
  {k:'m',l:'Variable exterior  m',v:200,min:1,max:255,step:1},
  {k:'p',l:'Tercera variable  p',v:1,min:1,max:255,step:1},
  {k:'fosc',l:'Oscilador',v:4,min:1,max:20,step:1,u:'MHz'}],
 draw(a){a.clear();const s=a.st;
  const Tci=4/(s.fosc*1e6);
  const Nint=3*s.n+3;                 /* bucle simple completo con return */
  const Nint2=3*s.n+4;                /* bloque interior dentro de otro bucle */
  let N,expr;
  if(s.tipo==='simple'){N=Nint;expr='1+1+3·('+s.n+'−1)+2+2';}
  else if(s.tipo==='doble'){N=1+1+Nint2*s.m+2+2;expr='1+1+'+Nint2+'·'+s.m+'+2+2';}
  else {const Nmed=(1+1+Nint2*s.m+2+1+2); N=1+1+Nmed*s.p+2+2;expr='1+1+'+Nmed+'·'+s.p+'+2+2';}
  const t=N*Tci;
  /* código */
  const ox=44,oy=66;
  const lineas=s.tipo==='simple'
   ? [['Delay   movlw   d\''+s.n+'\'','1'],['        movwf   VAR','1'],['Atras   decfsz  VAR,1','1 / 2'],['        goto    Atras','2'],['        return','2']]
   : s.tipo==='doble'
   ? [['Delay   movlw   d\''+s.m+'\'','1'],['        movwf   VAR1','1'],['Atras1  movlw   d\''+s.n+'\'','1'],['        movwf   VAR','1'],['Atras   decfsz  VAR,1','1 / 2'],['        goto    Atras','2'],['        decfsz  VAR1,1','1 / 2'],['        goto    Atras1','2'],['        return','2']]
   : [['Delay   movlw   d\''+s.p+'\'','1'],['        movwf   VAR2','1'],['Atras2  movlw   d\''+s.m+'\'','1'],['        movwf   VAR1','1'],['Atras1  movlw   d\''+s.n+'\'','1'],['        movwf   VAR','1'],['Atras   decfsz  VAR,1','1 / 2'],['        goto    Atras','2'],['        decfsz  VAR1,1','1 / 2'],['        goto    Atras1','2'],['        decfsz  VAR2,1','1 / 2'],['        goto    Atras2','2'],['        return','2']];
  lineas.forEach((l,i)=>{const y=oy+i*17.5;
    a.txt(l[0],ox,y,C.text,11.5);
    a.txt(l[1]+' CI',ox+258,y,C.muted,10.5,'right');});
  /* panel */
  const bx=372,by=74;
  a.txt('Cuenta de ciclos',bx,by-20,C.a,13.5);
  a.txt('bucle interior completo',bx,by,C.muted,11.5);
  a.txt('3·'+s.n+' + '+(s.tipo==='simple'?'3':'4')+' = '+(s.tipo==='simple'?Nint:Nint2)+' CI',bx,by+20,C.text,13);
  a.txt('total',bx,by+50,C.muted,11.5);
  a.txt(expr,bx,by+70,C.muted,11.5);
  a.txt(N0(N)+' CI',bx,by+96,C.a,19);
  a.txt('Tiempo a '+N0(s.fosc)+' MHz',bx,by+130,C.muted,11.5);
  a.txt('T = '+N2(Tci*1e6)+' µs por ciclo',bx,by+150,C.muted,11.5);
  const tx = t<1e-3? N1(t*1e6)+' µs' : (t<1? N3(t*1e3)+' ms' : N3(t)+' s');
  a.txt(tx,bx,by+180,C.b,22);
  /* barra comparativa */
  const obj=[0.001,0.05,1];
  a.txt('máximos alcanzables (4 MHz):',bx,by+212,C.muted,10.5);
  a.txt('1 bucle 0,77 ms · 2 bucles 196 ms · 3 bucles 50 s',bx,by+230,C.muted,10.5);
  a.html('La vuelta completa del bucle cuesta <b>3 ciclos</b> (1 del <code>decfsz</code> + 2 del <code>goto</code>) y se da <b>'+(s.n-1)+' veces</b>, no '+s.n+'. En la última, el <code>decfsz</code> <b>salta</b> y cuesta 2 ciclos sin ejecutar el <code>goto</code>: ahí está el «+3» o «+4» de la fórmula.<br>Prueba n = 82 y m = 200 con dos bucles: salen <b>50 006 ciclos</b>, es decir 50,006 ms a 4 MHz. Es la rutina <code>Delay50</code> clásica de la asignatura.');
 }});

/* 5 · TMR0 */
SIMS.tmr0=el=>build(el,{w:680,h:306,
 selects:[{k:'df',l:'Divisor de frecuencias',v:'256',opts:[['1','sin preescalador  (PSA = 1)'],['2','1:2   → PS = 000'],['4','1:4   → PS = 001'],['8','1:8   → PS = 010'],['16','1:16  → PS = 011'],['32','1:32  → PS = 100'],['64','1:64  → PS = 101'],['128','1:128 → PS = 110'],['256','1:256 → PS = 111']]}],
 sliders:[{k:'n',l:'Valor precargado en TMR0',v:61,min:0,max:255,step:1},
  {k:'fosc',l:'Oscilador',v:4,min:1,max:20,step:1,u:'MHz'},
  {k:'obj',l:'Tiempo deseado',v:50,min:0.1,max:200,step:0.1,u:'ms'}],
 draw(a){a.clear();const s=a.st,DF=parseInt(s.df);
  const Tci=4/(s.fosc*1e6);
  const t=Tci*(256-s.n)*DF;
  const tmax=Tci*256*DF;
  const nIdeal=256-(s.obj*1e-3)/(Tci*DF);
  const nOk=Math.round(nIdeal);
  const tOk=nOk>=0&&nOk<=255?Tci*(256-nOk)*DF:null;
  /* contador visual */
  const ox=52,oy=78,W=380,H=52;
  Rline(a,ox,oy,W,H,C.grid,5,1.4);
  const frac=(256-s.n)/256;
  alpha(a,0.7,()=>Rbox(a,ox+W*(s.n/256),oy,W*frac,H,C.a,4));
  a.txt('0',ox+4,oy+H+16,C.muted,10);
  a.txt('255',ox+W-10,oy-14,C.muted,10,'right');
  a.line(ox+W*(s.n/256),oy-8,ox+W*(s.n/256),oy+H+6,C.b,2);
  a.txt('n = '+s.n,ox+W*(s.n/256),oy-14,C.b,12,'center');
  a.txt((256-s.n)+' cuentas hasta desbordar',ox+W*(s.n/256)+W*frac/2,oy+30,C.bg,12.5,'center');
  a.txt('al llegar a 255 → desborda y T0IF = 1',ox+W,oy+H+16,C.d,10.5,'right');
  /* cadena */
  const cy=oy+96;
  const cadena=[['oscilador','÷4','ciclo de instrucción'],['CI','÷'+DF,'estímulo TMR0'],['TMR0','+1','desbordamiento']];
  let x=ox;
  cadena.forEach((c,i)=>{
    alpha(a,0.12,()=>Rbox(a,x,cy,96,34,C.c,4));Rline(a,x,cy,96,34,C.c,4,1.3);
    a.txt(c[0],x+48,cy+15,C.text,11,'center');
    a.txt(c[1],x+48,cy+29,C.c,10.5,'center');
    if(i<2)a.arrow(x+96,cy+17,x+122,cy+17,C.muted,1.8);
    x+=122;});
  a.txt('cada cuenta dura '+(Tci*DF*1e6>=1000?N2(Tci*DF*1e3)+' ms':N1(Tci*DF*1e6)+' µs'),ox,cy+60,C.muted,11.5);
  /* panel */
  const bx=460,by=72;
  a.txt('t = 4·Tosc·(256−n)·DF',bx,by-20,C.a,12.5);
  a.txt('Tiempo de desbordamiento',bx,by+6,C.muted,11.5);
  a.txt(t*1000>=1?N3(t*1e3)+' ms':N1(t*1e6)+' µs',bx,by+32,C.a,20);
  a.txt('Máximo con DF = '+DF,bx,by+64,C.muted,11.5);
  a.txt(tmax*1000>=1?N3(tmax*1e3)+' ms':N1(tmax*1e6)+' µs',bx,by+86,C.text,14);
  a.txt('Para '+N1(s.obj)+' ms harían falta',bx,by+122,C.muted,11.5);
  if(nIdeal<0){a.txt('n = '+N1(nIdeal)+' → IMPOSIBLE',bx,by+144,C.d,13);
    a.txt('hay que subir DF o contar',bx,by+166,C.d,11.5);
    a.txt(N0(Math.ceil(s.obj*1e-3/tmax))+' desbordamientos',bx,by+184,C.d,11.5);}
  else if(nIdeal>255){a.txt('n = '+N1(nIdeal)+' → baja el DF',bx,by+144,C.d,13);}
  else{a.txt('n = '+N2(nIdeal)+'  →  usar '+nOk,bx,by+144,C.c,13.5);
    a.txt('que da '+N3(tOk*1e3)+' ms',bx,by+166,C.text,12.5);
    const err=100*(tOk-s.obj*1e-3)/(s.obj*1e-3);
    a.txt('error '+(err>0?'+':'')+N2(err)+' %',bx,by+186,Math.abs(err)<1?C.c:C.b,12.5);}
  a.txt('OPTION = b\'XX'+(DF===1?'1':'0')+'0'+(DF===1?'000':(Math.log2(DF)-1).toString(2).padStart(3,'0'))+'\'',bx,by+218,C.muted,12);
  a.html('El TMR0 cuenta <b>solo</b>: se precarga con n y hay que esperar a que <b>T0IF</b> se ponga a 1. Cada cuenta dura un ciclo de instrucción multiplicado por el divisor, así que subir DF alarga el tiempo máximo pero <b>empeora la resolución</b>.<br>Pon DF = 1 y pide 50 ms: el n necesario sale negativo porque el máximo son '+(4/(s.fosc*1e6)*256*1e6).toFixed(0)+' µs. Hay que subir el divisor o contar varios desbordamientos.');
 }});

/* 6 · Puertos de E/S */
SIMS.puertos=el=>build(el,{w:680,h:300,
 sliders:[{k:'tris',l:'Valor de TRISB',v:240,min:0,max:255,step:1},
  {k:'port',l:'Valor escrito en PORTB',v:85,min:0,max:255,step:1},
  {k:'ext',l:'Nivel externo (entradas)',v:170,min:0,max:255,step:1},
  {k:'iled',l:'Corriente por LED',v:10,min:1,max:25,step:1,u:'mA'}],
 draw(a){a.clear();const s=a.st;
  const ox=62,oy=70,w=40;
  const etiq=['RB7','RB6','RB5','RB4','RB3','RB2','RB1','RB0'];
  a.txt('TRISB',ox-14,oy+18,C.muted,12.5,'right');
  byteBits(a,ox,oy,s.tris,C.b,w,etiq);
  a.txt(HEX(s.tris),ox-14,oy+34,C.b,11,'right');
  for(let i=7;i>=0;i--){const cx=ox+(7-i)*(w+3)+w/2;
    a.txt(((s.tris>>i)&1)?'entrada':'salida',cx,oy+40,((s.tris>>i)&1)?C.f:C.a,9.5,'center');}
  a.txt('PORTB',ox-14,oy+78,C.muted,12.5,'right');
  byteBits(a,ox,oy+60,s.port,C.muted,w);
  a.txt('(escrito)',ox-14,oy+94,C.muted,10.5,'right');
  /* estado real */
  const real = (s.port & ~s.tris) | (s.ext & s.tris);
  a.txt('patillas',ox-14,oy+124,C.a,12.5,'right');
  byteBits(a,ox,oy+106,real,C.a,w);
  a.txt(HEX(real),ox-14,oy+140,C.a,11,'right');
  /* LEDs */
  const ly=oy+150;
  for(let i=7;i>=0;i--){const cx=ox+(7-i)*(w+3)+w/2;
    const sal=!((s.tris>>i)&1), on=sal&&((real>>i)&1);
    if(sal){a.circ(cx,ly+14,10,on?C.b:C.grid,on);
      if(!on)a.circ(cx,ly+14,10,C.grid,false);}
    else {a.txt('↑',cx,ly+20,C.f,14,'center');}}
  a.txt('salidas: LED · entradas: nivel externo',ox,ly+44,C.muted,11);
  /* panel */
  const bx=448,by=72;
  const nsal=[...Array(8)].filter((_,i)=>!((s.tris>>i)&1)).length;
  const non=[...Array(8)].filter((_,i)=>!((s.tris>>i)&1)&&((real>>i)&1)).length;
  a.txt('Patillas de salida',bx,by,C.muted,11.5);
  a.txt(String(nsal),bx+170,by,C.a,15,'right');
  a.txt('LED encendidos',bx,by+30,C.muted,11.5);
  a.txt(String(non),bx+170,by+30,C.b,15,'right');
  a.txt('Corriente total',bx,by+62,C.muted,11.5);
  const itot=non*s.iled;
  a.txt(N0(itot)+' mA',bx+170,by+62,itot>100?C.d:C.c,17,'right');
  alpha(a,0.12,()=>Rbox(a,bx,by+76,170,14,C.text,3));
  Rbox(a,bx,by+76,170*Math.min(1,itot/150),14,itot>100?C.d:C.c,3);
  a.line(bx+170*100/150,by+72,bx+170*100/150,by+94,C.d,1.5);
  a.txt('100 mA',bx+170*100/150,by+108,C.d,10,'center');
  a.txt(itot>100?'¡se supera el límite de PORTB!':'dentro del límite de PORTB',bx,by+130,itot>100?C.d:C.c,11.5);
  a.txt('Resistencia del LED',bx,by+162,C.muted,11.5);
  a.txt('R = (5−2)/'+N0(s.iled)+'mA = '+N0(3000/s.iled)+' Ω',bx,by+184,C.text,12.5);
  a.txt('25 mA máximo por patilla',bx,by+214,s.iled>25?C.d:C.muted,11);
  a.html('En <b>TRISB</b>, un <b>1 es entrada</b> y un <b>0 es salida</b>. En las patillas configuradas como salida manda lo que escribes en PORTB; en las de entrada, el nivel que impone el circuito exterior, y lo que escribas se ignora.<br>Sube la corriente por LED a 20 mA con los ocho encendidos: <b>160 mA</b>, muy por encima de los 100 mA que admite PORTB. Ahí hace falta un ULN2803 o transistores.');
 }});

/* 7 · Display de siete segmentos */
SIMS.display=el=>build(el,{w:680,h:290,
 selects:[{k:'tipo',l:'Tipo de display',v:'catodo',opts:[['catodo','Cátodo común (segmento ON con 1)'],['anodo','Ánodo común (segmento ON con 0)']]}],
 sliders:[{k:'d',l:'Dígito a mostrar',v:5,min:0,max:9,step:1},
  {k:'manual',l:'Patrón manual (0 = tabla)',v:0,min:0,max:255,step:1}],
 draw(a){a.clear();const s=a.st;
  const tabC=[0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F];
  const base=tabC[s.d];
  const pat = s.manual>0 ? s.manual : (s.tipo==='catodo'? base : (~base)&0xFF);
  const on = i => s.tipo==='catodo' ? ((pat>>i)&1)===1 : ((pat>>i)&1)===0;
  /* display */
  const cx=130,cy=130,L=56,T=13;
  const segs={
   a:[cx-L/2,cy-L,L,T,0], b:[cx+L/2-T,cy-L+T/2,T,L-T,1], c:[cx+L/2-T,cy+T/2,T,L-T,1],
   d:[cx-L/2,cy+L-T,L,T,0], e:[cx-L/2,cy+T/2,T,L-T,1], f:[cx-L/2,cy-L+T/2,T,L-T,1],
   g:[cx-L/2,cy-T/2,L,T,0]};
  const orden=['a','b','c','d','e','f','g'];
  orden.forEach((k,i)=>{const [x,y,w,h]=segs[k];
    if(on(i)){Rbox(a,x,y,w,h,C.b,3);}
    else{alpha(a,0.18,()=>Rbox(a,x,y,w,h,C.muted,3));}
    const lx = k==='a'?cx:(k==='g'?cx:(['b','c'].includes(k)?x+w+10:x-10));
    const ly = k==='a'?y-8:(k==='d'?y+h+16:(k==='g'?cy+4:y+h/2+4));
    a.txt(k,lx,ly,on(i)?C.b:C.muted,11,['b','c'].includes(k)?'left':(['e','f'].includes(k)?'right':'center'));});
  /* bits */
  const ox=252,oy=74,w=40;
  a.txt('patrón en PORTB',ox,oy-20,C.muted,12);
  byteBits(a,ox,oy,pat,C.a,w,['·','g','f','e','d','c','b','a']);
  a.txt(HEX(pat),ox,oy+46,C.a,16);
  a.txt('b0 = a   ...   b6 = g',ox+110,oy+46,C.muted,11);
  /* tabla */
  const tx=ox,ty=oy+74;
  a.txt('Tabla de patrones',tx,ty,C.muted,12);
  for(let i=0;i<10;i++){const x=tx+(i%5)*76, y=ty+22+Math.floor(i/5)*42;
    const v = s.tipo==='catodo'? tabC[i] : (~tabC[i])&0xFF;
    if(i===s.d&&s.manual===0){alpha(a,0.14,()=>Rbox(a,x-6,y-16,68,36,C.a,4));Rline(a,x-6,y-16,68,36,C.a,4,1.3);}
    a.txt(String(i),x,y,i===s.d&&s.manual===0?C.a:C.muted,12);
    a.txt(HEX(v),x+16,y,i===s.d&&s.manual===0?C.a:C.text,12.5);}
  a.txt('retlw '+HEX(pat)+'   ; dígito '+(s.manual>0?'?':s.d),tx,ty+118,C.c,12.5);
  a.html(s.manual>0
   ? 'Estás mostrando un patrón manual ('+HEX(s.manual)+'). Pon el deslizador a 0 para volver a la tabla. Fíjate en que cualquier combinación de bits enciende una combinación de segmentos: los dígitos sólo son diez de las 128 posibles.'
   : s.tipo==='catodo'
   ? 'En un display de <b>cátodo común</b> el común va a masa y cada segmento se enciende con un <b>1</b>. Los diez patrones de la tabla (0x3F, 0x06, 0x5B…) son los que van en la subrutina con <code>addwf PCL,1</code> y <code>retlw</code>.'
   : 'En un display de <b>ánodo común</b> el común va a VDD y cada segmento se enciende con un <b>0</b>: los patrones son el <b>complemento</b> de los de cátodo común. El 0 pasa de 0x3F a 0xC0. Usar la tabla equivocada es un error clásico: se ven encendidos exactamente los segmentos que deberían estar apagados.');
 }});

/* 8 · Interrupciones */
SIMS.interrupcion=el=>build(el,{w:680,h:316,
 selects:[{k:'gie',l:'Bit GIE',v:'1',opts:[['1','GIE = 1 (interrupciones habilitadas)'],['0','GIE = 0 (deshabilitadas)']]},
  {k:'t0ie',l:'Bit T0IE (TMR0)',v:'1',opts:[['1','T0IE = 1 (habilitada)'],['0','T0IE = 0 (deshabilitada)']]},
  {k:'borra',l:'¿Se borra T0IF en la rutina?',v:'si',opts:[['si','Sí: bcf INTCON,T0IF'],['no','No (error típico)']]}],
 sliders:[{k:'paso',l:'Paso de la simulación',v:3,min:0,max:7,step:1}],
 draw(a){a.clear();const s=a.st,p=s.paso;
  const salta = s.gie==='1'&&s.t0ie==='1';
  const pasos = salta
   ? ['Programa principal ejecutándose','TMR0 se desborda → T0IF = 1','GIE y T0IE están a 1 → se atiende','Hardware: borra GIE, salva el PC en la pila','Salta a 0x004: salvar W y STATUS','Atender: identificar fuente y '+(s.borra==='si'?'borrar T0IF':'NO borrar T0IF ⚠'),'Restaurar W y STATUS','retfie: repone GIE y vuelve'+(s.borra==='no'?' … ¡y vuelve a entrar!':'')]
   : ['Programa principal ejecutándose','TMR0 se desborda → T0IF = 1',s.gie==='0'?'GIE = 0: NO se atiende':'T0IE = 0: NO se atiende','El bit T0IF sigue a 1','El programa principal puede consultarlo','btfss INTCON,T0IF  → sondeo','El programa decide cuándo mirarlo','Sigue sin interrumpirse nunca'];
  /* línea de tiempo */
  const ox=44,oy=74;
  pasos.forEach((t,i)=>{const y=oy+i*28;
    const act=i===p, hecho=i<p;
    if(act){alpha(a,0.14,()=>Rbox(a,ox-8,y-16,400,24,C.a,4));}
    a.circ(ox,y-5,act?6:4,act?C.a:(hecho?C.c:C.grid),true);
    if(i<pasos.length-1)a.line(ox,y-1,ox,y+22,hecho?C.c:C.grid,1.5);
    a.txt(t,ox+16,y,act?C.a:(hecho?C.text:C.muted),12.5);});
  /* registro INTCON */
  const bx=440,by=68;
  a.txt('INTCON',bx,by-18,C.muted,12.5);
  const bits=['GIE','EEIE','T0IE','INTE','RBIE','T0IF','INTF','RBIF'];
  const val=[(s.gie==='1'&&!(salta&&p>=3&&p<=6))?1:0,0,s.t0ie==='1'?1:0,0,0,(p>=1&&!(salta&&s.borra==='si'&&p>=5))?1:0,0,0];
  bits.forEach((b,i)=>{const y=by+i*26;
    const on=val[i];
    if(on)Rbox(a,bx,y,22,20,i>=5?C.d:C.c,3); else Rline(a,bx,y,22,20,C.grid,3,1.2);
    a.txt(String(on),bx+11,y+15,on?C.bg:C.muted,12,'center');
    a.txt(b,bx+30,y+15,i<5?C.muted:C.d,11.5);
    a.txt(i<5?'habilitación':'señalizador',bx+84,y+15,C.muted,10);});
  a.txt('los bits E habilitan',bx,by+218,C.muted,11);
  a.txt('los bits F señalizan',bx,by+236,C.d,11);
  a.html(!salta
   ? (s.gie==='0'
     ? 'Con <b>GIE = 0</b> no se atiende ninguna interrupción, pero el bit <b>T0IF se pone a 1 igualmente</b>. Eso permite trabajar por <b>sondeo</b>: el programa principal consulta el bit cuando le conviene. Es más simple, pero el principal pierde tiempo comprobando.'
     : 'Con <b>T0IE = 0</b> el desbordamiento del TMR0 no provoca interrupción, aunque GIE esté a 1. El bit <b>T0IF</b> sigue activándose: la fuente concreta y la habilitación general son dos permisos independientes.')
   : s.borra==='no'
   ? '<b>El error que cuelga el programa.</b> Si la rutina no borra T0IF, al ejecutar <code>retfie</code> el bit sigue a 1 y el sistema <b>entra otra vez</b> en la interrupción inmediatamente. El programa principal no vuelve a ejecutarse nunca y el microcontrolador parece muerto.'
   : 'Flujo completo: el hardware <b>borra GIE</b> al entrar (una interrupción no se interrumpe) y <code>retfie</code> lo repone al salir. Dentro hay que <b>salvar W y STATUS</b>, identificar la fuente, atender lo urgente y <b>borrar el bit F</b>.');
 }});

/* 9 · EEPROM */
SIMS.eeprom=el=>build(el,{w:680,h:300,
 selects:[{k:'op',l:'Operación',v:'esc',opts:[['lec','Lectura'],['esc','Escritura (secuencia obligatoria)']]}],
 sliders:[{k:'paso',l:'Paso de la secuencia',v:4,min:0,max:8,step:1},
  {k:'esc',l:'Escrituras al día',v:100,min:1,max:100000,step:1}],
 draw(a){a.clear();const s=a.st,p=s.paso;
  const pasosL=['Poner la dirección en EEADR','Ir al banco 1','bsf EECON1,RD  → orden de lectura','Volver al banco 0','El dato ya está en EEDATA','movf EEDATA,0  → W','—','—','—'];
  const pasosE=['Cargar EEADR y EEDATA (banco 0)','Ir al banco 1 · bcf INTCON,GIE','bsf EECON1,WREN  → permiso','movlw 0x55 · movwf EECON2','movlw 0xAA · movwf EECON2','bsf EECON1,WR  → arranca (≈10 ms)','Esperar a que el hardware borre WR','bcf EECON1,WREN · bcf EECON1,EEIF','bsf INTCON,GIE · volver al banco 0'];
  const pasos = s.op==='lec'?pasosL:pasosE;
  const nmax = s.op==='lec'?5:8;
  const ox=44,oy=68;
  pasos.forEach((t,i)=>{if(t==='—')return;const y=oy+i*26;
    const act=i===Math.min(p,nmax), hecho=i<Math.min(p,nmax);
    if(act)alpha(a,0.14,()=>Rbox(a,ox-8,y-15,396,23,C.a,4));
    a.circ(ox,y-4,act?6:4,act?C.a:(hecho?C.c:C.grid),true);
    if(i<nmax)a.line(ox,y,ox,y+20,hecho?C.c:C.grid,1.5);
    a.txt(t,ox+16,y,act?C.a:(hecho?C.text:C.muted),12);
    if(s.op==='esc'&&(i===3||i===4))a.txt('← obligatorio',ox+330,y,act?C.d:C.muted,10.5);});
  /* registros */
  const bx=466,by=66;
  a.txt('Bits de EECON1',bx,by-18,C.muted,12.5);
  const regs = s.op==='lec'
   ? [['RD',p>=2&&p<4?1:0],['WR',0],['WREN',0],['EEIF',0]]
   : [['RD',0],['WR',p>=5&&p<7?1:0],['WREN',p>=2&&p<7?1:0],['EEIF',p>=6&&p<7?1:0]];
  regs.forEach((r,i)=>{const y=by+i*28;
    if(r[1])Rbox(a,bx,y,22,20,C.c,3); else Rline(a,bx,y,22,20,C.grid,3,1.2);
    a.txt(String(r[1]),bx+11,y+15,r[1]?C.bg:C.muted,12,'center');
    a.txt(r[0],bx+30,y+15,C.muted,12);});
  a.txt('EECON2 no es un registro real:',bx,by+130,C.muted,10.5);
  a.txt('sólo sirve para la secuencia',bx,by+146,C.muted,10.5);
  /* desgaste */
  const dias=1e6/s.esc;
  a.txt('Vida de la memoria',bx,by+180,C.muted,12);
  a.txt(N0(s.esc)+' escrituras/día',bx,by+200,C.text,12);
  const txt = dias>=365? N1(dias/365)+' años' : (dias>=1? N0(dias)+' días' : N1(dias*24)+' horas');
  a.txt(txt,bx,by+226,dias>365?C.c:C.d,18);
  a.html(s.op==='lec'
   ? 'La <b>lectura</b> es inmediata: dirección en EEADR, bit RD a 1 y el dato aparece en EEDATA. Lo único delicado son los <b>bancos</b>: EEADR y EEDATA están en el 0, EECON1 en el 1.'
   : '<b>La secuencia 0x55 / 0xAA no es opcional.</b> Si se altera, si se mete una instrucción entre medias o si entra una interrupción, la escritura <b>no ocurre</b> y no hay ningún aviso. Por eso se borra GIE antes y se repone después.<br>Mira la vida de la memoria: con 100 escrituras al día dura <b>27 años</b>, pero escribiendo cada 10 ms se agota en <b>menos de tres horas</b>. La EEPROM es un recurso que se gasta.');
 }});

/* 10 · Multiplexación de displays */
SIMS.multiplexado=el=>build(el,{w:680,h:290,
 sliders:[{k:'N',l:'Número de displays',v:4,min:1,max:6,step:1},
  {k:'fr',l:'Frecuencia de refresco',v:100,min:10,max:300,step:5,u:'Hz'},
  {k:'num',l:'Número mostrado',v:2026,min:0,max:999999,step:1},
  {k:'t',l:'Instante del barrido',v:0,min:0,max:5,step:1}],
 draw(a){a.clear();const s=a.st;
  const tdig=1/(s.N*s.fr);
  const activo=s.t%s.N;
  const str=String(s.num).padStart(s.N,'0').slice(-s.N);
  const tabC=[0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F];
  /* displays */
  const ox=56,oy=76,dw=Math.min(74,420/s.N),L=Math.min(30,dw*0.42),T=7;
  for(let i=0;i<s.N;i++){
    const cx=ox+i*dw+dw/2, cy=oy+40;
    const d=parseInt(str[i]||'0'), pat=tabC[d];
    const on=j=>((pat>>j)&1)===1 && i===activo;
    const segs=[[cx-L/2,cy-L,L,T],[cx+L/2-T,cy-L+T/2,T,L-T],[cx+L/2-T,cy+T/2,T,L-T],
      [cx-L/2,cy+L-T,L,T],[cx-L/2,cy+T/2,T,L-T],[cx-L/2,cy-L+T/2,T,L-T],[cx-L/2,cy-T/2,L,T]];
    segs.forEach(([x,y,w,h],j)=>{
      if(on(j))Rbox(a,x,y,w,h,C.b,2);
      else alpha(a,i===activo?0.15:0.07,()=>Rbox(a,x,y,w,h,C.muted,2));});
    a.txt('D'+i,cx,oy+L+66,i===activo?C.a:C.muted,11,'center');
    if(i===activo){a.txt('ON',cx,oy-10,C.a,11.5,'center');
      Rline(a,cx-dw/2+4,oy-6,dw-8,L*2+28,C.a,5,1.5);}
    else a.txt('off',cx,oy-10,C.muted,10.5,'center');}
  /* cronograma */
  const cy2=214,cw=420/s.N;
  a.txt('señales de habilitación',ox,cy2-18,C.muted,11.5);
  for(let i=0;i<s.N;i++){const y=cy2+i*0;
    for(let k=0;k<s.N;k++){const x=ox+k*cw;
      if(k===i)Rbox(a,x+1,cy2-10+i*0,cw-2,8,C.a,2);
      else alpha(a,0.1,()=>Rbox(a,x+1,cy2-10,cw-2,8,C.muted,2));}}
  for(let k=0;k<s.N;k++){const x=ox+k*cw;
    a.txt('D'+k,x+cw/2,cy2+12,k===activo?C.a:C.muted,10,'center');}
  a.line(ox,cy2+2,ox+s.N*cw,cy2+2,C.grid,1);
  a.txt('un ciclo completo = '+N2(1000/s.fr)+' ms',ox,cy2+36,C.muted,11);
  /* panel */
  const bx=500,by=70;
  a.txt('Tiempo por dígito',bx,by,C.muted,11.5);
  a.txt(N2(tdig*1000)+' ms',bx,by+24,C.a,18);
  a.txt('t = 1 / (N · fr)',bx,by+46,C.muted,10.5);
  a.txt('Brillo relativo',bx,by+78,C.muted,11.5);
  a.txt('1/'+s.N+' = '+N0(100/s.N)+' %',bx,by+102,C.b,15);
  a.txt('Refresco',bx,by+134,C.muted,11.5);
  a.txt(N0(s.fr)+' Hz',bx,by+156,s.fr>=50?C.c:C.d,15);
  a.txt(s.fr>=50?'sin parpadeo visible':'¡se ve parpadear!',bx,by+178,s.fr>=50?C.c:C.d,11.5);
  a.html('Los '+s.N+' displays <b>comparten</b> las siete líneas de segmentos y cada uno tiene su habilitación. Se enciende uno cada '+N2(tdig*1000)+' ms y, si el ciclo completo se repite más de <b>50 veces por segundo</b>, el ojo los ve todos encendidos.<br>El precio es el <b>brillo</b>: cada dígito luce sólo el '+N0(100/s.N)+' % del tiempo. Baja la frecuencia por debajo de 50 Hz y verás por qué ese es el límite.');
 }});
  document.querySelectorAll('[data-sim]').forEach(function(el){
    var k=el.getAttribute('data-sim'); if(SIMS[k]){ try{ SIMS[k](el); }catch(e){ console.error('sim '+k, e); } }
  });
})();
