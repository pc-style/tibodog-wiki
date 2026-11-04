import { utc } from '../lib/data.mjs';

const duration = (minutes) => {
  const n = Math.round(minutes);
  if (n < 1) return 'under 1 min';
  return n < 60 ? `${n} min` : `${Math.floor(n / 60)} h${n % 60 ? ` ${n % 60} min` : ''}`;
};

export function updateStats(builds) {
  if (!builds.length) return '';
  const dates = builds.map((b) => b.seen).sort();
  // Include quiet days, not just days with an update. First and last days may be partial.
  const days = 1 + (Date.parse(dates.at(-1)) - Date.parse(dates[0])) / 86400000;
  const daily = builds.length / days;
  const number = (n) => n.toLocaleString('en-GB', { maximumFractionDigits: 1 });
  return `## Update frequency\n\n` +
    `**${number(daily)} updates/day** · **${number(daily * 7)} updates/week** · **1 update every ${duration(1440 / daily)}**\n\n` +
    `Based on ${builds.length} builds tracked over ${days} UTC calendar day${days === 1 ? '' : 's'} (${utc(dates[0])}–${utc(dates.at(-1))}). Weekly rate is an estimate.\n\n`;
}
