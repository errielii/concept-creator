/* Concept Creator revision: 2026-08-29 */

const grid=document.getElementById('grid');
const app=document.getElementById('app');

if(
  window.matchMedia('(pointer:coarse)').matches ||
  Math.min(window.innerWidth,screen.width)<=900
){
  document.documentElement.classList.add('mobile-device');
}

let dragging=null;
let rainbowMode=false;


/* =========================
   COLORS
========================= */

function color(v){
  if(v>=10)return '#ff00d9';
  if(v>=8)return '#25ff00';
  if(v>=5)return '#fff000';
  if(v>=2)return '#ff7a00';
  return '#ff0000';
}


/* =========================
   UPDATE STAT
========================= */

function update(box){

  const v=Math.max(
    0,
    Math.min(
      10,
      Number(box.dataset.value)||0
    )
  );

  const c=color(v);

  box.dataset.value=v;

  box.style.setProperty('--color',c);

  const fill=box.querySelector('.fill');

  const rainbow=
    box.dataset.rainbow==='true';

  fill.classList.remove('rainbow');

  fill.style.background=c;

  box.classList.toggle(
    'rainbow-border',
    rainbow
  );

  /*
    IMPORTANTE:

    A barra inteira fica dentro do box.
    O valor controla apenas scaleX.

    0 = 0%
    5 = 50%
    10 = 100%

    Assim ela nunca passa da borda.
  */

  fill.style.setProperty(
    '--fill-scale',
    String(v/10)
  );
}


/* =========================
   ADD STAT
========================= */

function addBox(name,value=5){

  const box=document.createElement('div');

  box.className='box';

  box.dataset.name=name;

  box.dataset.value=Math.max(
    0,
    Math.min(
      10,
      Number(value)||5
    )
  );

  box.dataset.rainbow='false';


  const fill=document.createElement('div');

  fill.className='fill';


  const text=document.createElement('div');

  text.className='name';

  text.textContent=name;


  const remove=document.createElement('button');

  remove.className='remove';

  remove.textContent='×';

  remove.title='Remove stat';


  remove.onclick=e=>{

    e.stopPropagation();

    box.remove();
  };


  box.append(
    fill,
    text,
    remove
  );

  grid.appendChild(box);

  update(box);


  /* POINTER DOWN */

  box.addEventListener(
    'pointerdown',
    e=>{

      if(
        e.target===remove ||
        rainbowMode
      ){
        return;
      }

      e.preventDefault();

      dragging=box;

      app.classList.add(
        'dragging'
      );

      box.style.cursor='grabbing';


      try{

        box.setPointerCapture(
          e.pointerId
        );

      }catch(_){}


      setValue(e);
    }
  );


  /* POINTER MOVE */

  box.addEventListener(
    'pointermove',
    e=>{

      if(dragging===box){

        e.preventDefault();

        setValue(e);
      }
    }
  );


  /* POINTER UP */

  box.addEventListener(
    'pointerup',
    ()=>{

      if(dragging===box){

        dragging=null;

        app.classList.remove(
          'dragging'
        );

        box.style.cursor='grab';
      }
    }
  );


  /* POINTER CANCEL */

  box.addEventListener(
    'pointercancel',
    ()=>{

      if(dragging===box){

        dragging=null;

        app.classList.remove(
          'dragging'
        );
      }
    }
  );
}


/* =========================
   SET VALUE
========================= */

function setValue(e){

  if(!dragging)return;

  const r=
    dragging.getBoundingClientRect();

  const v=Math.max(
    0,
    Math.min(
      10,
      ((e.clientX-r.left)/r.width)*10
    )
  );

  dragging.dataset.value=v;

  update(dragging);
}


/* =========================
   GLOBAL POINTER UP
========================= */

document.addEventListener(
  'pointerup',
  ()=>{
    dragging=null;

    app.classList.remove(
      'dragging'
    );
  }
);


/* =========================
   TITLE
========================= */

document.getElementById(
  'applyName'
).onclick=()=>{

  const value=
    document
      .getElementById('styleName')
      .value
      .trim();

  document.getElementById(
    'styleTitle'
  ).textContent=value||'Name';
};


/* TITLE COLOR */

document.getElementById(
  'titleColor'
).oninput=e=>{

  const title=
    document.getElementById(
      'styleTitle'
    );

  title.classList.remove(
    'title-gradient',
    'title-custom-gradient'
  );

  title.style.color=
    e.target.value||'#fff';

  title.style.webkitTextFillColor='';

  title.style.webkitTextStroke=
    '2px #000';
};


/* ULTRA */

