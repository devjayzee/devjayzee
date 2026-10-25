// Renders the profile's activity card (dark and light) from the GitHub
// contribution calendar. Runs in GitHub Actions with the workflow's token;
// `--mock` renders from generated data for a local preview.
//
//   node .github/scripts/activity.mjs <out-dir> [--mock]
//
// The calendar includes private contributions because the profile shares
// their counts. No dependencies: Node 20+ (global fetch).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LOGIN = "devjayzee";
const OUT = process.argv[2] ?? "out";
const MOCK = process.argv.includes("--mock");

// JetBrains Mono 400 and 700, printable-ASCII subsets (SIL Open Font License 1.1).
const JBM_400 = "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";
const JBM_700 = "d09GMgABAAAAABLAABAAAAAAJYwAABJhAAI2BAAAAAAAAAAAAAAAAAAAAAAAAAAAGlIbIBwqBmA/U1RBVEwAgUYRCAq5cKtsATYCJAODGAuBTgAEIAWEaAcgDAcbohyzItg4AAjK9o0i2DiCGmAH+C8TtCOM/a4gXKLIQsOMFapZdpPOoglTaEK9E/Plfrs6Hm+FAuKVm5s4xZZbeADfoRkhySw8j/vxO3d7X1STSXJT8EjEM8k0402s0Wgkm/+vrvz7ZC+9O5NqwQHECrDOsaTJKMAgl/G0AcIPgO3i8LTNf9i3aDPAOPLuoEcdnSaIIK0o9s5Fmatyv1P9kS37+1HtH5F696AFKnEnOKMlA/VezO06mV6oeWaO6m+HDmtODGhzov5fMfX//Vxpfw6z5bTsGLSs+nkBXqLj7DGlnENSBZI3lZVV2RQA0iuwJJIV3pCrkLZTovLULPxMYhgAauXUD8wrVttGyPVqbQSbeWcw2GuwPD/S32ZBC+vGCMCZWzIFEYYiMdwpEiMpEqMpEmMpEuMpEpPwiZoCpmZgUXOh1HwcJwJwZJgqpMLiykYKSAEYg8LCLJmgSdaxbZjsW5ymBJLAylIe9ZhcoM5WhQAqLieVbpBIAQo4AI/fBWg+3FL5ALhKTXvp//53o/9KHPcToWJVBoTLlbdhKwbg3UPR+srI6CIo848z24gbEFKydSNim/UQQLVm9MuHRsLIJk4UAFaAHhyZPpXDZ878bZJNKzPxSbXyiYgaN+necC+dk4VjEpBp41fnxUyU2QHzPJc9NLVpnmSXf0hBIgNIQ5YN+fhaCyUnLY8ufi4GRhpecjYyOjiFdq3aqPhY6Fl1cggy6WbWgYQYww0Aw1ev3kNs+5fbqfcQKwnOUZUlMNq7pJt214QecGSqGaZ9qj2SMU/FxAvotIsr4PQFebUmKozWbyfCjxyiUrHiVilbfzLbhqYQBi0/W3ehwZkEyAPE7BYIGNoYfRshAvibY+siBNtQkpSq8RUlqa/UK7XCBx7+6SvqOM44/n6F+IHYAilrrXP9AkNdGI0CLzxoys3cqE7zQPd4HnLzN4xNbADir1vlbyiiYxd+pfgoX4xby7lXkmLp68cuKV2vfMHEN4zEawyhvB4YCnJybsSmKipohfGADT2v6EvF2cowYaqJGkq1QKUKCfeDQnCYD6bxYQisrde6GkJO2bWmvSd23JBHesqn8o72jay1eO/Bl4zq33hbCHr7Nt2CWSZWDc1dWNk4/eCUpyaxylHd+BJR9ANYa+tnZa2MvRKbJsYwwlx0WuBCFUqKtUmjG+I43zIOsMkAcnrJamJa6AIOtpu4/h4MvrOMDNwwse0t8RHuyE+Ghkva4OveoPXb0uMhN4WHWY2hTnuL7bjBD/Vms3G3vc6rTJYzWUNhSmxvKLsrUsWOKmwpXBkpxWMFMpXzemBUdGr8ucYiomWDeBfwRJMV2kTknFRABhCNmSYIjLEFXUP3H0uYiT5HcgA7VbAbTKETpow6SibRA1RIuK5D3QFQ9jtGoeQiorUBEGqstOq9iH/vrcyw0WzvOiOFmhCLGH05j/J7kQ6gKGxCRc+sSWOK6o/kVvWWBDmdk4rvKXsOswGQRVZPowBsO1zNGoNN2zqrlgMcGAhFPbEPi2C39lRH0s4tyKWnPaEiRPkI3ippwVDR7dVURm9X6qhIL7O0WmqfRaHZg3EVslkJzRUG7L4lb4XT5KGwiaHyA6iQnLhKXiOn0F3kdWo80Z5bj9tjz6NTwTwhX3ZS9Gy0iA2FSS6eKUHxv/dpHdK+d2yBPKcq5Bw2KcqeXygXo9tVpSK7uQMU2qvY8d4dfGFZZBrUSkik9jEkMdNsbmCt4w0vJpS8xezoVw7crwh5bQN4kfffb8UTsoLi8kb6EkFi/xeDK2Oh8+W/bV7ec1atzkXfWn5kK57ljfiygbXd5UOKJ4fuI2+1Mayrm43Gno9DfV2IWj5v+nTBqjTmSoA9/hV3+p+7OsvDXxOct8/OP667bkePRYgoPMw6bvT/T/Q2f7r7Q9uvtT8OXpYvbznZZ0P0ZvAxo1dpJzOfDCXVS2HvaM/zzNZzPLs1Vso8/uju9lrQs8rK3xz9wap3tVCCCxJj/YNO4Mp+hHu85AnbZrh99FNpwKj8buC6LcgeRImkQeELdr9tyc1QmTztbQ45BYRtuNsJkVeuqeFkW6V3dozjfJngXl2Inpyf6BaAXfUc8rXHLVbPXCdfNIjvVX1CTDHUiS1OvGx/kXddzyZsk604vE22Y8vTpP1aOn6rD/H65x/dV2zYNobAz7r85KUZHSEw6adyup7miQDtKemaNmy09btZk4y6LzPIWuhYHRpfuaX8jSF0RofNJhqvQyI0fB0/TcoGiG2W32NN9n6LOtHC+07L4i1iONl65lZdt2tcp7qnDtqRLWzeH7pn2e9ox379f1QMRFdE451PpP9XxEUn4Cev3Giqrd1gehQYMx9FJ3rcLFita2TlSG1NTDNfwu8II9r+3gj3GxT9gRsJ9iD76PS9SA9gQKowxvPJxTivK4yp1CGM34VPYkEUHUIl6DCKhtBJGd8fwoA+s6KLc4VB1WalMBTn6doG2jn/sTdj/3HagSdzT0L4SEm85B1hAlgyz6T1T7LSDAYHNOK8F9XtiP9zj5zvC2HAmCHIT5GJDCF7SgZak8f/P5689v3LAOt1Ztd4mOBeZLPf5x6+Od2YHdk1CgwZotE9RZm6uuPmidnDUqcM9GaIECcNeJkTqi+vXqmoWDmGf3kiM/QpkjuUP7QmwvV7Bno8SihUkM4d4XwKNJmzLxgZea7s1rrWgfpenjNW5FqznQ1BAEOqEMbxycVyji+EqdRBd8kkKPhaEygHFWNsFGVjYlQFjJlftXGusEeBi4Ixrna4ZHoY+w7FvsWGwZnFxJI358o8VS+b3y0T4HxfIavK9frlAjmvmz/61K/FWBgVYFMIMoUJUK3+ZnypjbKFPrlGk3jnCDo3WeutOxJl349iD7CjgAbpEyxB+waCJkV4nMep5OvH7EXOwvaUVcxtC7FU0Yk4aCPgfpTV0ULZF3UVuwrb+u1iYWcMBd+HHk3/l340BGAoNpoOrpmEMD7C0mLQ5JrgSBpcuHdlT+LCno1mHm+9eTCembx3BbTpVuLw6qaa2q1bWNJNwtUId7VGat2StblmU8tqzLQyw77kmY+QSPnIFsEl0ueHHg7Mtd1z/Dd+82/H2++Zetj3/Ohc6PnjuQLB78d7nwffQz3v9qb+e7mUIYFenv5vz9uvQTCPNPxQlb5xhPwDKw1+gKzfa7DG3IFpRpOI1mw3jRcYx9q6guke19CYb5tgu1dd28GWs2H8IOVCQ6MBtEIKswF/qCIyniHOZe+pfAg3GxT2QMp/0hdITcaYbmwGczMZHnQG9QD6fkT8mTM4/yrDE9GsNqIlyUROobPoaYSZbCGy2oQTgv+g+p6U76Q/kLJz2Lwye885IjMeqdi+OMbUoDOohnmxBVRI1cvm+WQzMp6D/crQxJsSsDcKxrktotjEetW4Y6uiit/O4RD8wk9IeHn0dOq0XdPlNF+VvLzkhWLrm6k3R8HpxfA1LWcozaRQ+c24SYc7ulP+mO8gO8p5by7PChMUe8Ln2yphalCfAOVczIdxY0Zc0v8J11UoTHql1RdrixDtCJtBV2MeYBh4DL8hVb108wCwLqaPI07W7MV0a1bPyGAIWDLEnHv/u3PXQTeWH97/qfszsItjgWkW9r13pmhNVXVV16cARgnpCkl0bjOVqd5uqXuczoVRoV52TfLy8sniovmKy1svryCKixMVlwMjZTwihw4XqEIJIGdKzgskxBOnCSjeOMLaT7GDCGuIPYUNA8OikXkX7uI7KaV2WlGeC8boKXSnf37R49StuCnFn9+dsikIP37rbgh/XOgmgvtHyQWdlOFItdlr9pq8wYS/aW81O8JkadkeUFQg6WjEVNVE6Y8UKv3N6spd1+JQxzq3VmfsdQQp7QlrtoIg31JPgZNVFWVOFeRf327QW+KeKAibPW7jppOpkwuTC2+m3tyEoadSAIYiI+mgi3CyeUyGhu0kXMGxNHh/ibwrbJzfiMgv7QiZdi6SQdhODtMsojxlEQVSilCLH7GIIBWluEAFMy09TvJuhk0IKcjkAoWeZQMNj5bfDc07Dky8zONdjDkPzN8NPVJ+qPPUjosa3sUdvlPgukXD6y/lXwmWDG+UYoqN0uGukn0FK5hSVaqi5I2pWhUtCWBI3cvmpR7RX+yh1oQmtlfFsAuIALmA1Ybo85XKqiq0+RlgA0fykdVH5vfdMHoifjYJzGOffvYTzdSCjjLZD3EIoBT0xLgaZRDldshwxaRec/oEkgINkDqM8jukk6wDGDbC5LOGMVvqyhOlsTOplx9qihMpP1/K74ig4MBR5XLJ8TnqEuXl64hrQQsUHOvJdRFsDQNzsdSIA6tZuWc85+hCikx6M+Q9ugYTe0B33K8OjKcADGmTIlFSi9WlPr6laPZdu12MV7cInVxGAFeLInGBLsLFVXyhk1wuKeR/zGAhP/hNlPjgs+H/AwCGNBEm3yuSazs0NX0Ic7qh2UKn+5vrzzKSiKlO2Sltn4zGo9gztPrLpcMcvFrlEfPYzh6GUtnN4Dh5EqUbrx7hSi6rpz0LbpRgksB1SxpROCHQ6hMiUUKH1g78fEtR3ogYGlesbQAMwbUwXNdcey04eYWZc+VuDoAPttDJFFpLC41CpjcfPcIEPILgHJixpJH8Y0PDpWjvbRX9IxmsflUYmpmacUvR99WOykpHdVUNXjUnWgMee4/0dw2yTKUtoSeHDutimLBLvh1p87LvbFVeBCeqMZ4deNjVJpn5/Pkn/y0s3HvziLyYEpEVj0g+XsUd+Q+Xafo1ZQ//mZavfiRZTooX9948WFT471PPvzVz9ao/m2q05dkap34DFTXLNpe/9vGAa6B6uY2Q5k7tTEfpa+eWYQ4IE4Wf3rone8GZingTvflVfzZyuvG6F44t+wznDyX9pRO3ubS0hHIZp8VdmtvAwMjkw04NLY4vK2kJp/bhie7S+aThvG/52HUvgCeTPAcMmyjQ6aYIfWRwhB5phM6TYaOjmaccRBt2b4MWBEa1Kl9p0gihBbCvHk0DUzKN1p/YBC0ITRqlSqoFz3Tb7gZ0UMlzNMNGMnS+cYw2MjhCG2uCTlNgkwPmgfsSt5YMLjyzMAgOJKpFya1gdmNamgaGQI9cUjid+igFem9bd+Peyb1rb5QVL/iDvcHD53eeX3sYrGvs8+f3x4GLIL928K1tn75vyBmJt+bvE+9ty49FgYNoSKheKLg5dQ/0+/L3/rz/NQp1xfb0Gz9RdPW0F/zg+7alxfTi0o6eAVhnBpcGF3+zawN67mDtfl78qqvGm2oPDD36BgHWLgRe3BKauPn9gPW/WWzWyprb1M9ltm2lbNNGzdtNOvncXW1hF2oBbr91/+jN+4faPh+6rrT06aHOz0F28rF9tOrPkVo0Ypl4xqVS6wCjlsTI58sEZiOQ8T9RSWxqiaz4JNaChk9sEB+rgF/xYpWs6kWguLt1t1K9u9Xeiu8mlB7LgGh7XHNXl6vq66arWRKF3ThgxHctYV3V/GbVRnwNrR7HKSxne7jL3tEd9Kq6ctgNfzOSLWV1dWUtA7Ri8BVUDwQ8HbjcufLCNzXWJoShc7YIRB4a08JNl6Dy0hJWbXHJdMf0E5zwWPSFvvMEXabUe0KV1eVTj6qxyo55R4fvpt5u3wr8Yu9GRNyNPV8XRX9h9uz4LFmxNADYsr3GaRR0Z9iBZT5xmIEdPpDeSMFlkbwSUAl6C7YlH88fziuslPKQa9SRXNEekAAqw8p5N+dPj5H5215nfwX4/OH2bQD81PTapYbq0MOQaMYAQMDP172qtYP8vwdmzR/EYdVHaz5Wz0hDz8MSTdWqikEvXmtgoljHH7p6m1QoZsZjbFXbHFpjiK2wKC8M95FVJxxMr9E2DShMFOwRtmRUuESRjr3ilFcteC+ja6qURdS6weCY3e+guRjh7PQNgE/YNh0hS3FMteD7e/AJ3PjrGkiAYRK5DJHlOyU7dylnrpONWBAAjwHjZcIwDy0ztNK/LGGBj5alTEjRsiaGRLSsmXFxLR3EgoyvQwJwljt75NH1kTZq6Q8528QaeY6jT78xAyJ6haXVQDDbWA0HSwQl3SmWJu9c1S8iaXBVoz5JfZJFi/WJbiVAwygzJC2sbwC00kQ7ltbPbCvAwNArAvVjhnSjC+iTwODU7rzAe+DNkknyvGpcDwRdYkVMSKcMVEjVTcPshM4CJOECLZXIao8afp3m06ZdaCgBT0j9kTWITjsrjm5JqbdnVzMVA7egtyRt3tYvLiLAZscGfknZfNgyMwQCINS/L+bojnUBAAAA";

