// Sanity checks for the EN/FR UI dictionary and language detection (no framework needed).
// Run: node test/i18n-test.js
var fs = require('fs');
var assert = require('assert');

eval(fs.readFileSync(__dirname + '/../i18n.js', 'utf8'));

// en and fr must define exactly the same keys.
var enKeys = Object.keys(I18N.en).sort();
var frKeys = Object.keys(I18N.fr).sort();
assert.ok(enKeys.length >= 30, 'dictionary looks truncated');
assert.deepStrictEqual(frKeys, enKeys, 'en/fr key sets differ');

// Every `t.<key>` used in the template must exist in both dictionaries.
var html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
var usedKeys = new Set((html.match(/\bt\.[a-z0-9_]+/gi) || []).map(function(m) { return m.slice(2); }));
assert.ok(usedKeys.size >= 30, 'template seems to not use the dictionary');
usedKeys.forEach(function(key) {
    assert.ok(key in I18N.en, 'missing en key: ' + key);
    assert.ok(key in I18N.fr, 'missing fr key: ' + key);
});

// Old hardcoded English labels must be gone from the template.
[
    '>Sounds<',
    'Correct Letter</label>',
    'Put the custom words here',
    'Suggest Improvements',
    'Re-type if failed',
].forEach(function(literal) {
    assert.ok(!html.includes(literal), 'hardcoded label still in template: ' + literal);
});

// Saved preference wins over browser language.
assert.strictEqual(detectUiLang('fr', 'en-US'), 'fr');
assert.strictEqual(detectUiLang('en', 'fr-FR'), 'en');

// French browser (incl. fr-CA) detects as French.
assert.strictEqual(detectUiLang(undefined, 'fr-CA'), 'fr');
assert.strictEqual(detectUiLang(null, 'fr'), 'fr');

// Anything else defaults to English.
assert.strictEqual(detectUiLang(undefined, 'en-US'), 'en');
assert.strictEqual(detectUiLang(null, 'de-DE'), 'en');
assert.strictEqual(detectUiLang(null, undefined), 'en');

console.log('OK: i18n dictionary and detection');
