const assert = require("node:assert/strict");
require("./implicit-priming.js");
const { buildSchedule, summarize, GRAMMAR_ITEMS } = globalThis.MorphPriming;

for (const mode of ["prefix", "suffix", "both", "grammar"]) {
  for (const seed of [0, 1, 17, 42, 123456, 0xffffffff]) {
    const blocks = buildSchedule(mode, seed);
    assert.equal(blocks.length, mode === "both" ? 12 : 6);
    assert.deepEqual(blocks, buildSchedule(mode, seed), "Schedules must be reproducible");
    const counts = new Map();
    for (const block of blocks) {
      assert.equal(block.practice.length, 3);
      assert.equal(block.trials.length, 6);
      assert.equal(new Set(block.practice.map(item => item.cue)).size, 3);
      const sharedProperty = block.members.map(item => item.feature || item.affix);
      assert.equal(new Set(sharedProperty).size, block.condition === "shared" ? 1 : 3);
      if (mode === "grammar") {
        assert.deepEqual(block.members.map(item => item.lemma).sort(), ["buy", "eat", "go"]);
      }
      for (const item of block.trials) {
        const key = `${item.domain}|${item.cue}|${item.target}`;
        const entry = counts.get(key) || { shared: 0, mixed: 0 };
        entry[block.condition]++;
        counts.set(key, entry);
      }
    }
    assert.equal(counts.size, mode === "both" ? 18 : 9);
    for (const count of counts.values()) assert.deepEqual(count, { shared: 2, mixed: 2 });
  }
}
assert.throws(() => buildSchedule("unknown", 0));
assert.equal(GRAMMAR_ITEMS.length, 9);
assert.deepEqual(GRAMMAR_ITEMS.map(item => item.target),
  ["went", "ate", "bought", "go", "eat", "buy", "gone", "eaten", "bought"]);
for (const item of GRAMMAR_ITEMS) {
  assert.ok(item.frame.includes("___"));
  assert.equal(item.affix, "");
}
const row = { domain: "grammar", condition: "shared", phase: "measured", correct: true, reason: "" };
const summary = summarize([
  { ...row, rt_ms: 400 }, { ...row, rt_ms: 600 },
  { ...row, rt_ms: 100, reason: "too_fast" },
  { ...row, rt_ms: 300, correct: false },
  { ...row, rt_ms: null, correct: false, reason: "timeout" },
  { ...row, rt_ms: 450, correct: null, reason: "interrupted" },
  { ...row, rt_ms: 200, phase: "practice" },
  { ...row, condition: "mixed", rt_ms: 700 },
]);
assert.deepEqual(summary.find(item => item.domain === "grammar" && item.condition === "shared"),
  { domain: "grammar", condition: "shared", attempted: 6, correct: 3, errors: 2,
    excluded: 4, usable: 2, median: 500 });
assert.equal(summary.find(item => item.domain === "grammar" && item.condition === "mixed").median, 700);
console.log("Passed: balanced items and grammatical features, reproducible schedules, and timing exclusions.");
