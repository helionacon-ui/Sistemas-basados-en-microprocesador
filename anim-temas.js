/* Sistemas basados en Microprocesador (PIC16F84A): una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function hx(v){return ('0'+v.toString(16).toUpperCase()).slice(-2)+'h';}function bin(v){return ('0000000'+v.toString(2)).slice(-8);}

/* T1 segmentación: búsqueda y ejecución solapadas */
var PI=['MOVLW 05h','MOVWF PORTB','CALL RETARDO','…','INCF CONT,F'];
M.reg('sbm-t1',M.base({title:'PIC16F84A: búsqueda y ejecución solapadas',H:560,dur:18,caps:[[6,'Arquitectura Harvard: la memoria de programa (palabras de 14 bits) y la de datos (8 bits) tienen buses separados.'],[12,'Por eso, mientras se ejecuta una instrucción ya se está buscando la siguiente: cada instrucción tarda un ciclo de instrucción (4 ciclos de reloj).'],[99,'Los saltos (CALL, GOTO) rompen la cadena: la instrucción ya buscada no sirve y se pierde un ciclo. Por eso tardan 2 ciclos.']]},
 function(D,t){var n=Math.floor(seg(t,0.5,16)*6),x0=150,cw=80,y0=130;D.text('ciclo',x0-14,y0-14,{s:14,a:'right',c:C.mut});
  for(var k=0;k<6;k++)D.text('T'+(k+1),x0+k*cw+cw/2,y0-14,{s:15,a:'center',c:C.mut});D.text('búsqueda',x0-14,y0+30,{s:15,a:'right',c:C.f});D.text('ejecución',x0-14,y0+90,{s:15,a:'right',c:C.m});
  var F=['MOVLW','MOVWF','CALL','INCF','sub: 1.ª','sub: 2.ª'],E=['','MOVLW','MOVWF','CALL','vacío','sub: 1.ª'];
  for(var c=0;c<=n&&c<6;c++){D.rect(x0+c*cw+3,y0+6,cw-6,46,C.f,RG(C.f,.15),1.6);D.text(F[c],x0+c*cw+cw/2,y0+35,{s:14,a:'center',c:C.f,mono:true});if(E[c]){var bad=E[c]==='vacío';D.rect(x0+c*cw+3,y0+66,cw-6,46,bad?C.bad:C.m,RG(bad?C.bad:C.m,.15),1.6);D.text(E[c],x0+c*cw+cw/2,y0+95,{s:14,a:'center',c:bad?C.bad:C.m,mono:true});}
   if(c>0&&c<4)D.arrow(x0+(c-1)*cw+cw/2,y0+54,x0+c*cw+cw/2-10,y0+64,C.mut,1.2);}
  D.text('4 MHz → ciclo de instrucción = 4/f_{osc} = 1 µs',W/2,330,{s:18,a:'center',c:C.w});U.readout(D,['T'+Math.min(6,n+1)+(n>=3?':  el salto descarta la instrucción ya buscada':'')],400);}));

/* T2 ejecutar un programa paso a paso */
var P2=[['MOVLW 0Fh','W = 0Fh'],['MOVWF CONT','CONT = W'],['CLRF PORTB','PORTB = 0'],['bucle: INCF PORTB,F','PORTB = PORTB + 1'],['DECFSZ CONT,F','CONT − 1; salta si 0'],['GOTO bucle',''],['SLEEP','']];
M.reg('sbm-t2',M.base({title:'Estructura de un programa: ejecución paso a paso',H:580,dur:22,caps:[[7,'El programa carga 15 en un contador y entra en un bucle: en cada vuelta incrementa PORTB y decrementa el contador.'],[14,'DECFSZ decrementa y, si el resultado es cero, se salta la siguiente instrucción (el GOTO) y el bucle termina.'],[99,'Al final PORTB vale 15 (0Fh). Las directivas (ORG, EQU, END) no generan código: solo orientan al ensamblador.']]},
 function(D,t){var tr=[0,1,2],W2=15,cont=15,pb=0;for(var v=0;v<15;v++){tr.push(3,4);if(v<14)tr.push(5);}tr.push(6);
  var k=Math.min(tr.length-1,Math.floor(seg(t,0.5,20)*tr.length)),st={W:0,CONT:0,PB:0};for(var i=0;i<=k;i++){var l=tr[i];if(l===0)st.W=15;if(l===1)st.CONT=st.W;if(l===2)st.PB=0;if(l===3)st.PB++;if(l===4)st.CONT--;}
  P2.forEach(function(p,i){var y=110+i*44,on=tr[k]===i;if(on){D.rect(40,y-28,360,40,null,RG(C.y,.12));D.rect(40,y-28,5,40,null,C.y);}D.text(p[0],56,y,{s:17,c:on?C.y:C.w,mono:true,bold:on});});
  [['W',hx(st.W)],['CONT',hx(st.CONT)],['PORTB',bin(st.PB)]].forEach(function(r,i){var y=140+i*80;D.rect(430,y-30,180,56,C.m,RG(C.m,.1),1.6);D.text(r[0],440,y-12,{s:13,c:C.mut});D.text(r[1],600,y+12,{s:20,c:C.m,mono:true,a:'right',bold:true});});
  U.readout(D,[P2[tr[k]][1]||(tr[k]===6?'fin: PORTB = 0Fh':'vuelve al bucle')],500);}));