document.getElementById(
  'gradientName'
).onclick=()=>{

  const title=
    document.getElementById(
      'styleTitle'
    );

  title.classList.toggle(
    'title-gradient'
  );

  title.classList.remove(
    'title-custom-gradient'
  );
};


/* CUSTOM TITLE GRADIENT */

const titleGradient=
  document.getElementById(
    'titleGradient'
  );

const titleGradientTop=
  document.getElementById(
    'titleGradientTop'
  );

const titleGradientBottom=
  document.getElementById(
    'titleGradientBottom'
  );


titleGradient.onclick=()=>{

  const title=
    document.getElementById(
      'styleTitle'
    );

  const active=
    title.classList.toggle(
      'title-custom-gradient'
    );

  title.classList.remove(
    'title-gradient'
  );


  if(active){

    title.style.setProperty(
      '--title-top',
      titleGradientTop.value
    );

    title.style.setProperty(
      '--title-bottom',
      titleGradientBottom.value
    );
  }
};


[
  titleGradientTop,
  titleGradientBottom
].forEach(input=>{

  input.oninput=()=>{

    const title=
      document.getElementById(
        'styleTitle'
      );

    title.style.setProperty(
      '--title-top',
      titleGradientTop.value
    );

    title.style.setProperty(
      '--title-bottom',
      titleGradientBottom.value
    );
  };
});


/* =========================
   ADD
========================= */

document.getElementById(
  'add'
).onclick=()=>{

  const name=
    document
      .getElementById('statName')
      .value
      .trim()||'NEW STAT';

  const value=
    document.getElementById(
      'statValue'
    ).value;

  addBox(
    name,
    value
  );

  document.getElementById(
    'statName'
  ).value='';

  document.getElementById(
    'statValue'
  ).value=5;
};


/* =========================
   RAINBOW
========================= */

const rainbowButton=
  document.getElementById(
    'rainbowMode'
  );

const rainbowHint=
  document.getElementById(
    'rainbowHint'
  );


rainbowButton.onclick=()=>{

  rainbowMode=!rainbowMode;

  rainbowButton.classList.toggle(
    'active',
    rainbowMode
  );

  rainbowHint.textContent=
    rainbowMode
      ? 'Now click a stat to enable/disable Rainbow'
      : 'Click Rainbow, then click a stat';
};


grid.addEventListener(
  'click',
  e=>{

    const box=
      e.target.closest('.box');

    if(
      !box ||
      e.target.closest('.remove') ||
      !rainbowMode
    ){
      return;
    }

    box.dataset.rainbow=
      box.dataset.rainbow==='true'
        ? 'false'
        : 'true';

    update(box);
  }
);


/* =========================
   RESET
========================= */

document.getElementById(
  'zero'
).onclick=()=>{

  [
    ...grid.children
  ].forEach(box=>{

    box.dataset.value=0;

    update(box);
  });
};


/* =========================
   ALL 10
========================= */

document.getElementById(
  'ten'
).onclick=()=>{

  [
    ...grid.children
  ].forEach(box=>{

    box.dataset.value=10;

    update(box);
  });
};


/* =========================
   CLEAR
========================= */

document.getElementById(
  'clear'
).onclick=()=>{

  grid.innerHTML='';
};


/* =========================
   FILE NAME
========================= */

