import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Exercise the real CLI, isolating only the external Git/network boundary.
// No fixture can push to GitHub or touch production.
test('automatic delivery publishes numeric data, live-checks it, and stops at failed gates', () => {
  for (const scenario of ['numeric', 'raced', 'writing', 'dirty', 'quotes-fail', 'concurrent', 'deployment-fail', 'page-mismatch', 'date-mismatch']) {
    const root = mkdtempSync(join(tmpdir(), 'wiki-auto-test-'));
    try {
      for (const d of ['tools', 'bin', 'node_modules', '.cache', '.amp/detector']) mkdirSync(join(root, d), { recursive: true });
      copyFileSync(new URL('./auto-update.mjs', import.meta.url), join(root, 'tools/auto-update.mjs'));
      copyFileSync(new URL('./update-measurements.mjs', import.meta.url), join(root, 'tools/update-measurements.mjs'));
      writeFileSync(join(root, '.amp/detector/webhook-url'), 'https://private.invalid');
      const executable = (file, body) => writeFileSync(join(root, 'bin', file), '#!/usr/bin/env node\n' + body, { mode: 0o755 });
      executable('git', `
        const fs=require('node:fs'),p=require('node:path'),a=process.argv.slice(2),root=process.env.FIXTURE_ROOT;
        fs.appendFileSync(p.join(root,'git.log'),a.join(' ')+'\\n');
        const build={main:'main-oldbuild.js'};
        if(a[0]==='status') console.log(process.env.SCENARIO==='dirty'?' M user-work':'' );
        if(a[0]==='show') console.log(JSON.stringify(a[1].endsWith('builds.json')?[{...build,status:'reviewed'}]:process.env.SCENARIO==='concurrent'&&fs.existsSync(p.join(root,'rebased'))?{main:'main-othersha.js'}:build));
        if(a[0]==='rebase')fs.writeFileSync(p.join(root,'rebased'),'yes');
        if(a[0]==='rev-parse') console.log(a[1]==='HEAD'||fs.existsSync(p.join(root,'pushed'))?'b'.repeat(40):'a'.repeat(40));
        if(a[0]==='push') fs.writeFileSync(p.join(root,'pushed'),'yes');
        if(a[0]==='worktree'&&a[1]==='remove') {
          if(['node_modules','.cache'].some(n=>fs.existsSync(p.join(a[2],n))))process.exit(1);
          fs.rmSync(a[2],{recursive:true});
        }
        if(a[0]==='worktree'&&a[1]==='add') {
          const dir=a[3];for(const d of ['tools/detector','pages','dist','data'])fs.mkdirSync(p.join(dir,d),{recursive:true});
          fs.writeFileSync(p.join(dir,'data/build.json'),JSON.stringify({main:process.env.SCENARIO==='raced'?'main-later222.js':'main-newbuild.js'}));
          fs.writeFileSync(p.join(dir,'dist/stats.md'),'Source page: https://www.tibodog.wiki/stats · Wiki updated 7 Nov 2026, 10:00 UTC · Game version 132\\nDamage: 23\\nMeasured: 6 Nov 2026\\n| Wiki last updated | **7 Nov 2026, 10:00 UTC** |\\n');
          fs.writeFileSync(p.join(dir,'tools/update.mjs'),"console.log('status: "+(process.env.SCENARIO==='writing'?'needs-review':'numeric')+"')");
          fs.writeFileSync(p.join(dir,'build.mjs'),"console.log('built')");
          fs.writeFileSync(p.join(dir,'check-middleware.mjs'),"console.log('middleware OK')");
          fs.writeFileSync(p.join(dir,'tools/check-quotes.mjs'),"console.log('quotes');process.exit("+(process.env.SCENARIO==='quotes-fail'?1:0)+")");
          fs.writeFileSync(p.join(dir,'tools/gate.test.mjs'),"import{test}from'node:test';test('fixture',()=>{})");
        }
      `);
      executable('gh', `console.log(JSON.stringify({statuses:[{context:'Vercel',state:process.env.SCENARIO==='deployment-fail'?'failure':'success',target_url:'https://vercel.com/pcstyle/tibodog-wiki/deployment'}]}));`);
      writeFileSync(join(root, 'request.mjs'), `globalThis.fetch=async(url)=>{
        if(String(url).startsWith('https://tibo.dog/'))return new Response('<script src="/assets/main-newbuild.js"></script>');
        if(String(url).includes('/api/index.json'))return Response.json({meta:{wiki:{commit:'bbbbbbb'},build:{main:process.env.SCENARIO==='raced'?'main-later222.js':'main-newbuild.js'}}});
        if(String(url).includes('/stats.md'))return new Response('Source page: https://www.tibodog.wiki/stats · Wiki updated 7 Nov 2026, 10:03 UTC · Game version 132\\n'+(process.env.SCENARIO==='page-mismatch'?'Damage: 14\\n':'Damage: 23\\n')+(process.env.SCENARIO==='date-mismatch'?'Measured: 7 Nov 2026\\n':'Measured: 6 Nov 2026\\n')+'| Wiki last updated | **7 Nov 2026, 10:03 UTC** |\\n');
        return new Response('reviewed');
      };`);
      const result = spawnSync(process.execPath, ['tools/auto-update.mjs', '--ship'], {
        cwd: root, encoding: 'utf8', timeout: 15000,
        env: { ...process.env, TIBO_MEASUREMENTS_DIR: join(root, 'measurements'), FIXTURE_ROOT: root, SCENARIO: scenario, NODE_OPTIONS: `--import=${join(root, 'request.mjs')}`, PATH: `${root}/bin:${process.env.PATH}` },
      });
      const records = readdirSync(join(root, 'measurements')).filter((f) => f.endsWith('.json') && f !== 'report.json').map((f) => JSON.parse(readFileSync(join(root, 'measurements', f))));
      assert.equal(records.length, 1);
      const measurement = records[0];
      assert.equal(measurement.provenance, 'execution');
      assert.equal(measurement.status, ['numeric', 'raced'].includes(scenario) ? 'complete' : scenario === 'writing' ? 'needs-review' : 'failed');
      assert.ok(measurement.durationMs >= 0);
      assert.ok(measurement.stages.length > 0);
      if (scenario === 'quotes-fail') assert.ok(measurement.stages.some((s) => s.name === 'node:tools/check-quotes.mjs' && s.status === 'failed'));
      if (['numeric', 'raced'].includes(scenario)) assert.ok(measurement.stages.some((s) => s.name === 'all-published-pages' && s.status === 'passed'));
      if (['numeric', 'raced'].includes(scenario)) {
        assert.equal(result.status, 0, result.stderr);
        const receipt = JSON.parse(readFileSync(join(root, '.amp/detector/automatic-receipt.json')));
        assert.equal(receipt.main, scenario === 'raced' ? 'main-later222.js' : 'main-newbuild.js');
        assert.equal(receipt.sha, 'b'.repeat(40));
        assert.equal(receipt.pages, 1);
      } else {
        assert.equal(result.status, scenario === 'writing' ? 20 : 1, result.stdout + result.stderr);
        assert.equal(existsSync(join(root, '.amp/detector/automatic-receipt.json')), false);
      }
      assert.equal(existsSync(join(root, 'pushed')), ['numeric', 'raced', 'deployment-fail', 'page-mismatch', 'date-mismatch'].includes(scenario));
      assert.equal(existsSync(join(root, '.amp/detector/automatic.lock')), false);
      assert.equal(existsSync(join(root, 'node_modules')), true);
      assert.equal(existsSync(join(root, '.cache')), true);
      // The CLI intentionally preserves failed worktrees; dispose only these fixtures.
      const log = readFileSync(join(root, 'git.log'), 'utf8');
      const worktree = log.match(/^worktree add --detach (.+) origin\/main$/m)?.[1];
      if (worktree) rmSync(worktree, { recursive: true, force: true });
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});