/* T3 máscaras */
var R3=0xB6;M.reg('sbm-t3',M.base({title:'Operaciones lógicas: máscaras de bits',H:560,dur:21,caps:[[7,'<b>ANDLW</b> con una máscara pone a 0 los bits donde la máscara tiene 0: sirve para quedarse solo con algunos bits (aquí, el nibble bajo).'],[14,'<b>IORLW</b> pone a 1 los bits donde la máscara tiene 1, sin tocar el resto.'],[99,'<b>XORLW</b> invierte los bits marcados. Hacer XOR con una constante y mirar el bit Z sirve para comparar: Z = 1 si eran iguales.']]},
 function(D,t){var k=Math.min(2,Math.floor(t/7)),ops=[['ANDLW',0x0F,function(a,b){return a&b;}],['IORLW',0x81,function(a,b){return a|b;}],['XORLW',0xF0,function(a,b){return a^b;}]],o=ops[k],res=o[2](R3,o[1]),u=seg(t-k*7,1,5.5),x0=170,cw=50;
  [['W',R3],[o[0],o[1]],['resultado',res]].forEach(function(r,i){var y=150+i*90;D.text(r[0],x0-16,y+8,{s:17,a:'right',c:i===2?C.m:C.f,mono:true,bold:i===2});
   for(var b=0;b<8;b++){var bit=(r[1]>>(7-b))&1;if(i===2&&b>=u*8)continue;D.rect(x0+b*cw,y-24,cw-6,46,i===2?C.m:C.f,RG(i===2?C.m:C.f,bit?.3:.04),1.4);D.text(bit+'',x0+b*cw+cw/2-3,y+8,{s:22,a:'center',c:i===2?C.m:C.f,mono:true,bold:!!bit});}
   D.text(hx(r[1]),x0+8*cw+12,y+8,{s:17,c:C.mut,mono:true});});
  D.line(x0,284,x0+8*cw-6,284,C.ax,1.6);for(var b2=0;b2<8;b2++)D.text(''+(7-b2),x0+b2*cw+cw/2-3,118,{s:12,a:'center',c:C.mut});
  U.readout(D,[o[0]+' '+hx(o[1])+':  '+hx(R3)+' → '+hx(res)+(k===2?'   (Z = '+(res?0:1)+')':'')],470);}));