function exportFileName(ext){

  const style=(
    document
      .getElementById('styleName')
      .value
      .trim() ||

    document
      .getElementById('styleTitle')
      .textContent
      .trim() ||

    'Name'
  )
  .replace(
    /[\\/:*?"<>|]/g,
    ''
  )
  .trim()||'Name';

  return style+
    ' - Concept.'+
    ext;
}


/* =========================
   EXPORT PNG
========================= */

document.getElementById(
  'savePng'
).onclick=async()=>{

  const button=
    document.getElementById(
      'savePng'
    );

  if(button.disabled)return;

  const oldText=
    button.textContent;

  button.disabled=true;

  button.textContent='Saving...';

  let wrap=null;

  try{

    if(
      typeof html2canvas!=='function'
    ){
      throw new Error(
        'html2canvas missing'
      );
    }


    if(
      document.fonts &&
      document.fonts.ready
    ){
      await document.fonts.ready;
    }


    const appRect=
      app.getBoundingClientRect();

    const width=
      Math.round(
        appRect.width
      );


    /*
      CLONE DOS STATS
    */

    const stats=
      grid.cloneNode(true);


    stats
      .querySelectorAll('.remove')
      .forEach(x=>x.remove());


    stats
      .querySelectorAll('.fill')
      .forEach(fill=>{

        const box=
          fill.closest('.box');

        if(!box)return;

        const v=Math.max(
          0,
          Math.min(
            10,
            Number(box.dataset.value)||0
          )
        );

        fill.style.setProperty(
          '--fill-scale',
          String(v/10)
        );

        fill.style.width='auto';

        fill.style.maxWidth='none';
      });


    /*
      EXPORT PANEL
    */

    const panel=
      document.createElement('div');

    panel.className=
      'export-panel';

    panel.style.width=
      grid.offsetWidth+'px';

    panel.appendChild(stats);


    wrap=
      document.createElement('div');

    wrap.style.cssText=
      'position:absolute;'+
      'left:-100000px;'+
      'top:0;'+
      'width:'+width+'px;'+
      'padding:0;'+
      'background:transparent;';

    wrap.appendChild(panel);

    document.body.appendChild(
      wrap
    );


    const statsCanvas=
      await html2canvas(
        wrap,
        {
          backgroundColor:null,
          scale:2,
          useCORS:true,
          allowTaint:true,
          logging:false
        }
      );


    /*
      TITLE SEPARADO

      Isso impede que Ultra/Gradient
      quebre o restante da imagem.
    */

    const title=
      document.getElementById(
        'styleTitle'
      );

    const titleText=
      title.textContent||'Name';

    const cs=
      getComputedStyle(title);

    const titleH=110;


    const out=
      document.createElement(
        'canvas'
      );

    out.width=
      statsCanvas.width;

    out.height=
      statsCanvas.height+
      titleH*2;


    const ctx=
      out.getContext('2d');


    ctx.clearRect(
      0,
      0,
      out.width,
      out.height
    );


    ctx.save();

    ctx.textAlign='center';

    ctx.textBaseline='middle';


    let fontFamily=
      cs.fontFamily||
      'Arial';

    let fontSize=
      Math.round(
        parseFloat(
          cs.fontSize
        )||64
      )*2;

    let fontWeight=
      cs.fontWeight||
      '900';

    let fontStyle=
      cs.fontStyle||
      'normal';


    /*
      ULTRA
    */

    if(
      title.classList.contains(
        'title-gradient'
      )
    ){

      fontFamily=
        "'Orbitron',Arial,sans-serif";

      fontWeight='800';

      fontStyle='italic';
    }


    ctx.font=
      fontStyle+' '+
      fontWeight+' '+
      fontSize+'px '+
      fontFamily;


    /*
      TITLE COLOR
    */

    let titleGradient=
      title.classList.contains(
        'title-gradient'
      );

    let customGradient=
      title.classList.contains(
        'title-custom-gradient'
      );


    if(
      titleGradient ||
      customGradient
    ){

      let gradient;


      if(customGradient){

        gradient=
          ctx.createLinearGradient(
            0,
            0,
            0,
            fontSize
          );

        gradient.addColorStop(
          0,
          title
            .style
            .getPropertyValue(
              '--title-top'
            )||'#25ff00'
        );

        gradient.addColorStop(
          1,
          title
            .style
            .getPropertyValue(
              '--title-bottom'
            )||'#396cff'
        );

      }else{

        gradient=
          ctx.createLinearGradient(
            0,
            0,
            0,
            fontSize
          );

        gradient.addColorStop(
          0,
          '#e0ddff'
        );

        gradient.addColorStop(
          .48,
          '#a9a4ff'
        );

        gradient.addColorStop(
          1,
          '#7169d5'
        );
      }


      ctx.fillStyle=gradient;

    }else{

      ctx.fillStyle=
        cs.color||
        '#fff';
    }


    /*
      TITLE POSITION
    */

    const titleY=
      titleH;


    /*
      TITLE SHADOW / OUTLINE
    */

    ctx.lineWidth=4;

    ctx.strokeStyle='#000';

    ctx.strokeText(
      titleText,
      out.width/2,
      titleY,
      out.width-40
    );

    ctx.fillText(
      titleText,
      out.width/2,
      titleY,
      out.width-40
    );


    ctx.restore();


    /*
      STATS ABAIXO DO TITLE
    */

    ctx.drawImage(
      statsCanvas,
      0,
      titleH*2
    );


    /*
      DOWNLOAD
    */

    out.toBlob(
      blob=>{

        if(!blob){

          throw new Error(
            'Could not create PNG'
          );
        }


        const url=
          URL.createObjectURL(
            blob
          );

        const a=
          document.createElement(
            'a'
          );

        a.href=url;

        a.download=
          exportFileName('png');

        document.body.appendChild(a);

        a.click();

        a.remove();


        setTimeout(
          ()=>{
            URL.revokeObjectURL(
              url
            );
          },
          5000
        );

      },
      'image/png'
    );


  }catch(err){

    console.error(err);

    alert(
      'Could not create the PNG: '+
      (err.message||err)
    );

  }finally{

    if(wrap){
      wrap.remove();
    }

    app.classList.remove(
      'exporting'
    );

    button.textContent=
      oldText;

    button.disabled=false;
  }
};


/* =========================
   GIF
========================= */

document.getElementById(
  'saveGif'
).onclick=async()=>{

  const button=
    document.getElementById(
      'saveGif'
    );

  if(button.disabled)return;

  const old=
    button.textContent;

  button.disabled=true;

  button.textContent='Preparing...';

  const frames=[];

  const frameCount=24;

  const delay=80;

  const rainbowBoxes=
    [
      ...grid.querySelectorAll(
        '.rainbow-border'
      )
    ];

  const rainbowFills=
    [
      ...grid.querySelectorAll(
        '.rainbow-border .fill'
      )
    ];


  try{

    if(
      typeof html2canvas!=='function'
    ){
      throw new Error(
        'html2canvas missing'
      );
    }


    if(
      document.fonts &&
      document.fonts.ready
    ){
      await document.fonts.ready;
    }


    for(
      let i=0;
      i<frameCount;
      i++
    ){

      const pos=
        (i/frameCount)*300;


      rainbowBoxes.forEach(
        box=>{

          box.style.setProperty(
            '--gif-rainbow-pos',
            pos+'%'
          );
        }
      );


      rainbowFills.forEach(
        fill=>{

          fill.style.setProperty(
            '--gif-rainbow-pos',
            pos+'%'
          );
        }
      );


      const exportWrap=
        document.createElement(
          'div'
        );

      exportWrap.style.cssText=
        'position:absolute;'+
        'left:-100000px;'+
        'top:0;'+
        'background:transparent;'+
        'padding:0;';


      const titleClone=
        document
          .getElementById(
            'styleTitle'
          )
          .cloneNode(true);


      titleClone
        .style
        .marginBottom='20px';


      titleClone
        .style
        .position='relative';


      titleClone
        .querySelectorAll(
          '::before,::after'
        );


      const gridClone=
        grid.cloneNode(true);


      gridClone
        .querySelectorAll(
          '.remove'
        )
        .forEach(
          x=>x.remove()
        );


      gridClone
        .querySelectorAll(
          '.fill'
        )
        .forEach(
          fill=>{

            const box=
              fill.closest('.box');

            if(!box)return;

            const v=
              Math.max(
                0,
                Math.min(
                  10,
                  Number(
                    box.dataset.value
                  )||0
                )
              );

            fill.style.setProperty(
              '--fill-scale',
              String(v/10)
            );
          }
        );


      const panel=
        document.createElement(
          'div'
        );

      panel.className=
        'export-panel';

      panel.style.width=
        grid.offsetWidth+'px';

      panel.appendChild(
        gridClone
      );


      exportWrap.append(
        titleClone,
        panel
      );


      document.body.appendChild(
        exportWrap
      );


      const canvas=
        await html2canvas(
          exportWrap,
          {
            backgroundColor:null,
            scale:1,
            useCORS:true,
            logging:false
          }
        );


      exportWrap.remove();


      frames.push(
        canvas
          .getContext('2d')
          .getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          )
      );


      button.textContent=
        'GIF '+
        Math.round(
          ((i+1)/frameCount)*100
        )+
        '%';


      await new Promise(
        r=>setTimeout(r,10)
      );
    }


    /*
      GIF encoder
    */

    const first=frames[0];

    const bytes=
      encodeAnimatedGif(
        frames,
        first.width,
        first.height,
        delay
      );


    const blob=
      new Blob(
        [bytes],
        {
          type:'image/gif'
        }
      );


    const url=
      URL.createObjectURL(
        blob
      );


    const a=
      document.createElement(
        'a'
      );

    a.href=url;

    a.download=
      exportFileName('gif');

    document.body.appendChild(a);

    a.click();

    a.remove();


    setTimeout(
      ()=>{
        URL.revokeObjectURL(
          url
        );
      },
      5000
    );


  }catch(err){

    console.error(err);

    alert(
      'Could not create the GIF: '+
      (err.message||err)
    );

  }finally{

    rainbowFills.forEach(
      el=>{
        el.style.animation='';
        el.style.backgroundPosition='';
      }
    );


    rainbowBoxes.forEach(
      el=>{
        el.style.animation='';
        el.style.removeProperty(
          '--gif-rainbow-pos'
        );
      }
    );


    app.classList.remove(
      'exporting'
    );

    button.textContent=old;

    button.disabled=false;
  }
};


/* =========================
   DEFAULT STATS
========================= */

[
  'Block',
  'Bump',
  'Dive',
  'Jump',
  'Serve',
  'Set',
  'Speed',
  'Spike'
].forEach(
  x=>addBox(x,5)
);
