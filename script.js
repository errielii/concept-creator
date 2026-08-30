const grid = document.getElementById('grid');
const app = document.getElementById('app');

if (
  window.matchMedia('(pointer:coarse)').matches ||
  Math.min(window.innerWidth, screen.width) <= 900
) {
  document.documentElement.classList.add('mobile-device');
}

let dragging = null;
let rainbowMode = false;

/* =========================
   COLORS
========================= */

function color(v) {
  if (v >= 10) return '#ff00d9';
  if (v >= 8) return '#25ff00';
  if (v >= 5) return '#fff000';
  if (v >= 2) return '#ff7a00';
  return '#ff0000';
}

/* =========================
   UPDATE STAT
========================= */

function update(box) {
  const v = Math.max(
    0,
    Math.min(10, Number(box.dataset.value) || 0)
  );

  box.dataset.value = v;

  const c = color(v);

  box.style.setProperty('--color', c);

  const fill = box.querySelector('.fill');

  if (!fill) return;

  const rainbow = box.dataset.rainbow === 'true';

  box.classList.toggle('rainbow-border', rainbow);

  /*
    IMPORTANTE:
    O preenchimento usa a área INTERNA da box.
    Assim nunca passa da borda, mesmo em 10/10.
  */

  const percent = Math.max(
    0,
    Math.min(100, v * 10)
  );

  fill.style.left = '5px';
  fill.style.right = 'auto';
  fill.style.top = '5px';
  fill.style.bottom = '5px';

  fill.style.width =
    `calc(${percent}% - ${percent >= 100 ? 10 : 0}px)`;

  fill.style.maxWidth =
    'calc(100% - 10px)';

  if (rainbow) {
    fill.style.background = `
      linear-gradient(
        90deg,
        #ff0000,
        #ff7a00,
        #fff000,
        #25ff00,
        #00d9ff,
        #396cff,
        #9d39ff,
        #ff00d9
      )
    `;
    fill.style.backgroundSize = '100% 100%';
    fill.style.animation = 'none';
  } else {
    fill.style.background = c;
    fill.style.animation = 'none';
  }
}

/* =========================
   ADD STAT
========================= */

