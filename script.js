const grid=document.getElementById('grid');
const app=document.getElementById('app');

if(window.matchMedia('(pointer:coarse)').matches ||
   Math.min(window.innerWidth,screen.width)<=900){
  document.documentElement.classList.add('mobile-device');
}

let dragging=null;
let rainbowMode=false;

function color(v){
  if(v>=10)return '#ff00d9';
  if(v>=8)return '#25ff00';
  if(v>=5)return '#fff000';
  if(v>=2)return '#ff7a00';
  return '#ff0000';
}

function update(box){
  const v=Number(box.dataset.value)||0;
  const c=color(v);

  box.style.setProperty('--color',c);

  const fill=box.querySelector('.fill');
  const rainbow=box.dataset.rainbow==='true';

  fill.classList.remove('rainbow');
  fill.style.background=c;

  box.classList.toggle('rainbow-border',rainbow);

  fill.style.width=(v/10*100)+'%';
}

function addBox(name,value=5){
  const box=document.createElement('div');

  box.className='box';

  box.dataset.name=name;
  box.dataset.value=Math.max(
    0,
    Math.min(10,Number(value)||5)
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

  box.append(fill,text,remove);
  grid.appendChild(box);

  update(box);

  box.addEventListener('pointerdown',e=>{
    if(e.target===remove || rainbowMode)return;

    e.preventDefault();

    dragging=box;

    app.classList.add('dragging');

    box.style.cursor='grabbing';

    try{
      box.setPointerCapture(e.pointerId);
    }catch(_){}

    setValue(e);
  });

  box.addEventListener('pointermove',e=>{
    if(dragging===box){
      e.preventDefault();
      setValue(e);
    }
  });

  box.addEventListener('pointerup',()=>{
    if(dragging===box){
      dragging=null;
      app.classList.remove('dragging');
      box.style.cursor='grab';
    }
  });

  box.addEventListener('pointercancel',()=>{
    if(dragging===box){
      dragging=null;
      app.classList.remove('dragging');
    }
  });
}

function setValue(e){
  if(!dragging)return;

  const r=dragging.getBoundingClientRect();

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

document.addEventListener('pointerup',()=>{
  dragging=null;
  app.classList.remove('dragging');
});

/* =========================
   TITLE
========================= */

document.getElementById('applyName').onclick=()=>{
  const value=
    document.getElementById('styleName')
      .value.trim();

  document.getElementById(
    'styleTitle'
  ).textContent=value||'Name';
};

document.getElementById('titleColor').oninput=e=>{
  const title=
    document.getElementById('styleTitle');

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

document.getElementById('gradientName').onclick=()=>{
  const title=
    document.getElementById('styleTitle');

  title.classList.toggle(
    'title-gradient'
  );

  title.classList.remove(
    'title-custom-gradient'
  );
};

const titleGradient=
  document.getElementById('titleGradient');

const titleGradientTop=
  document.getElementById('titleGradientTop');

const titleGradientBottom=
  document.getElementById('titleGradientBottom');

titleGradient.onclick=()=>{
  const title=
    document.getElementById('styleTitle');

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
      document.getElementById('styleTitle');

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
   ADD STAT
========================= */

document.getElementById('add').onclick=()=>{
  const name=
    document.getElementById('statName')
      .value.trim()||'NEW STAT';

  const value=
    document.getElementById('statValue').value;

  addBox(name,value);

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
  document.getElementById('rainbowMode');

const rainbowHint=
  document.getElementById('rainbowHint');

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

grid.addEventListener('click',e=>{
  const box=
    e.target.closest('.box');

  if(
    !box ||
    e.target.closest('.remove') ||
    !rainbowMode
  )return;

  box.dataset.rainbow=
    box.dataset.rainbow==='true'
      ? 'false'
      : 'true';

  update(box);
});

/* =========================
   RESET
========================= */

document.getElementById('zero').onclick=()=>{
  [
    ...grid.children
  ].forEach(box=>{
    box.dataset.value=0;
    update(box);
  });
};

document.getElementById('ten').onclick=()=>{
  [
    ...grid.children
  ].forEach(box=>{
    box.dataset.value=10;
    update(box);
  });
};

document.getElementById('clear').onclick=()=>{
  grid.innerHTML='';
};

/* =========================
   FILE NAME
========================= */

function exportFileName(ext){

  const style=(
    document.getElementById(
      'styleName'
    ).value.trim() ||

    document.getElementById(
      'styleTitle'
    ).textContent.trim() ||

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
   SAVE PNG
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

  button.textContent=
    'Saving...';

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

    const stats=
      grid.cloneNode(true);

    stats
      .querySelectorAll('.remove')
      .forEach(x=>x.remove());

    wrap=
      document.createElement(
        'div'
      );

    wrap.style.cssText=
      'position:absolute;'+
      'left:-100000px;'+
      'top:0;'+
      'width:'+width+'px;'+
      'padding:0;'+
      'background:transparent;';

    wrap.appendChild(stats);

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
      cs.fontFamily||'Arial';

    let fontSize=
      Math.round(
        parseFloat(
          cs.fontSize
        )||64
      )*2;

    let fontWeight=
      cs.fontWeight||'900';

    let fontStyle=
      cs.fontStyle||'normal';

    ctx.font=
      fontStyle+
      ' '+
      fontWeight+
      ' '+
      fontSize+
      'px '+
      fontFamily;

    ctx.lineJoin='round';

    const isGradient=
      title.classList.contains(
        'title-gradient'
      ) ||
      title.classList.contains(
        'title-custom-gradient'
      );

    if(isGradient){

      if(
        title.classList.contains(
          'title-custom-gradient'
        )
      ){

        const top=
          cs.getPropertyValue(
            '--title-top'
          ).trim()||
          '#25ff00';

        const bottom=
          cs.getPropertyValue(
            '--title-bottom'
          ).trim()||
          '#396cff';

        const g=
          ctx.createLinearGradient(
            0,
            0,
            0,
            titleH*2
          );

        g.addColorStop(
          0,
          top
        );

        g.addColorStop(
          1,
          bottom
        );

        ctx.fillStyle=g;

      }else{

        const g=
          ctx.createLinearGradient(
            0,
            0,
            out.width,
            0
          );

        g.addColorStop(
          0,
          '#ff0000'
        );

        g.addColorStop(
          .14,
          '#ff7a00'
        );

        g.addColorStop(
          .28,
          '#fff000'
        );

        g.addColorStop(
          .42,
          '#25ff00'
        );

        g.addColorStop(
          .56,
          '#00d9ff'
        );

        g.addColorStop(
          .70,
          '#396cff'
        );

        g.addColorStop(
          .84,
          '#9d39ff'
        );

        g.addColorStop(
          1,
          '#ff00d9'
        );

        ctx.fillStyle=g;
      }

    }else{

      ctx.fillStyle=
        cs.color||'#ffffff';

    }

    const stroke=2*2;

    if(stroke>0){

      ctx.lineWidth=stroke;

      ctx.strokeStyle=
        cs.webkitTextStrokeColor||
        '#000000';

      ctx.strokeText(
        titleText,
        out.width/2,
        titleH
      );
    }

    ctx.fillText(
      titleText,
      out.width/2,
      titleH
    );

    ctx.restore();

    ctx.drawImage(
      statsCanvas,
      0,
      titleH*2
    );

    const a=
      document.createElement('a');

    a.download=
      exportFileName('png');

    a.href=
      out.toDataURL(
        'image/png'
      );

    document.body.appendChild(a);

    a.click();

    a.remove();

  }catch(err){

    console.error(err);

    alert(
      'Não foi possível salvar a imagem.'
    );

  }finally{

    if(wrap)wrap.remove();

    button.disabled=false;

    button.textContent=
      oldText;
  }
};

/* =========================
   GIF PALETTE
========================= */

function buildGifPalette(imageData){

  const data=
    imageData.data;

  const samples=[];

  const total=
    data.length/4;

  const step=
    Math.max(
      1,
      Math.floor(
        total/70000
      )
    );

  for(
    let p=0;
    p<total;
    p+=step
  ){

    const i=p*4;

    if(
      data[i+3]>=128
    ){

      samples.push([
        data[i],
        data[i+1],
        data[i+2]
      ]);

    }
  }

  if(!samples.length){
    samples.push([
      0,
      0,
      0
    ]);
  }

  function bounds(list){

    let r0=255;
    let r1=0;

    let g0=255;
    let g1=0;

    let b0=255;
    let b1=0;

    for(
      const c of list
    ){

      r0=Math.min(
        r0,
        c[0]
      );

      r1=Math.max(
        r1,
        c[0]
      );

      g0=Math.min(
        g0,
        c[1]
      );

      g1=Math.max(
        g1,
        c[1]
      );

      b0=Math.min(
        b0,
        c[2]
      );

      b1=Math.max(
        b1,
        c[2]
      );
    }

    return [
      r1-r0,
      g1-g0,
      b1-b0
    ];
  }

  let boxes=[
    samples
  ];

  while(
    boxes.length<255
  ){

    let best=-1;
    let axis=0;
    let range=-1;

    for(
      let i=0;
      i<boxes.length;
      i++
    ){

      if(
        boxes[i].length<2
      )continue;

      const rs=
        bounds(
          boxes[i]
        );

      const r=
        Math.max(
          rs[0],
          rs[1],
          rs[2]
        );

      if(r>range){

        range=r;
        best=i;
        axis=
          rs.indexOf(r);
      }
    }

    if(best<0)break;

    const list=
      boxes.splice(
        best,
        1
      )[0];

    list.sort(
      (a,b)=>
        a[axis]-b[axis]
    );

    const mid=
      Math.floor(
        list.length/2
      );

    boxes.push(
      list.slice(
        0,
        mid
      ),
      list.slice(
        mid
      )
    );
  }

  const palette=[
    [0,0,0]
  ];

  for(
    const box of boxes
  ){

    let r=0;
    let g=0;
    let b=0;

    for(
      const c of box
    ){

      r+=c[0];
      g+=c[1];
      b+=c[2];

    }

    const n=
      Math.max(
        1,
        box.length
      );

    palette.push([
      Math.round(r/n),
      Math.round(g/n),
      Math.round(b/n)
    ]);
  }

  while(
    palette.length<256
  ){
    palette.push([
      0,
      0,
      0
    ]);
  }

  return palette.slice(
    0,
    256
  );
}

function mapFrameToPalette(
  imageData,
  palette
){

  const src=
    imageData.data;

  const out=
    new Uint8Array(
      src.length/4
    );

  const cache=
    new Map();

  for(
    let i=0,j=0;
    i<src.length;
    i+=4,j++
  ){

    if(
      src[i+3]<128
    ){

      out[j]=0;
      continue;
    }

    const r=src[i];
    const g=src[i+1];
    const b=src[i+2];

    const key=
      (r>>3)+','+
      (g>>3)+','+
      (b>>3);

    let idx=
      cache.get(key);

    if(
      idx===undefined
    ){

      let best=1;
      let bestD=Infinity;

      for(
        let k=1;
        k<palette.length;
        k++
      ){

        const p=
          palette[k];

        const dr=
          r-p[0];

        const dg=
          g-p[1];

        const db=
          b-p[2];

        const d=
          dr*dr+
          dg*dg+
          db*db;

        if(d<bestD){

          bestD=d;
          best=k;

          if(d===0)break;
        }
      }

      idx=best;

      cache.set(
        key,
        idx
      );
    }

    out[j]=idx;
  }

  return out;
}

/* =========================
   GIF LZW
========================= */

function lzwEncode(indices){

  const clear=256;
  const end=257;

  let codeSize=9;
  let nextCode=258;

  let dict=new Map();

  const bytes=[];

  let cur=0;
  let bits=0;

  const writeCode=code=>{

    cur|=
      code<<bits;

    bits+=codeSize;

    while(
      bits>=8
    ){

      bytes.push(
        cur&255
      );

      cur>>>=8;

      bits-=8;
    }
  };

  writeCode(clear);

  if(indices.length){

    let prefix=
      indices[0];

    for(
      let i=1;
      i<indices.length;
      i++
    ){

      const k=
        indices[i];

      const key=
        prefix+','+k;

      if(
        dict.has(key)
      ){

        prefix=
          dict.get(key);

        continue;
      }

      writeCode(
        prefix
      );

      if(
        nextCode<4096
      ){

        dict.set(
          key,
          nextCode++
        );

        if(
          nextCode===512 ||
          nextCode===1024 ||
          nextCode===2048
        ){

          codeSize=
            Math.min(
              12,
              codeSize+1
            );
        }

      }else{

        writeCode(clear);

        dict=new Map();

        codeSize=9;
        nextCode=258;
      }

      prefix=k;
    }

    writeCode(prefix);
  }

  writeCode(end);

  if(bits>0){
    bytes.push(
      cur&255
    );
  }

  return bytes;
}

function pushSubBlocks(
  target,
  data
){

  for(
    let i=0;
    i<data.length;
    i+=255
  ){

    const chunk=
      data.slice(
        i,
        i+255
      );

    target.push(
      chunk.length,
      ...chunk
    );
  }

  target.push(0);
}

function encodeAnimatedGif(
  frames,
  width,
  height,
  delayMs
){

  const palette=
    buildGifPalette(
      frames[0]
    );

  const out=[];

  const pushStr=str=>{
    for(
      let i=0;
      i<str.length;
      i++
    ){

      out.push(
        str.charCodeAt(i)
      );
    }
  };

  const u16=n=>
    out.push(
      n&255,
      (n>>8)&255
    );

  pushStr('GIF89a');

  u16(width);
  u16(height);

  out.push(
    0xF7,
    0x00,
    0x00
  );

  for(
    const c of palette
  ){

    out.push(
      c[0],
      c[1],
      c[2]
    );
  }

  for(
    const frame of frames
  ){

    out.push(
      0x21,
      0xF9,
      0x04,
      0x01
    );

    u16(
      Math.max(
        1,
        Math.round(
          delayMs/10
        )
      )
    );

    out.push(
      0x00,
      0x00
    );

    out.push(0x2C);

    u16(0);
    u16(0);

    u16(width);
    u16(height);

    out.push(0x00);

    out.push(0x08);

    const indices=
      mapFrameToPalette(
        frame,
        palette
      );

    pushSubBlocks(
      out,
      lzwEncode(indices)
    );
  }

  out.push(0x3B);

  return new Uint8Array(
    out
  );
}

/* =========================
   SAVE GIF
========================= */

document.getElementById(
  'saveGif'
).onclick=async()=>{

  const button=
    document.getElementById(
      'saveGif'
    );

  const old=
    button.textContent;

  button.disabled=true;

  button.textContent=
    'Preparing...';

  app.classList.add(
    'exporting'
  );

  const frames=[];

  const frameCount=16;
  const delay=100;

  const rainbowFills=[];

  const rainbowBoxes=[
    ...document.querySelectorAll(
      '.box.rainbow-border'
    )
  ];

  try{

    for(
      let i=0;
      i<frameCount;
      i++
    ){

      const pos=
        (i/frameCount)*250+
        '%';

      rainbowFills.forEach(
        el=>{
          el.style.animation='none';

          el.style.backgroundPosition=
            pos+' 0';
        }
      );

      rainbowBoxes.forEach(
        el=>{
          el.style.animation='none';

          el.style.setProperty(
            '--gif-rainbow-pos',
            pos
          );
        }
      );

      const exportWrap=
        document.createElement(
          'div'
        );

      exportWrap.style.cssText=
        'position:fixed;'+
        'left:-100000px;'+
        'top:0;'+
        'width:'+grid.offsetWidth+'px;'+
        'padding:0;'+
        'background:transparent;';

      const titleClone=
        document
          .getElementById(
            'styleTitle'
          )
          .cloneNode(true);

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
          '.box.rainbow-border'
        )
        .forEach(
          el=>{
            el.style.setProperty(
              '--gif-rainbow-pos',
              pos
            );
          }
        );

      exportWrap.append(
        titleClone,
        gridClone
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
          (i+1)/
          frameCount*
          100
        )+
        '%';

      await new Promise(
        r=>setTimeout(
          r,
          10
        )
      );
    }

    const first=
      frames[0];

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
      ()=>URL.revokeObjectURL(url),
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
   DEFAULTS
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