const THEMES = {
  dark: {
    bg: "#16130f", line: "#37322d", ink: "#f2f0ec", muted: "#b5b0aa", faint: "#8d8883",
    empty: "#241f1a", accent: "#7ee59d", ledger: "#fcbe54", messaging: "#71dcd6",
  },
  light: {
    bg: "#fbf8f4", line: "#dcd7cf", ink: "#1a1510", muted: "#5d5750", faint: "#867f77",
    empty: "#ece7e0", accent: "#146d34", ledger: "#9a5500", messaging: "#00696a",
  },
};
const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];
const MIX = [0, 0.3, 0.52, 0.76, 1];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel weekday } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": LOGIN },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user.contributionsCollection.contributionCalendar;
}

function mockCalendar() {
  // Deterministic pseudo-random data, a year back from a fixed date.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const end = new Date(Date.UTC(2026, 9, 25));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364 - start.getUTCDay());
  const weeks = [];
  let total = 0;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === 0) weeks.push({ contributionDays: [] });
    const busy = d.getUTCMonth() === 7 ? 3 : 1;
    const c = rnd() < 0.18 ? 0 : Math.floor(rnd() * 14 * busy);
    total += c;
    const lvl = c === 0 ? 0 : c < 4 ? 1 : c < 8 ? 2 : c < 13 ? 3 : 4;
    weeks.at(-1).contributionDays.push({
      date: d.toISOString().slice(0, 10), contributionCount: c, contributionLevel: LEVELS[lvl], weekday: d.getUTCDay(),
    });
  }
  return { totalContributions: total, weeks };
}

