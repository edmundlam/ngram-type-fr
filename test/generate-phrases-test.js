// Sanity check for apostrophe-aware phrase generation (no framework needed).
// Run: node test/generate-phrases-test.js
global.window = {};
global.Vue = function () {};
eval(require('fs').readFileSync(__dirname + '/../app.js', 'utf8'));

var methods = ngramTypeConfig.methods;
var self = {
    data: { source: 'bigrams', bigrams: {} },
    bigrams: ["l'", "e ", "a "],
    deepCopy: function (x) { return x.slice(); },
    shuffle: function (x) { return x; }, // identity for determinism
};

// Apostrophe ngrams must glue to their neighbours instead of "l' e  a ".
var phrases = methods.generatePhrases.call(self, 3, 1);
var assert = require('assert');
assert.strictEqual(phrases[0], "l'e  a ", phrases[0]);

// Repetition still repeats each sub-phrase.
var phrases = methods.generatePhrases.call(self, 3, 2);
assert.strictEqual(phrases[0], "l'e  a  l'e  a ", phrases[0]);

// An apostrophe starting an ngram merges with the preceding word's apostrophe.
self.bigrams = ["aujourd'hui", "'a", "e "];
var phrases = methods.generatePhrases.call(self, 3, 1);
assert.strictEqual(phrases[0], "aujourd'hui'a e ", phrases[0]);

console.log('OK: generatePhrases handles apostrophes');
