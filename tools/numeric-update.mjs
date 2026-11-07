// Only existing finite numeric values may flow through the unattended lane.
// Text, membership, schema and code structure changes are documentation/code tasks.
export function numericUpdate({ changes, same, numericSame, pending = [], prose = [] }) {
  const reasons = pending.map((b) => `unfinished review: ${b.main}`);
  if (!same?.identical && !numericSame?.identical) reasons.push('new or changed code, text, art or schema');
  for (const c of changes) {
    if (![c.old, c.new].every((v) => typeof v === 'number' && Number.isFinite(v))) {
      reasons.push(`text, entity or schema changed: ${c.path}`);
      continue;
    }
    // An authored guide is not a stat table. Never blindly substitute every "2"
    // with "3": it could describe another stat or a historical measurement.
    const id = c.path.match(/^registry\.[^.[]+\[([^\]]+)\]/)?.[1];
    for (const p of prose) {
      if (!id || p.path.endsWith(`/${id}.md`)) {
        const current = p.text.split(/^\*\*Measured\*\*/m)[0];
        const forms = [String(c.old), String(Number((c.old * 100).toFixed(8))) + '%'];
        if (forms.some((v) => new RegExp(`(^|[^\\w.])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w.])`).test(current))) {
          reasons.push(`refresh authored text: ${p.path} (${c.path})`);
        }
      }
    }
  }
  if (!same?.identical && !changes.length) reasons.push('changed code constants not represented in generated data');
  return { automatic: reasons.length === 0, reasons: [...new Set(reasons)] };
}