function streaks(days) {
  let longest = 0, run = 0, longestEnd = null;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    if (run > longest) { longest = run; longestEnd = d.date; }
  }
  // Current streak: up to today, or to yesterday when today has nothing yet.
  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i -= 1;
  let current = 0;
  for (; i >= 0 && days[i].contributionCount > 0; i -= 1) current += 1;
  return { current, longest, longestEnd };
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) =>
  "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => n.toLocaleString("en-US");
const plural = (n, w) => `${fmt(n)} ${w}${n === 1 ? "" : "s"}`;
const niceDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function render(cal, themeName) {
  const th = THEMES[themeName];
  const W = 960, H = 232;
  const cell = 11, pitch = 15, gx = 82, gy = 92;
  const days = cal.weeks.flatMap((w) => w.contributionDays);
  const s = streaks(days);
  const first = days[0]?.date, last = days.at(-1)?.date;
  const ramp = LEVELS.map((_, i) => (i === 0 ? th.empty : mix(th.empty, th.accent, MIX[i])));

  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">`);
  o.push(`<title id="t">GitHub activity for ${LOGIN}</title>`);
  o.push(`<desc id="d">${esc(plural(cal.totalContributions, "contribution"))} from ${esc(niceDate(first))} to ${esc(niceDate(last))}, private ones included. Current streak ${esc(plural(s.current, "day"))}; longest streak in the period ${esc(plural(s.longest, "day"))}.</desc>`);
  o.push(`<style>@font-face{font-family:"JBM";src:url(data:font/woff2;base64,${JBM_400}) format("woff2");font-weight:400}`);
  o.push(`@font-face{font-family:"JBM";src:url(data:font/woff2;base64,${JBM_700}) format("woff2");font-weight:700}`);
  o.push(`text{font-family:"JBM",ui-monospace,Menlo,Consolas,monospace}</style>`);
  o.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="${th.bg}" stroke="${th.line}"/>`);

  // headline numbers
  o.push(`<text x="44" y="56" font-size="30" font-weight="700" fill="${th.ink}">${esc(fmt(cal.totalContributions))}</text>`);
  const totalW = String(fmt(cal.totalContributions)).length * 18 + 12;
  o.push(`<text x="${44 + totalW}" y="56" font-size="14" fill="${th.muted}">contributions in the last year</text>`);
  const stat = (x, label, value, color) => {
    o.push(`<text x="${x}" y="38" font-size="12" fill="${th.faint}">${esc(label)}</text>`);
    o.push(`<text x="${x}" y="58" font-size="18" font-weight="700" fill="${color}">${esc(value)}</text>`);
  };
  stat(610, "Current streak", plural(s.current, "day"), th.ledger);
  stat(780, "Longest streak", plural(s.longest, "day"), th.messaging);

  // month labels where a new month starts
  const starts = [];
  cal.weeks.forEach((w, wi) => {
    const d = w.contributionDays[0];
    if (!d) return;
    const m = Number(d.date.slice(5, 7)) - 1;
    if (!starts.length || starts.at(-1).m !== m) starts.push({ wi, m });
  });
  starts
    .filter((st, i) => (starts[i + 1] ? starts[i + 1].wi - st.wi >= 3 : cal.weeks.length - st.wi >= 3))
    .forEach(({ wi, m }) =>
      o.push(`<text x="${gx + wi * pitch}" y="${gy - 10}" font-size="11" fill="${th.faint}">${MONTHS[m]}</text>`));
  [["Mon", 1], ["Wed", 3], ["Fri", 5]].forEach(([l, r]) =>
    o.push(`<text x="44" y="${gy + r * pitch + 9}" font-size="11" fill="${th.faint}">${l}</text>`));

  // the grid
  cal.weeks.forEach((w, wi) => {
    for (const d of w.contributionDays) {
      const lvl = Math.max(0, LEVELS.indexOf(d.contributionLevel));
      o.push(`<rect x="${gx + wi * pitch}" y="${gy + d.weekday * pitch}" width="${cell}" height="${cell}" rx="2.5" fill="${ramp[lvl]}"><title>${esc(plural(d.contributionCount, "contribution"))} on ${esc(niceDate(d.date))}</title></rect>`);
    }
  });

  // footer: note and legend
  const fy = gy + 7 * pitch + 22;
  o.push(`<text x="44" y="${fy}" font-size="11" fill="${th.faint}">Includes private contributions · updated daily</text>`);
  const lx = W - 44 - (5 * pitch + 70);
  o.push(`<text x="${lx}" y="${fy}" font-size="11" fill="${th.faint}">Less</text>`);
  ramp.forEach((c, i) => o.push(`<rect x="${lx + 36 + i * pitch}" y="${fy - 10}" width="${cell}" height="${cell}" rx="2.5" fill="${c}"/>`));
  o.push(`<text x="${lx + 36 + 5 * pitch + 4}" y="${fy}" font-size="11" fill="${th.faint}">More</text>`);
  o.push(`</svg>`);
  return o.join("");
}

const cal = MOCK ? mockCalendar() : await fetchCalendar();
mkdirSync(OUT, { recursive: true });
for (const name of Object.keys(THEMES)) {
  const svg = render(cal, name);
  writeFileSync(join(OUT, `activity-${name}.svg`), svg);
  console.log(`activity-${name}.svg`, `${(svg.length / 1024).toFixed(1)} KB`);
}
console.log("total", cal.totalContributions, "streaks", JSON.stringify(streaks(cal.weeks.flatMap((w) => w.contributionDays))));