/* T4 retardo por cuenta de instrucciones */
M.reg('sbm-t4',M.base({title:'Retardo por bucle: contar ciclos',H:560,dur:18,caps:[[6,'Un bucle DECFSZ + GOTO gasta 3 ciclos por vuelta (1 del DECFSZ y 2 del GOTO) y 2 en la última.'],[12,'Con un contador N el bucle dura unos 3N ciclos: a 4 MHz, 3N µs. Con N = 250, unos 750 µs.'],[99,'Para retardos mayores se anidan bucles: el interior se repite N₂ veces por cada vuelta del exterior y los tiempos se multiplican.']]},
 function(D,t){var N=250,u=seg(t,1,16),v=Math.floor(u*N),cyc=2+v*3,code=['      MOVLW .250','      MOVWF CONT','bucle DECFSZ CONT,F','      GOTO bucle','      RETURN'],ln=v>=N?4:(Math.floor(t*3)%2?2:3);
  code.forEach(function(c,i){var y=120+i*40,on=i===ln&&u>0;if(on){D.rect(40,y-26,330,36,null,RG(C.y,.12));}D.text(c,52,y,{s:17,c:on?C.y:C.w,mono:true});});
  D.rect(400,110,200,120,C.m,RG(C.m,.08),1.6);D.text('CONT',412,134,{s:14,c:C.mut});D.text(''+(N-v),590,190,{s:40,a:'right',c:C.m,mono:true,bold:true});
  var bw=520*u;D.rect(60,330,520,26,C.grid,null,1.2);D.rect(60,330,bw,26,null,RG(C.hl,.6));D.text('ciclos: '+cyc,60,320,{s:15,c:C.hl});
  U.readout(D,['retardo ≈ 3·N + 3 ciclos = '+(3*N+3)+' µs a 4 MHz','transcurrido: '+cyc+' µs'],430);}));

/* T5 TMR0 con divisor */
M.reg('sbm-t5',M.base({title:'TMR0 y el divisor de frecuencia',H:580,dur:18,caps:[[6,'El TMR0 es un contador de 8 bits que se incrementa con cada ciclo de instrucción, pasando antes por el divisor (prescaler).'],[12,'Al pasar de FFh a 00h se desborda y activa el bit T0IF. Cargándolo con un valor inicial se acorta la cuenta.'],[99,'Tiempo hasta el desbordamiento: <i>T = (4/f<sub>osc</sub>)·divisor·(256 − carga)</i>. Con 4 MHz, divisor 32 y carga 6: 32·250 = 8 ms.']]},
 function(D,t){var u=(t%9)/9,div=32,load=6,cnt=Math.floor(load+u*250),pre=Math.floor(u*250*div)%div,ovf=u>0.97;
  D.text('ciclos de instrucción',60,120,{s:15,c:C.f});for(var i=0;i<24;i++){var x=60+i*10,on=(Math.floor(t*40)+i)%2;D.line(x,140,x,140-(on?18:0),C.f,1.4);D.line(x,140,x+10,140,C.f,1.4);}
  D.arrow(310,132,350,132,C.mut,2);D.rect(355,104,120,56,C.hl,RG(C.hl,.12),1.8);D.text('÷ '+div,415,128,{s:18,a:'center',c:C.hl,bold:true});D.text(pre+'/'+div,415,150,{s:13,a:'center',c:C.hl,mono:true});
  D.arrow(480,132,520,132,C.mut,2);D.text('TMR0',525,120,{s:15,c:C.m});
  D.rect(60,220,520,40,C.grid,null,1.2);D.rect(60,220,520*cnt/255,40,null,RG(C.m,.55));D.text(hx(Math.min(255,cnt))+' = '+Math.min(255,cnt),320,248,{s:20,a:'center',c:C.w,mono:true,bold:true});
  D.rect(60+520*load/255-1,212,2,56,null,C.g);D.text('carga = 6',60+520*load/255,206,{s:13,c:C.g});
  D.dot(560,320,14,ovf?C.bad:RG(C.bad,.12));D.ring(560,320,14,C.bad,2);D.text('T0IF',530,326,{s:16,a:'right',c:C.bad,bold:ovf});
  U.readout(D,['T = 1 µs · '+div+' · (256 − '+load+') = 8 ms','transcurrido: '+nf(u*8,2)+' ms'],420);}));

