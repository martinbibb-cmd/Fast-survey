(function(global){
  const CP_KWH_PER_LK = 0.001163; // specific heat of water in kWh/L·K

  const HW_PRESETS = {
    usage: {
      "Low (1–2 ppl)": { Vd: 80, draws: 12 },
      "Med (3–4 ppl)": { Vd: 130, draws: 18 },
      "High (5–6 ppl)": { Vd: 180, draws: 24 }
    },
    mains: {
      Winter: 8,
      "Spring/Autumn": 12,
      Summer: 16
    },
    layout: {
      Central: 0.35,
      Typical: 0.7,
      Remote: 1.2 // L waiting water per draw
    },
    system: {
      "Stored Gold (Worcester+Mixergy)": {
        type: "stored",
        standby: 1.0,
        ctrl: 0.95,
        Tret: 48,
        comfort: 92,
        future: 95,
        maint: 85
      },
      "Stored Standard": {
        type: "stored",
        standby: 1.4,
        ctrl: 1.0,
        Tret: 52,
        comfort: 88,
        future: 80,
        maint: 82
      },
      "Combi Standard": {
        type: "combi",
        start: 0.01,
        scale: 1.05,
        Tret: 55,
        comfort: 72,
        future: 50,
        maint: 70
      },
      "Combi Premium": {
        type: "combi",
        start: 0.008,
        scale: 1.0,
        Tret: 52,
        comfort: 78,
        future: 55,
        maint: 78
      }
    },
    price: { gas: 0.07, elec: 0.22, water: 0.0003 }, // £/kWh, £/L
    weight: { energy: 3, cost: 5, comfort: 4, future: 4, maint: 2 },
    Tuse: 40
  };

  const DEFAULTS = {
    usage: "Med (3–4 ppl)",
    mains: "Spring/Autumn",
    layout: "Central",
    system: "Stored Gold (Worcester+Mixergy)"
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const invU = (value, best) => clamp(100 * (best / value), 10, 100);
  const rnd = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits;

  function etaFromReturn(T) {
    if (T <= 30) return 0.98;
    if (T >= 55) return 0.88;
    return 0.98 - 0.004 * (T - 30);
  }

  function resolveOption(presetGroup, value, fallbackKey) {
    if (presetGroup[value]) {
      return value;
    }
    return fallbackKey;
  }

  function computeSystem({ usage, mains, layout, system }) {
    const usageKey = resolveOption(HW_PRESETS.usage, usage, DEFAULTS.usage);
    const mainsKey = resolveOption(HW_PRESETS.mains, mains, DEFAULTS.mains);
    const layoutKey = resolveOption(HW_PRESETS.layout, layout, DEFAULTS.layout);
    const systemKey = resolveOption(HW_PRESETS.system, system, DEFAULTS.system);

    const U = HW_PRESETS.usage[usageKey];
    const M = HW_PRESETS.mains[mainsKey];
    const L = HW_PRESETS.layout[layoutKey];
    const S = HW_PRESETS.system[systemKey];

    const Tm = M;
    const Tu = HW_PRESETS.Tuse;
    const Vd = U.Vd;

    const Euse = Vd * CP_KWH_PER_LK * (Tu - Tm);
    const Vwait = L * U.draws;
    const Ewait = Vwait * CP_KWH_PER_LK * (Tu - Tm);
    const eta = etaFromReturn(S.Tret);

    let EkWh;
    let pounds;
    if (S.type === "stored") {
      const Egas = ((Euse + Ewait) / eta) * S.ctrl;
      EkWh = Egas + S.standby;
      pounds = EkWh * HW_PRESETS.price.gas + Vwait * HW_PRESETS.price.water;
    } else {
      const etaEff = eta / S.scale;
      const Eover = U.draws * (S.start || 0.01);
      EkWh = (Euse + Ewait) / etaEff + Eover;
      pounds = EkWh * HW_PRESETS.price.gas + Vwait * HW_PRESETS.price.water;
    }

    const comfort = clamp(
      S.comfort - (layoutKey === "Central" ? 0 : layoutKey === "Typical" ? 6 : 12),
      10,
      100
    );
    const future = clamp(S.future, 10, 100);
    const maint = clamp(S.maint, 10, 100);

    return { EkWh, pounds, Vwait, eta, utilities: { comfort, future, maint } };
  }

  function hwCompute(options = {}) {
    const merged = {
      usage: options.usage ?? DEFAULTS.usage,
      mains: options.mains ?? DEFAULTS.mains,
      layout: options.layout ?? DEFAULTS.layout,
      system: options.system ?? DEFAULTS.system
    };

    const base = computeSystem(merged);
    const bestGold = computeSystem({ ...merged, system: "Stored Gold (Worcester+Mixergy)" });
    const bestCombi = computeSystem({ ...merged, system: "Combi Premium" });

    const bestkWh = Math.min(bestGold.EkWh, bestCombi.EkWh);
    const bestPounds = Math.min(bestGold.pounds, bestCombi.pounds);

    const utilities = base.utilities;
    const weights = HW_PRESETS.weight;
    const energyScore = invU(base.EkWh, bestkWh);
    const costScore = invU(base.pounds, bestPounds);

    const score =
      (weights.energy * energyScore +
        weights.cost * costScore +
        weights.comfort * utilities.comfort +
        weights.future * utilities.future +
        weights.maint * utilities.maint) /
      (weights.energy + weights.cost + weights.comfort + weights.future + weights.maint);

    return {
      ...merged,
      kWh: rnd(base.EkWh, 3),
      cost: rnd(base.pounds, 2),
      wasteL: rnd(base.Vwait, 1),
      utilities: {
        energy: energyScore,
        cost: costScore,
        comfort: utilities.comfort,
        future: utilities.future,
        maint: utilities.maint,
        score: rnd(score, 0)
      },
      η: rnd(base.eta, 3)
    };
  }

  let cssInjected = false;
  function ensureCardStyles() {
    if (cssInjected) return;
    const css = document.createElement("style");
    css.textContent =
      ".hw-card{border:1px solid #ccc;padding:10px;border-radius:8px;font:14px/1.4 -apple-system,Segoe UI,Roboto;}" +
      ".hw-card hr{border:none;border-top:1px solid #eee;margin:6px 0}";
    document.head.appendChild(css);
    cssInjected = true;
  }

  function renderCard(div, opts = {}) {
    if (!div) {
      return null;
    }
    ensureCardStyles();
    const result = hwCompute(opts);
    div.innerHTML =
      `<div class="hw-card">\n` +
      `        <strong>${result.system}</strong><br>\n` +
      `        ${result.usage} • ${result.mains} • ${result.layout}<hr>\n` +
      `        <b>${result.kWh}</b> kWh/day (£${result.cost}/day)<br>\n` +
      `        <small>≈${Math.round(result.kWh * 365)} kWh/yr • £${Math.round(result.cost * 365)} /yr</small><br>\n` +
      `        Wasted water ${result.wasteL} L/day<br>\n` +
      `        <b>Customer score ${result.utilities.score}/100</b><br>\n` +
      `        <small>η ${result.η}</small>\n` +
      `      </div>`;
    return result;
  }

  const api = {
    compute: hwCompute,
    render: renderCard
  };

  global.FastSurveyHotWater = Object.assign({}, global.FastSurveyHotWater, api);
})(typeof window !== "undefined" ? window : globalThis);
