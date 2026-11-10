import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

test('name extraction follows boot-owned or split language catalogue and retains English overrides', () => {
  const dir=mkdtempSync(join(tmpdir(),'wiki-i18n-'));
  try {
    const boot='boot-fixture1.js',main='main-fixture1.js',out=join(dir,'names.json');
    const catalogue='var languages=[{tag:`en`,endonym:`English`,englishName:`English`,dir:`ltr`},{tag:`fr`,endonym:`Français`,englishName:`French`,dir:`ltr`}];var content=`./i18n-fr-content-fixture1.js`;';
    const common='var content=`./i18n-en-content-fixture1.js`;var always=new Set([`content.boss.amusing.name`]);';
    writeFileSync(join(dir,'i18n-en-content-fixture1.js'),'export const messages={"content.weapon.peeler.name":["Peeler"],"content.boss.amusing.name":["amusing"]};');
    writeFileSync(join(dir,'i18n-fr-content-fixture1.js'),'export const messages={"content.weapon.peeler.name":["Éplucheur"],"content.boss.amusing.name":["Different"]};');
    const extract=()=>{execFileSync(process.execPath,['tools/i18n-names.mjs',dir,boot,main,out],{stdio:'pipe'});return JSON.parse(readFileSync(out));};
    writeFileSync(join(dir,boot),common+catalogue);
    const original=extract();
    assert.deepEqual(original.languages.map(l=>l.tag),['en','fr']);
    assert.equal(original.names.weapon.peeler.name.fr,'Éplucheur');
    assert.equal(original.names.boss.amusing.name.fr,'amusing');
    assert.deepEqual(original.fallback,['content.boss.amusing.name fr']);
    assert.deepEqual(original.names.weapon.peeler.cite,{chunk:'i18n-fr-content-fixture1.js',quote:'"content.weapon.peeler.name":["Éplucheur"]'});
    writeFileSync(join(dir,boot),'import "./language-ahead-fixture1.js";'+common);
    writeFileSync(join(dir,'language-ahead-fixture1.js'),catalogue);
    assert.deepEqual(extract(),original);
    writeFileSync(join(dir,'language-ahead-fixture1.js'),'var languages=[];');
    assert.throws(extract,/language list not found/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