/* T6 puertas: TRIS y PORT */
M.reg('sbm-t6',M.base({title:'Puertas de E/S: dirección con TRIS, valor con PORT',H:560,dur:18,caps:[[6,'Cada patilla de PORTB puede ser entrada o salida. Lo decide su bit en TRISB (banco 1): <b>1 = entrada</b> (Input), <b>0 = salida</b> (Output).'],[12,'Con TRISB = F0h, RB7–RB4 son entradas (pulsadores) y RB3–RB0 salidas (LED).'],[99,'Al escribir PORTB solo cambian las salidas; al leerlo, las entradas devuelven el nivel de la patilla. Aquí el programa copia el nibble alto en el bajo.']]},
 function(D,t){var tris=0xF0,sw=[1,0,1,1],ph=t<6?0:(t<12?1:2),out=ph===2?((sw[0]<<3)|(sw[1]<<2)|(sw[2]<<1)|sw[3]):0,x0=110,cw=58;
  for(var b=0;b<8;b++){var bit=7-b,x=x0+b*cw,isIn=(tris>>bit)&1;D.text('RB'+bit,x+cw/2,130,{s:14,a:'center',c:C.mut});
   if(ph>=1){D.text(isIn?'1':'0',x+cw/2,170,{s:20,a:'center',c:isIn?C.f:C.hl,mono:true,bold:true});}
   if(ph>=1){if(isIn){var on=sw[b];D.rect(x+10,220,cw-20,30,C.f,on?RG(C.f,.5):null,1.8);D.text(on?'ON':'off',x+cw/2,241,{s:12,a:'center',c:C.f});D.text('entrada',x+cw/2,272,{s:11,a:'center',c:C.f});}
    else{var lit=(out>>bit)&1;D.dot(x+cw/2,235,15,lit?C.hl:RG(C.hl,.1));D.ring(x+cw/2,235,15,C.hl,2);D.text('salida',x+cw/2,272,{s:11,a:'center',c:C.hl});}}}
  D.text('TRISB',x0-14,170,{s:15,a:'right',c:C.w,mono:true});D.text('patilla',x0-14,241,{s:15,a:'right',c:C.w});
  U.readout(D,[ph===0?'BSF STATUS,RP0   ; banco 1':(ph===1?'MOVLW F0h  /  MOVWF TRISB':'SWAPF PORTB,W  /  MOVWF PORTB  →  LED = '+('000'+out.toString(2)).slice(-4))],380);}));

/* T7 display de 7 segmentos */
var SEG=[0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F];
M.reg('sbm-t7',M.base({title:'Display de 7 segmentos: tabla de conversión',H:560,dur:20,caps:[[6,'Cada segmento (a–g) es un LED conectado a un bit de PORTB. Para mostrar una cifra hay que encender la combinación adecuada.'],[12,'El programa usa una tabla: suma la cifra al PCL y cada RETLW devuelve en W el código de 7 segmentos.'],[99,'Para varios dígitos se multiplexa: se enciende un display cada vez, tan rápido que el ojo los ve todos encendidos.']]},
 function(D,t){var d=Math.floor(t/2)%10,c=SEG[d],cx=170,cy=250,L=70,T=12,on=function(i){return (c>>i)&1;};
  var S=[[cx-L/2,cy-L-T/2,L,T],[cx+L/2,cy-L,T,L],[cx+L/2,cy,T,L],[cx-L/2,cy+L-T/2,L,T],[cx-L/2-T,cy,T,L],[cx-L/2-T,cy-L,T,L],[cx-L/2,cy-T/2,L,T]];
  S.forEach(function(s,i){D.rect(s[0],s[1],s[2],s[3],null,on(i)?C.bad:RG(C.bad,.08));D.text('abcdefg'[i],s[0]+s[2]/2+(i===1||i===2?20:i===4||i===5?-20:0),s[1]+s[3]/2+5+(i===0?-14:i===3?22:0),{s:13,a:'center',c:C.mut});});
  var x0=330;D.text('RETLW  b\'0'+('000000'+c.toString(2)).slice(-7)+'\'',x0,200,{s:18,c:C.m,mono:true,bold:true});D.text('       gfedcba',x0,226,{s:18,c:C.mut,mono:true});
  D.text('cifra '+d+'  →  '+hx(c),x0,290,{s:20,c:C.w});}));