function addBox(name, value = 5) {
  const box = document.createElement('div');

  box.className = 'box';

  box.dataset.name = name;

  box.dataset.value = Math.max(
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

  /* =========================
     DRAG VALUE
  ========================= */

  box.addEventListener(
    'pointerdown',
    e => {
      if (
        e.target === remove ||
        rainbowMode
      ) {
        return;
      }

      e.preventDefault();

      dragging = box;

      app.classList.add('dragging');

      box.style.cursor = 'grabbing';

      try {
        box.setPointerCapture(e.pointerId);
      } catch (_) {}

      setValue(e);
    }
  );

  box.addEventListener(
    'pointermove',
    e => {
      if (dragging === box) {
        e.preventDefault();
        setValue(e);
      }
    }
  );

  box.addEventListener(
    'pointerup',
    () => {
      if (dragging === box) {
        dragging = null;

        app.classList.remove('dragging');

        box.style.cursor = 'grab';
      }
    }
  );

  box.addEventListener(
    'pointercancel',
    () => {
      if (dragging === box) {
        dragging = null;

        app.classList.remove('dragging');

        box.style.cursor = 'grab';
      }
    }
  );
}

/* =========================
   SET VALUE
========================= */

function setValue(e) {
  if (!dragging) return;

  const r =
    dragging.getBoundingClientRect();

  const v = Math.max(
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

    app.classList.remove('dragging');
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

/* =========================
   TITLE COLOR
========================= */

document.getElementById(
  'titleColor'
).oninput = e => {
  const title =
    document.getElementById(
      'styleTitle'
    );

  title.classList.remove(
    'title-gradient',
    'title-custom-gradient'
  );

  title.style.color =
    e.target.value || '#fff';

  title.style.webkitTextFillColor = '';

  title.style.webkitTextStroke =
    '2px #000';
};

/* =========================
   ULTRA
========================= */

document.getElementById(
  'gradientName'
).onclick = () => {
  const title =
    document.getElementById(
      'styleTitle'
    );

  const active =
    title.classList.toggle(
      'title-gradient'
    );

  title.classList.remove(
    'title-custom-gradient'
  );

  /*
    Ultra agora só controla
    o modo do título.
    Não altera tamanho,
    posição ou stats.
  */

  if (active) {
    title.style.webkitTextFillColor =
      'transparent';
  } else {
    title.style.webkitTextFillColor = '';
  }
};

/* =========================
   CUSTOM TITLE GRADIENT
========================= */

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
    'title-gradient'
  );

  if (active) {
    title.style.setProperty(
      '--title-top',
      titleGradientTop.value
    );

    title.style.setProperty(
      '--title-bottom',
      titleGradientBottom.value
    );

    title.style.webkitTextFillColor =
      'transparent';
  } else {
    title.style.webkitTextFillColor = '';
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
   ADD BUTTON
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

    if (
      !box ||
      e.target.closest('.remove') ||
      !rainbowMode
    ) {
      return;
    }

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

function exportFileName(ext) {
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

  return (
    style +
    ' - Concept.' +
    ext
  );
}

/* =========================
   EXPORT HELPERS
========================= */

function makeExportStats() {
  const stats =
    grid.cloneNode(true);

  stats
    .querySelectorAll('.remove')
    .forEach(x => x.remove());

  /*
    Exporta exatamente a largura
    visual do grid.
  */

  stats.style.width = '100%';
  stats.style.maxWidth = '800px';
  stats.style.margin = '0 auto';

  stats
    .querySelectorAll('.box')
    .forEach(box => {
      box.style.overflow = 'hidden';
      box.style.position = 'relative';

      /*
        Fundo restante:
        aproximadamente 70% transparente.
      */

      box.style.background =
        'linear-gradient(' +
        '180deg,' +
        'rgba(0,0,0,0.30) 0%,' +
        'rgba(0,0,0,0.20) 55%,' +
        'rgba(0,0,0,0.08) 100%' +
        ')';

      box.style.borderRadius = '10px';

      /*
        Mantém a borda normal.
      */

      box.style.boxShadow =
        'inset 0 0 0 1px rgba(0,0,0,.75),0 1px 2px #000';
    });

  stats
    .querySelectorAll('.fill')
    .forEach(fill => {
      const box = fill.parentElement;

      const value =
        Math.max(
          0,
          Math.min(
            10,
            Number(box.dataset.value) || 0
          )
        );

      const percent =
        Math.max(
          0,
          Math.min(
            100,
            value * 10
          )
        );

      fill.style.left = '5px';
      fill.style.top = '5px';
      fill.style.bottom = '5px';

      fill.style.width =
        percent >= 100
          ? 'calc(100% - 10px)'
          : `${percent}%`;

      fill.style.maxWidth =
        'calc(100% - 10px)';

      fill.style.borderRadius =
        '6px';

      /*
        Degradê suave no restante
        da área da barra.
      */

      fill.style.boxShadow =
        '0 0 8px rgba(0,0,0,.12)';
    });

  /*
    Fonte da edição = fonte da exportação.
    Remove o contorno duplicado.
  */

  stats
    .querySelectorAll('.name')
    .forEach(name => {
      name.style.fontFamily =
        "'Roboto Condensed', Arial, sans-serif";

      name.style.fontWeight =
        '700';

      name.style.fontStyle =
        'italic';

      name.style.webkitTextStroke =
        '0';

      name.style.textShadow =
        'none';

      name.style.color =
        '#fff';

      name.style.position =
        'absolute';

      name.style.inset =
        '0';

      name.style.display =
        'flex';

      name.style.alignItems =
        'center';

      name.style.justifyContent =
        'center';

      name.style.zIndex =
        '5';
    });

  return stats;
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

  if (button.disabled) return;

  const oldText =
    button.textContent;

  button.disabled = true;

  button.textContent =
    'Saving...';

  let wrap = null;

  try {

    if (
      typeof html2canvas !==
      'function'
    ) {
      throw new Error(
        'html2canvas missing'
      );
    }

    if (
      document.fonts &&
      document.fonts.ready
    ) {
      await document.fonts.ready;
    }

    const stats =
      makeExportStats();

    wrap =
      document.createElement(
        'div'
      );

    /*
      NÃO usa o tamanho inteiro
      do #app.

      Isso evita aquele PNG gigante
      e mantém a proporção da interface.
    */

    const gridRect =
      grid.getBoundingClientRect();

    const width =
      Math.round(
        gridRect.width
      );

    wrap.style.position =
      'absolute';

    wrap.style.left =
      '-100000px';

    wrap.style.top =
      '0';

    wrap.style.width =
      width + 'px';

    wrap.style.padding =
      '0';

    wrap.style.margin =
      '0';

    wrap.style.background =
      'transparent';

    wrap.style.overflow =
      'visible';

    wrap.appendChild(stats);

    document.body.appendChild(
      wrap
    );

    /*
      Linha branca fica na exportação.
    */

    const line =
      document.createElement(
        'div'
      );

    line.style.width =
      '440px';

    line.style.maxWidth =
      '70%';

    line.style.height =
      '3px';

    line.style.margin =
      '16px auto 0';

    line.style.background =
      'linear-gradient(' +
      '90deg,' +
      'transparent,' +
      '#53606a,' +
      '#a5afb6,' +
      '#53606a,' +
      'transparent' +
      ')';

    line.style.boxShadow =
      '0 1px 5px #000';

    /*
      Coloca a linha antes dos stats
      só no canvas de exportação.
    */

    const exportContent =
      document.createElement(
        'div'
      );

    exportContent.style.width =
      '100%';

    exportContent.style.background =
      'transparent';

    exportContent.style.padding =
      '0';

    exportContent.appendChild(
      line
    );

    exportContent.appendChild(
      stats
    );

    wrap.innerHTML = '';

    wrap.appendChild(
      exportContent
    );

    const scale = 3;

    const canvas =
      await html2canvas(
        wrap,
        {
          backgroundColor: null,
          scale: scale,
          useCORS: true,
          allowTaint: true,
          logging: false
        }
      );

    /*
      =========================
      TITLE
      =========================
    */

    const title =
      document.getElementById(
        'styleTitle'
      );

    const titleText =
      title.textContent ||
      'Name';

    const cs =
      getComputedStyle(title);

    const fontSize =
      parseFloat(
        cs.fontSize
      ) || 72;

    const titleHeight =
      Math.round(
        fontSize *
        1.5 *
        scale
      );

    const out =
      document.createElement(
        'canvas'
      );

    out.width =
      canvas.width;

    out.height =
      canvas.height +
      titleHeight;

    const ctx =
      out.getContext('2d');

    ctx.clearRect(
      0,
      0,
      out.width,
      out.height
    );

    /*
      Título
    */

    ctx.save();

    ctx.textAlign =
      'center';

    ctx.textBaseline =
      'middle';

    const fontFamily =
      "'Roboto Condensed', Arial, sans-serif";

    ctx.font =
      '700 italic ' +
      Math.round(
        fontSize * scale
      ) +
      'px ' +
      fontFamily;

    const titleY =
      titleHeight / 2;

    const isGradient =
      title.classList.contains(
        'title-gradient'
      ) ||
      title.classList.contains(
        'title-custom-gradient'
      );

    if (isGradient) {

      let gradient;

      if (
        title.classList.contains(
          'title-custom-gradient'
        )
      ) {

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

        gradient =
          ctx.createLinearGradient(
            0,
            titleY -
              fontSize * scale / 2,
            0,
            titleY +
              fontSize * scale / 2
          );

        gradient.addColorStop(
          0,
          top
        );

        gradient.addColorStop(
          1,
          bottom
        );

      } else {

        gradient =
          ctx.createLinearGradient(
            0,
            0,
            out.width,
            0
          );

        gradient.addColorStop(
          0,
          '#ff0000'
        );

        gradient.addColorStop(
          .14,
          '#ff7a00'
        );

        gradient.addColorStop(
          .28,
          '#fff000'
        );

        gradient.addColorStop(
          .42,
          '#25ff00'
        );

        gradient.addColorStop(
          .56,
          '#00d9ff'
        );

        gradient.addColorStop(
          .70,
          '#396cff'
        );

        gradient.addColorStop(
          .84,
          '#9d39ff'
        );

        gradient.addColorStop(
          1,
          '#ff00d9'
        );
      }

      ctx.fillStyle =
        gradient;

    } else {

      ctx.fillStyle =
        cs.color ||
        '#ffffff';
    }

    /*
      Mesmo texto da exportação,
      sem o contorno duplicado.
    */

    ctx.fillText(
      titleText,
      out.width / 2,
      titleY
    );

    ctx.restore();

    /*
      Stats ficam logo abaixo
    */

    ctx.drawImage(
      canvas,
      0,
      titleHeight
    );

    /*
      DOWNLOAD
    */

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

  } catch (err) {

    console.error(err);

    alert(
      'Could not save the image.'
    );

  } finally {

    if (wrap) {
      wrap.remove();
    }

    button.disabled =
      false;

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
  x => addBox(x, 5)
);

/* =========================
   REMOVE TITLE STAR
========================= */

const starStyle =
  document.createElement(
    'style'
  );

starStyle.textContent = `
  #styleTitle::before {
    display: none !important;
    content: none !important;
  }
`;

document.head.appendChild(
  starStyle
);
