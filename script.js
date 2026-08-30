const grid = document.getElementById('grid');
const app = document.getElementById('app');

if(
  window.matchMedia('(pointer:coarse)').matches ||
  Math.min(window.innerWidth,screen.width) <= 900
){
  document.documentElement.classList.add('mobile-device');
}

let dragging = null;
let rainbowMode = false;

function color(v){
  if(v >= 10) return '#ff00d9';
  if(v >= 8) return '#25ff00';
  if(v >= 5) return '#fff000';
  if(v >= 2) return '#ff7a00';
  return '#ff0000';
}

function update(box){

  const v = Number(box.dataset.value) || 0;

  const c = color(v);

  box.style.setProperty('--color',c);

  const fill = box.querySelector('.fill');

  const rainbow = box.dataset.rainbow === 'true';

  fill.classList.remove('rainbow');

  fill.style.background = c;

  box.classList.toggle(
    'rainbow-border',
    rainbow
  );

  /* nunca deixa o preenchimento passar da borda */
  const innerWidth = Math.max(
    0,
    box.clientWidth - 10
  );

  const fillWidth = Math.min(
    innerWidth,
    Math.max(
      0,
      innerWidth * (v / 10)
    )
  );

  fill.style.width = fillWidth + 'px';
}

function addBox(name,value=5){

  const box = document.createElement('div');

  box.className = 'box';

  box.dataset.name = name;

  box.dataset.value =
    Math.max(
      0,
      Math.min(
        10,
        Number(value) || 5
      )
    );

  box.dataset.rainbow = 'false';

  const fill = document.createElement('div');

  fill.className = 'fill';

  const text = document.createElement('div');

  text.className = 'name';

  text.textContent = name;

  const remove = document.createElement('button');

  remove.className = 'remove';

  remove.textContent = '×';

  remove.title = 'Remove stat';

  remove.onclick = e => {

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

  box.addEventListener(
    'pointerdown',
    e => {

      if(
        e.target === remove ||
        rainbowMode
      ) return;

      e.preventDefault();

      dragging = box;

      app.classList.add('dragging');

      box.style.cursor = 'grabbing';

      try{
        box.setPointerCapture(
          e.pointerId
        );
      }catch(_){}

      setValue(e);
    }
  );

  box.addEventListener(
    'pointermove',
    e => {

      if(dragging === box){

        e.preventDefault();

        setValue(e);
      }
    }
  );

  box.addEventListener(
    'pointerup',
    () => {

      if(dragging === box){

        dragging = null;

        app.classList.remove(
          'dragging'
        );

        box.style.cursor = 'grab';
      }
    }
  );

  box.addEventListener(
    'pointercancel',
    () => {

      if(dragging === box){

        dragging = null;

        app.classList.remove(
          'dragging'
        );
      }
    }
  );
}

function setValue(e){

  if(!dragging) return;

  const r =
    dragging.getBoundingClientRect();

  const v =
    Math.max(
      0,
      Math.min(
        10,
        ((e.clientX - r.left) / r.width) * 10
      )
    );

  dragging.dataset.value = v;

  update(dragging);
}

document.addEventListener(
  'pointerup',
  () => {

    dragging = null;

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
).onclick = () => {

  const value =
    document.getElementById(
      'styleName'
    ).value.trim();

  document.getElementById(
    'styleTitle'
  ).textContent =
    value || 'Name';
};

document.getElementById(
  'titleColor'
).oninput = e => {

  const title =
    document.getElementById(
      'styleTitle'
    );

  title.classList.remove(
    'title-ultra',
    'title-gradient',
    'title-custom-gradient'
  );

  title.style.color =
    e.target.value || '#fff';

  title.style.webkitTextFillColor = '';

  title.style.webkitTextStroke =
    '2px #000';
};

document.getElementById(
  'gradientName'
).onclick = () => {

  const title =
    document.getElementById(
      'styleTitle'
    );

  title.classList.toggle(
    'title-ultra'
  );

  title.classList.remove(
    'title-gradient',
    'title-custom-gradient'
  );
};

const titleGradient =
  document.getElementById(
    'titleGradient'
  );

const titleGradientTop =
  document.getElementById(
    'titleGradientTop'
  );

const titleGradientBottom =
  document.getElementById(
    'titleGradientBottom'
  );

titleGradient.onclick = () => {

  const title =
    document.getElementById(
      'styleTitle'
    );

  const active =
    title.classList.toggle(
      'title-custom-gradient'
    );

  title.classList.remove(
    'title-ultra',
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
].forEach(input => {

  input.oninput = () => {

    const title =
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
   ADD STAT
========================= */

document.getElementById(
  'add'
).onclick = () => {

  const name =
    document.getElementById(
      'statName'
    ).value.trim() ||
    'NEW STAT';

  const value =
    document.getElementById(
      'statValue'
    ).value;

  addBox(
    name,
    value
  );

  document.getElementById(
    'statName'
  ).value = '';

  document.getElementById(
    'statValue'
  ).value = 5;
};

/* =========================
   RAINBOW
========================= */

const rainbowButton =
  document.getElementById(
    'rainbowMode'
  );

const rainbowHint =
  document.getElementById(
    'rainbowHint'
  );

rainbowButton.onclick = () => {

  rainbowMode = !rainbowMode;

  rainbowButton.classList.toggle(
    'active',
    rainbowMode
  );

  rainbowHint.textContent =
    rainbowMode
      ? 'Now click a stat to enable/disable Rainbow'
      : 'Click Rainbow, then click a stat';
};

grid.addEventListener(
  'click',
  e => {

    const box =
      e.target.closest('.box');

    if(
      !box ||
      e.target.closest('.remove') ||
      !rainbowMode
    ) return;

    box.dataset.rainbow =
      box.dataset.rainbow === 'true'
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
).onclick = () => {

  [
    ...grid.children
  ].forEach(box => {

    box.dataset.value = 0;

    update(box);
  });
};

document.getElementById(
  'ten'
).onclick = () => {

  [
    ...grid.children
  ].forEach(box => {

    box.dataset.value = 10;

    update(box);
  });
};

document.getElementById(
  'clear'
).onclick = () => {

  grid.innerHTML = '';
};

/* =========================
   FILE NAME
========================= */

function exportFileName(ext){

  const style =
    (
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
    .trim() || 'Name';

  return style +
    ' - Concept.' +
    ext;
}

/* =========================
   SAVE PNG
========================= */

document.getElementById(
  'savePng'
).onclick = async () => {

  const button =
    document.getElementById(
      'savePng'
    );

  if(button.disabled) return;

  const oldText =
    button.textContent;

  button.disabled = true;

  button.textContent =
    'Saving...';

  let wrap = null;

  try{

    if(
      typeof html2canvas !==
      'function'
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

    const appRect =
      app.getBoundingClientRect();

    const width =
      Math.round(
        appRect.width
      );

    const stats =
      grid.cloneNode(true);

    /*
      classe usada somente
      durante a exportação
    */
    stats.classList.add(
      'exporting-stats'
    );

    stats
      .querySelectorAll('.remove')
      .forEach(x => x.remove());

    wrap =
      document.createElement(
        'div'
      );

    wrap.style.cssText =
      'position:absolute;' +
      'left:-100000px;' +
      'top:0;' +
      'width:' +
      width +
      'px;' +
      'padding:0;' +
      'background:transparent;';

    wrap.appendChild(stats);

    document.body.appendChild(
      wrap
    );

    const scale = 3;

    const statsCanvas =
      await html2canvas(
        wrap,
        {
          backgroundColor:null,
          scale:scale,
          useCORS:true,
          allowTaint:true,
          logging:false
        }
      );

    const title =
      document.getElementById(
        'styleTitle'
      );

    const titleText =
      title.textContent || 'Name';

    const cs =
      getComputedStyle(title);

    const originalFontSize =
      parseFloat(
        cs.fontSize
      ) || 64;

    const scaledFontSize =
      Math.round(
        originalFontSize *
        scale
      );

    const titleH =
      Math.round(
        scaledFontSize * 1.5
      );

    const out =
      document.createElement(
        'canvas'
      );

    out.width =
      statsCanvas.width;

    out.height =
      statsCanvas.height +
      titleH;

    const ctx =
      out.getContext('2d');

    ctx.clearRect(
      0,
      0,
      out.width,
      out.height
    );

    ctx.save();

    ctx.textAlign =
      'center';

    ctx.textBaseline =
      'middle';

    const fontFamily =
      cs.fontFamily ||
      'Arial';

    const fontWeight =
      cs.fontWeight ||
      '700';

    const fontStyle =
      cs.fontStyle ||
      'normal';

    ctx.font =
      fontStyle +
      ' ' +
      fontWeight +
      ' ' +
      scaledFontSize +
      'px ' +
      fontFamily;

    ctx.lineJoin =
      'round';

    const isGradient =
      title.classList.contains(
        'title-gradient'
      ) ||
      title.classList.contains(
        'title-custom-gradient'
      );

    const centerY =
      titleH / 2;

    if(isGradient){

      if(
        title.classList.contains(
          'title-custom-gradient'
        )
      ){

        const top =
          cs.getPropertyValue(
            '--title-top'
          ).trim() ||
          '#25ff00';

        const bottom =
          cs.getPropertyValue(
            '--title-bottom'
          ).trim() ||
          '#396cff';

        const g =
          ctx.createLinearGradient(
            0,
            centerY -
              scaledFontSize / 2,
            0,
            centerY +
              scaledFontSize / 2
          );

        g.addColorStop(
          0,
          top
        );

        g.addColorStop(
          1,
          bottom
        );

        ctx.fillStyle = g;

      }else{

        const g =
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

        ctx.fillStyle = g;
      }

    }else{

      ctx.fillStyle =
        cs.color ||
        '#ffffff';
    }

    /*
      contorno somente quando necessário
    */
    const stroke =
      2 * scale;

    if(
      stroke > 0 &&
      !isGradient
    ){

      ctx.lineWidth =
        stroke;

      ctx.strokeStyle =
        '#000000';

      ctx.strokeText(
        titleText,
        out.width / 2,
        centerY
      );
    }

    ctx.fillText(
      titleText,
      out.width / 2,
      centerY
    );

    /*
      linha branca/divisória:
      mesma linha da edição,
      agora também entra no PNG
    */
    const lineY =
      titleH -
      (28 * scale) -
      (1.5 * scale);

    const lineWidth =
      Math.min(
        440 * scale,
        out.width * 0.70
      );

    const lineGradient =
      ctx.createLinearGradient(
        out.width / 2 - lineWidth / 2,
        0,
        out.width / 2 + lineWidth / 2,
        0
      );

    lineGradient.addColorStop(
      0,
      'rgba(83,96,106,0)'
    );

    lineGradient.addColorStop(
      .20,
      '#53606a'
    );

    lineGradient.addColorStop(
      .50,
      '#a5afb6'
    );

    lineGradient.addColorStop(
      .80,
      '#53606a'
    );

    lineGradient.addColorStop(
      1,
      'rgba(83,96,106,0)'
    );

    ctx.save();

    ctx.fillStyle =
      lineGradient;

    ctx.shadowColor =
      'rgba(0,0,0,.9)';

    ctx.shadowBlur =
      5 * scale;

    ctx.fillRect(
      out.width / 2 -
        lineWidth / 2,
      lineY,
      lineWidth,
      3 * scale
    );

    ctx.restore();

    ctx.restore();

    ctx.drawImage(
      statsCanvas,
      0,
      titleH
    );

    const a =
      document.createElement(
        'a'
      );

    a.download =
      exportFileName('png');

    a.href =
      out.toDataURL(
        'image/png'
      );

    document.body.appendChild(
      a
    );

    a.click();

    a.remove();

  }catch(err){

    console.error(err);

    alert(
      'Could not save the image.'
    );

  }finally{

    if(wrap){
      wrap.remove();
    }

    button.disabled = false;

    button.textContent =
      oldText;
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
  x => addBox(x,5)
);

window.addEventListener(
  'resize',
  () => {
    [
      ...grid.children
    ].forEach(
      box => update(box)
    );
  }
);