/* T8 interrupción */
M.reg('sbm-t8',M.base({title:'Interrupciones: del programa principal a la rutina',H:580,dur:20,caps:[[6,'Cuando llega un evento habilitado (flanco en RB0, desbordamiento de TMR0…) se termina la instrucción en curso y el PC salta al vector 0004h.'],[13,'La dirección de retorno se guarda en la pila. La rutina salva W y STATUS, atiende el evento y borra su bandera.'],[99,'RETFIE recupera la dirección de la pila y vuelve a poner GIE = 1: el programa principal sigue donde estaba, sin enterarse.']]},
 function(D,t){var u=seg(t,0.5,18),y1=150,y2=330,x0=60,x1=580;D.text('principal',x0,y1-34,{s:15,c:C.f});D.text('rutina (0004h)',x0,y2+44,{s:15,c:C.m});
  var xi=230,xr=440,X=lerp(x0,x1,u),p=[];D.line(x0,y1,x1,y1,C.grid,1);D.line(xi,y2,xr,y2,C.grid,1);
  if(X<=xi){D.line(x0,y1,X,y1,C.f,4);}else if(X<=xr){D.line(x0,y1,xi,y1,C.f,4);D.line(xi,y1,xi+10,y2,C.hl,2,[5,4]);D.line(xi+10,y2,Math.max(xi+10,X),y2,C.m,4);}
  else{D.line(x0,y1,xi,y1,C.f,4);D.line(xi,y1,xi+10,y2,C.hl,2,[5,4]);D.line(xi+10,y2,xr,y2,C.m,4);D.line(xr,y2,xr+10,y1,C.hl,2,[5,4]);D.line(xr+10,y1,X,y1,C.f,4);}
  if(X>=xi){D.arrow(xi,96,xi,y1-6,C.bad,2.4);D.text('evento: INTF = 1',xi,88,{s:14,c:C.bad,a:'center'});}
  var lab=X<xi?'ejecutando el principal':(X<xi+50?'PC → pila; salta a 0004h; GIE = 0':(X<xr-40?'guardar W y STATUS, atender, borrar INTF':(X<xr+20?'restaurar contexto; RETFIE':'vuelve al principal, GIE = 1')));
  if(X>xi)D.text('push',xi+16,(y1+y2)/2,{s:13,c:C.hl});if(X>xr)D.text('RETFIE',xr+16,(y1+y2)/2,{s:13,c:C.hl});U.readout(D,[lab],470);}));

/* T9 escritura en EEPROM */
var EE=[['EEADR ← dir',0],['EEDATA ← dato',0],['WREN = 1',1],['GIE = 0',2],['EECON2 ← 55h',3],['EECON2 ← AAh',3],['WR = 1',4],['… escribiendo ~10 ms',5],['EEIF = 1',6],['WREN = 0, GIE = 1',7]];
M.reg('sbm-t9',M.base({title:'Escribir en la EEPROM de datos',H:600,dur:22,caps:[[7,'Se cargan la dirección (EEADR) y el dato (EEDATA), y se habilita la escritura con WREN.'],[14,'Con las interrupciones desactivadas se escribe la secuencia 55h y AAh en EECON2 y se pone WR = 1: protege contra escrituras accidentales.'],[99,'La celda tarda unos 10 ms en grabarse. Al terminar, WR vuelve a 0 y se activa EEIF. Después se desactiva WREN y se reactivan las interrupciones.']]},
 function(D,t){var k=Math.min(EE.length-1,Math.floor(seg(t,0.5,20)*EE.length));
  EE.forEach(function(e,i){var y=96+i*29,on=i===k,done=i<k;D.text(e[0],50,y,{s:15,c:on?C.y:(done?C.w:C.mut),mono:true,bold:on});if(done)D.text('✓',30,y,{s:14,c:C.ok});});
  var x0=360,y0=110;D.text('EEPROM (64 bytes)',x0+110,y0-8,{s:14,a:'center',c:C.mut});for(var r=0;r<8;r++)for(var c=0;c<8;c++){var a=r*8+c,tgt=a===0x13,w=tgt&&k>=7;D.rect(x0+c*28,y0+r*28,26,26,tgt?C.m:C.grid,w?RG(C.m,k>=8?.6:.25+.2*Math.sin(t*8)):null,tgt?2:1);}
  D.text('dir = 13h',x0+110,y0+250,{s:15,a:'center',c:C.m});D.text('dato = 5Ah',x0+110,y0+274,{s:15,a:'center',c:C.m});
  [['WREN',k>=2&&k<9],['WR',k>=6&&k<8],['EEIF',k>=8]].forEach(function(b,i){var x=x0+i*80;D.dot(x+20,y0+310,10,b[1]?C.hl:RG(C.hl,.1));D.ring(x+20,y0+310,10,C.hl,1.6);D.text(b[0],x+36,y0+315,{s:13,c:C.hl});});}));

})();
