/* Spoken preparation with shared affixes or grammatical contexts. */
(() => {
  "use strict";
  const MATERIALS = {
    prefix: [
      ["mean", "unkind", "un-"], ["biased", "unfair", "un-"], ["false", "untrue", "un-"],
      ["book", "reread", "re-"], ["draft", "rewrite", "re-"], ["wall", "repaint", "re-"],
      ["aversion", "dislike", "dis-"], ["doubt", "distrust", "dis-"], ["argue", "disagree", "dis-"],
    ],
    suffix: [
      ["sloppy", "careless", "-less"], ["shelter", "homeless", "-less"], ["despair", "hopeless", "-less"],
      ["celebrate", "joyful", "-ful"], ["aid", "helpful", "-ful"], ["games", "playful", "-ful"],
      ["generous", "kindness", "-ness"], ["night", "darkness", "-ness"], ["cushion", "softness", "-ness"],
    ],
  };
  const GRAMMAR_CONTEXTS = {
    past: { label: "Simple past", lead: "Yesterday, I" },
    present: { label: "Habitual present", lead: "Every day, I" },
    perfect: { label: "Present perfect", lead: "I have already" },
  };
  const GRAMMAR_VERBS = [
    { lemma: "go", complement: "home", past: "went", present: "go", perfect: "gone" },
    { lemma: "eat", complement: "lunch", past: "ate", present: "eat", perfect: "eaten" },
    { lemma: "buy", complement: "bread", past: "bought", present: "buy", perfect: "bought" },
  ];
  const GRAMMAR_ITEMS = Object.entries(GRAMMAR_CONTEXTS).flatMap(([feature, context]) =>
    GRAMMAR_VERBS.map(verb => ({
      cue: `${verb.lemma.toUpperCase()} | ${context.lead} ___ ${verb.complement}.`,
      target: verb[feature], lemma: verb.lemma, feature,
      frame: `${context.lead} ___ ${verb.complement}.`, affix: "", domain: "grammar",
    }))
  );
  const DOMAINS = ["prefix", "suffix", "grammar"];
  const DOMAIN_LABELS = { prefix: "Prefixes", suffix: "Suffixes", grammar: "Grammar" };
  const MIN_RT = 150;
  const MAX_RT = 8000;
  function randomSource(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6D2B79F5;
      let x = value;
      x = Math.imul(x ^ x >>> 15, x | 1);
      x ^= x + Math.imul(x ^ x >>> 7, x | 61);
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffle(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function buildSchedule(mode, seed) {
    if (![...DOMAINS, "both"].includes(mode)) throw new Error("Unknown session type");
    const random = randomSource(seed);
    const domains = mode === "both" ? shuffle(["prefix", "suffix"], random) : [mode];
    return domains.flatMap(domain => {
      const items = domain === "grammar" ? GRAMMAR_ITEMS.map(item => ({ ...item }))
        : MATERIALS[domain].map(([cue, target, affix]) => ({ cue, target, affix, domain }));
      const shared = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
      // Grammar blocks always contain all three lemmas, including mixed blocks.
      const mixed = domain === "grammar" ? [[0, 4, 8], [1, 5, 6], [2, 3, 7]]
        : [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
      return shuffle(["shared", "mixed"], random).flatMap(condition =>
        shuffle(condition === "shared" ? shared : mixed, random).map(indices => {
          const members = indices.map(i => items[i]);
          const first = shuffle(members, random);
          const second = shuffle(members, random);
          if (first[2].target === second[0].target) [second[0], second[1]] = [second[1], second[0]];
          return { domain, condition, members, practice: shuffle(members, random), trials: [...first, ...second] };
        })
      );
    });
  }
  const median = values => {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  function summarize(rows) {
    return DOMAINS.flatMap(domain => ["shared", "mixed"].map(condition => {
      const measured = rows.filter(r => r.domain === domain && r.condition === condition && r.phase === "measured");
      const usable = measured.filter(r => r.correct === true && r.reason === "" && r.rt_ms >= MIN_RT && r.rt_ms <= MAX_RT);
      return { domain, condition, attempted: measured.length, correct: measured.filter(r => r.correct === true).length,
        errors: measured.filter(r => r.correct === false).length,
        excluded: measured.length - usable.length, usable: usable.length, median: median(usable.map(r => r.rt_ms)) };
    }));
  }
  globalThis.MorphPriming = { buildSchedule, summarize, MATERIALS, GRAMMAR_ITEMS };
  if (typeof document === "undefined") return;
  const app = document.getElementById("priming-app");
  if (!app) return;
  const $ = id => document.getElementById(id);
  const stage = $("priming-stage");
  let state = "setup", phase = "practice", blocks = [], blockIndex = 0, trialIndex = 0;
  let rows = [], pending = null, seed, sessionId, method, onset = 0, timer, frame, token = 0;
  let stream, context, analyser, buffer, threshold = 0.02;
  let lastVoiceTime = 0;
  function clearTiming() {
    clearTimeout(timer); cancelAnimationFrame(frame); token++;
  }
  function stopMicrophone() {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (context) context.close().catch(() => {});
    stream = context = analyser = null;
  }
  function rms() {
    analyser.getFloatTimeDomainData(buffer);
    return Math.sqrt(buffer.reduce((sum, n) => sum + n * n, 0) / buffer.length);
  }
  async function prepareMicrophone() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone access requires HTTPS or localhost. Choose Space timing instead.");
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
    context = new AudioContext();
    await context.resume();
    analyser = context.createAnalyser(); analyser.fftSize = 1024;
    context.createMediaStreamSource(stream).connect(analyser);
    buffer = new Float32Array(analyser.fftSize);
    $("priming-setup-status").textContent = "Stay quiet for one second while the microphone checks background sound.";
    const samples = [];
    for (let i = 0; i < 25; i++) { samples.push(rms()); await new Promise(resolve => setTimeout(resolve, 40)); }
    samples.sort((a, b) => a - b);
    threshold = Math.max(0.012, samples[Math.floor(samples.length * 0.9)] * 3.5);
    if (threshold > 0.2) throw new Error("Background sound is too high. Find a quieter place or use Space timing.");
  }
  const pairs = members => `<table><thead><tr><th>Cue</th><th>Say</th></tr></thead><tbody>${members.map(i => `<tr><td>${i.cue}</td><td><strong>${i.target}</strong></td></tr>`).join("")}</tbody></table>`;
  function button(id, label, action, secondary = false) {
    const b = document.createElement("button"); b.type = "button"; b.id = id; b.textContent = label;
    if (secondary) b.className = "priming-secondary";
    b.addEventListener("click", action); return b;
  }
  function progress() {
    $("priming-progress").textContent = `Block ${blockIndex + 1} of ${blocks.length} · ${phase === "practice" ? "Practice" : "Measured trials"}`;
  }
  function study() {
    clearTiming(); state = "study"; phase = "practice"; trialIndex = 0; pending = null; progress();
    const block = blocks[blockIndex];
    if (block.domain === "grammar") {
      const features = [...new Set(block.members.map(item => item.feature))];
      stage.innerHTML = `<h2>Complete the sentence</h2><p>Each trial shows a verb and a sentence with a gap. Say <strong>only the missing verb form</strong>.</p><p>The verbs in every block are <strong>GO, EAT, BUY</strong>.</p><p>${block.condition === "shared" ? "Every sentence in this block uses the same grammatical context." : "The grammatical context changes across trials in this block."}</p><ul>${features.map(feature => `<li><strong>${GRAMMAR_CONTEXTS[feature].label}:</strong> ${GRAMMAR_CONTEXTS[feature].lead} ___ …</li>`).join("")}</ul><p>For example: GIVE · Yesterday, I ___ a gift. Say <strong>gave</strong>.</p>`;
    } else {
      stage.innerHTML = `<h2>Learn these three pairs</h2><p>These are the possible answers in this block. Say each pair aloud before continuing.</p>${pairs(block.members)}<p>Keep the same pronunciation each time.${block.members.some(i => i.target === "reread") ? " <em>Reread</em> means read again, as in “I will reread it.”" : ""}</p>`;
    }
    stage.append(button("priming-practice", block.domain === "grammar" ? "Practice completing sentences" : "Practice these pairs", ready));
    $("priming-practice").focus();
  }
  function ready() {
    clearTiming(); state = "ready"; progress();
    const count = phase === "practice" ? blocks[blockIndex].practice.length : blocks[blockIndex].trials.length;
    const instruction = blocks[blockIndex].domain === "grammar"
      ? "When the verb and sentence appear, say only the missing verb form."
      : "Say the response when its cue appears.";
    stage.innerHTML = `<h2>${phase === "practice" ? "Practice" : "Measured trial"} ${trialIndex + 1} of ${count}</h2><p>${instruction}</p><p>${method === "voice" ? "Wait quietly for the cue. The microphone will detect sound onset." : "Press Space or tap the response button as you begin speaking."}</p>`;
    stage.append(button("priming-next", "Ready (Space)", startTrial));
    $("priming-next").focus();
  }
  function startTrial() {
    if (state !== "ready") return;
    clearTiming(); state = "fixation";
    stage.innerHTML = '<div class="priming-cue" aria-label="Get ready">+</div>';
    const thisToken = token;
    timer = setTimeout(() => {
      if (token !== thisToken) return;
      const block = blocks[blockIndex];
      const item = (phase === "practice" ? block.practice : block.trials)[trialIndex];
      stage.innerHTML = block.domain === "grammar"
        ? `<div class="priming-grammar-cue"><div class="priming-lemma">${item.lemma.toUpperCase()}</div><p class="priming-sentence">${item.frame}</p></div><p class="priming-center">Say only the missing verb form.</p>`
        : `<div class="priming-cue">${item.cue}</div><p class="priming-center">Say the paired response.</p>`;
      if (method === "key") stage.append(button("priming-response", "I am starting to speak (Space)", () => finishTrial(performance.now() - onset, "")));
      pending = { session: sessionId, seed, method, voice_threshold: method === "voice" ? threshold : "", block: blockIndex + 1,
        domain: block.domain, condition: block.condition, phase, trial: trialIndex + 1,
        cue: item.cue, target: item.target, affix: item.affix,
        lemma: item.lemma || "", grammatical_feature: item.feature || "", sentence_frame: item.frame || "",
        rt_ms: null, correct: null, reason: "" };
      frame = requestAnimationFrame(() => {
        if (token !== thisToken) return;
        onset = performance.now(); state = "responding";
        timer = setTimeout(() => finishTrial(null, "timeout"), MAX_RT);
        if (method === "voice") listen();
      });
    }, 500 + Math.random() * 300);
  }
  function listen() {
    if (state !== "responding") return;
    const now = performance.now();
    if (rms() >= threshold) {
      if (!lastVoiceTime) lastVoiceTime = now;
      if (now - lastVoiceTime >= 35) { finishTrial(lastVoiceTime - onset, ""); return; }
    } else lastVoiceTime = 0;
    frame = requestAnimationFrame(listen);
  }
  function finishTrial(rt, reason) {
    if (state !== "responding") return;
    clearTiming(); lastVoiceTime = 0; state = "review";
    pending.rt_ms = rt === null ? null : Math.round(rt);
    pending.reason = reason || (rt < MIN_RT ? "too_fast" : "");
    const timing = rt === null ? "No response detected within 8 seconds." : `${Math.round(rt)} ms · ${method === "key" ? "manual timing proxy" : "detected sound onset"}`;
    stage.innerHTML = `<h2>Check your answer</h2><p>Expected response:</p><p class="priming-answer">${pending.target}</p><p>${timing}</p><p>Did you say this word correctly?</p>`;
    const actions = document.createElement("div"); actions.className = "priming-actions";
    const correct = button("priming-correct", "Correct (C)", () => score(true));
    correct.disabled = reason === "timeout";
    actions.append(correct, button("priming-error", "Incorrect / no answer (X)", () => score(false), true),
      button("priming-retry", "False trigger / interrupted (R)", retry, true));
    stage.append(actions);
    if (pending.reason === "too_fast") stage.insertAdjacentHTML("beforeend", "<p>This response is under 150 ms and will be excluded from the timing summary.</p>");
  }
  function score(correct) {
    if (state !== "review" || (correct && pending.reason === "timeout")) return;
    pending.correct = correct; rows.push(pending); pending = null; advance();
  }
  function retry() {
    if (!["review", "interrupted"].includes(state)) return;
    if (pending) { pending.correct = null; pending.reason = "interrupted"; rows.push(pending); pending = null; }
    ready();
  }
  function advance() {
    trialIndex++;
    const block = blocks[blockIndex];
    if (phase === "practice" && trialIndex === block.practice.length) {
      phase = "measured"; trialIndex = 0; state = "transition";
      stage.innerHTML = block.domain === "grammar"
        ? "<h2>Practice complete</h2><p>Now complete the sentences as quickly and accurately as you can. Say only the missing verb.</p>"
        : "<h2>Practice complete</h2><p>The same three pairs will now be tested. Their order will change.</p>";
      stage.append(button("priming-measured", "Begin measured trials", ready));
      $("priming-measured").focus();
    } else if (phase === "measured" && trialIndex === block.trials.length) {
      blockIndex++;
      if (blockIndex === blocks.length) showResults(); else study();
    } else ready();
  }
  function csvDownload() {
    const fields = ["session", "seed", "method", "voice_threshold", "block", "domain", "condition", "phase", "trial", "cue", "target", "affix", "lemma", "grammatical_feature", "sentence_frame", "rt_ms", "correct", "reason"];
    const quote = x => `"${String(x ?? "").replaceAll('"', '""')}"`;
    const csv = [fields.join(","), ...rows.map(r => fields.map(f => quote(r[f])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `morpheme-priming-${sessionId}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function showResults() {
    clearTiming(); stopMicrophone();
    if (pending) { pending.reason = "session_ended"; pending.correct = null; rows.push(pending); pending = null; }
    state = "results"; $("priming-session").hidden = true; $("priming-results").hidden = false;
    const summary = summarize(rows).filter(r => r.attempted);
    const result = $("priming-results");
    result.innerHTML = `<h2>Your session</h2><p>${blockIndex === blocks.length ? "All blocks completed." : "Partial session: some blocks were not completed."} Timing: <strong>${method === "key" ? "manual proxy, not measured speech onset" : "microphone sound onset, not verified speech onset"}</strong>.</p>`;
    if (!summary.length) result.insertAdjacentHTML("beforeend", "<p>No measured trials completed yet.</p>");
    else {
      result.insertAdjacentHTML("beforeend", `<div class="priming-scroll"><table><thead><tr><th>Set</th><th>Grouping</th><th>Usable / attempts</th><th>Errors</th><th>Median (ms)</th></tr></thead><tbody>${summary.map(r => `<tr><td>${r.domain}</td><td>${r.condition}</td><td>${r.usable} / ${r.attempted}</td><td>${r.errors}</td><td>${r.median === null ? "n/a" : Math.round(r.median)}</td></tr>`).join("")}</tbody></table></div>`);
      for (const domain of DOMAINS) {
        const shared = summary.find(r => r.domain === domain && r.condition === "shared");
        const mixed = summary.find(r => r.domain === domain && r.condition === "mixed");
        if (shared?.median != null && mixed?.median != null) result.insertAdjacentHTML("beforeend", `<p class="priming-benefit"><strong>${DOMAIN_LABELS[domain]}: ${Math.round(mixed.median - shared.median)} ms</strong> preparation benefit (mixed minus shared). Positive means faster in shared blocks.</p>`);
      }
      result.insertAdjacentHTML("beforeend", "<p>Practice, errors, interruptions, timeouts, and responses under 150 ms do not enter the medians. These are small classroom samples; no particular direction of effect is guaranteed.</p>");
      if (summary.some(r => r.domain === "grammar")) result.insertAdjacentHTML("beforeend", "<p>Shared grammar blocks repeat a grammatical context without a common affix across the three verbs. The same verb-and-sentence items appear in mixed blocks. Any benefit may include context repetition and reduced switching as well as grammatical preparation.</p>");
      if (summary.some(r => r.domain !== "grammar")) result.insertAdjacentHTML("beforeend", "<p>Affix repetition also repeats sounds and meaning. A sound-only control would be needed to isolate morphological preparation. The prefix and suffix lists are not matched for other lexical properties.</p>");
    }
    result.append(button("priming-download", "Download all trials (CSV)", csvDownload), document.createTextNode(" "), button("priming-again", "Choose another session", reset, true));
    result.scrollIntoView({ block: "start" });
  }
  function reset() {
    clearTiming(); stopMicrophone(); state = "setup"; pending = null;
    $("priming-results").hidden = true; $("priming-setup").hidden = false;
    $("priming-setup-status").textContent = ""; $("priming-start").disabled = false;
  }
  $("priming-start").addEventListener("click", async () => {
    if (state !== "setup") return;
    state = "starting"; $("priming-start").disabled = true;
    method = $("priming-measure").value;
    try {
      if (method === "voice") await prepareMicrophone();
      seed = crypto.getRandomValues(new Uint32Array(1))[0]; sessionId = seed.toString(16);
      blocks = buildSchedule($("priming-design").value, seed); blockIndex = 0; rows = []; lastVoiceTime = 0;
      $("priming-setup").hidden = true; $("priming-session").hidden = false; study();
    } catch (error) {
      stopMicrophone(); state = "setup"; $("priming-start").disabled = false;
      $("priming-setup-status").textContent = `${error.message} You can select Space timing and start again.`;
    }
  });
  $("priming-measure").addEventListener("change", () => {
    $("priming-measure-help").textContent = $("priming-measure").value === "voice"
      ? "Sound onset is detected locally. Use a quiet room; remain silent during the background check. No audio is recorded or uploaded."
      : "Space records a manual timing proxy, not a measured speech onset. On a touch device, tap the response button as you begin speaking.";
  });
  $("priming-end").addEventListener("click", showResults);
  document.addEventListener("keydown", event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) return;
    if (event.code === "Space" && ["ready", "responding", "fixation"].includes(state)) {
      event.preventDefault();
      if (state === "ready") startTrial();
      else if (state === "responding" && method === "key") finishTrial(performance.now() - onset, "");
    } else if (state === "review" && ["c", "x", "r"].includes(event.key.toLowerCase())) {
      event.preventDefault(); const key = event.key.toLowerCase();
      if (key === "r") retry(); else score(key === "c");
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ["fixation", "responding"].includes(state)) {
      clearTiming(); lastVoiceTime = 0; state = "interrupted";
      stage.innerHTML = "<h2>Trial paused</h2><p>The page lost visibility. This attempt will not enter the timing summary.</p>";
      stage.append(button("priming-resume", "Retry this trial", retry));
    }
  });
  window.addEventListener("pagehide", () => { clearTiming(); stopMicrophone(); });
  window.addEventListener("beforeunload", event => {
    if (rows.length && state !== "setup") { event.preventDefault(); event.returnValue = ""; }
  });
})();
