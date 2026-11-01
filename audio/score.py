#!/usr/bin/env python3
"""The score: sampled instruments on the film's bar grid, the GS layer under them, and sound effects read
from data/cues.json. Seeded, so the same inputs give the same file.   python audio/score.py"""
import json, os, pathlib, sys
import numpy as np, soundfile as sf
import pyloudnorm as pyln
from scipy.ndimage import minimum_filter1d
from scipy.signal import butter, fftconvolve, sosfilt

sys.path.insert(0, os.path.dirname(__file__))
import samplers as S  # noqa: E402
from song import BARS, MOTIF_A, MOTIF_B, ROOT, VOICE  # noqa: E402

REPO = pathlib.Path(__file__).resolve().parents[1]
Q = json.load(open(REPO / 'data' / 'cues.json'))
SR, BEAT, BAR, DUR = S.SR, Q['beat'], Q['bar'], Q['duration']
N = int((DUR + 3) * SR)
STEMS = ('kick', 'drums', 'bass', 'keys', 'bells', 'sfx')
TR = {k: np.zeros((N, 2), np.float32) for k in STEMS}


def db(x): return 10 ** (x / 20)
def at(b, beat=0.0): return (b - 1) * BAR + beat * BEAT


def put(trk, x, t, gain=0.0, pan=0.0, hold=None, rel=.25):
    x = x / max(float(np.abs(x).max()), 1e-6)
    if hold is not None:
        n, r = int(hold * SR), int(rel * SR)
        x = x[:n + r].copy()
        if len(x) > n: x[n:n + r] *= np.linspace(1, 0, min(r, len(x) - n))[:, None]
    th = (pan + 1) * np.pi / 4
    x = x * np.array([np.cos(th), np.sin(th)], np.float32) * np.sqrt(2) * db(gain)
    i = int(round(t * SR))
    e = min(N, i + len(x))
    if 0 <= i < N: TR[trk][i:e] += x[:e - i]


# ── keys ──
def arp(b, gain=-8.0, vel=.45, steps=(0, 1, 2, 3, 4, 3, 2, 1), pan=-.1):
    v = VOICE[BARS[b]]
    for i, s in enumerate(steps):
        put('keys', S.PIANO.note(v[s] + 12, vel + (.08 if i % 4 == 0 else 0)), at(b, i * .5), gain, pan + .05 * s, hold=.8, rel=.5)


def stab(b, beat=0.0, gain=-5.0, vel=.65, hold=1.6):
    for m in VOICE[BARS[b]]: put('keys', S.PIANO.note(m + 12, vel), at(b, beat), gain - 3, -.1, hold=hold, rel=.7)


def tune(b, phrase, inst, gain, vel=.6, oct=0, pan=.15, hold=.9):
    for beat, m in phrase: put('bells', inst.note(m + 12 * oct, vel), at(b, beat), gain, pan, hold=hold, rel=1.0)


# ── rhythm ──
def bass(b, pattern=(0, 3, 6, 10), gain=-3.0, vel=.6):
    r = ROOT[BARS[b]]
    for i, s in enumerate(pattern):
        m = r + (12 if s == 6 and len(pattern) > 3 else 0)
        put('bass', S.BASS.note(m, vel), at(b, s * .25), gain, 0, hold=.42, rel=.12)


def bar_drums(b, kick, snare=(), side=(), hat=(), ohat=(), hv=.4, gain=0.0):
    for s in kick: put('kick', S.kick(.8 if s == 0 else .68), at(b, s * .25), -4 + gain)
    for s in snare: put('drums', S.snare(.75), at(b, s * .25), -6 + gain, .05)
    for s in side: put('drums', S.side(.55), at(b, s * .25), -11 + gain, .05)
    for s in hat: put('drums', S.hat(hv + (.14 if s % 4 == 0 else 0)), at(b, s * .25), -17 + gain - (0 if s % 4 == 0 else 2), .22)
    for s in ohat: put('drums', S.hat_open(.5), at(b, s * .25), -18 + gain, .22)


EIGHTS = range(0, 16, 2)
SIXTEENS = range(0, 16)
FULL = dict(kick=(0, 6, 8, 11), snare=(4, 12), hat=EIGHTS, ohat=(14,))
LIGHT = dict(kick=(0, 10), side=(4, 12), hat=EIGHTS)
PULSE = dict(kick=(0, 8), side=(12,), hat=SIXTEENS, hv=.28)


def rev_crash(t_end, sec=1.6, gain=-14.0):
    x = S.crash(.8)
    n = int(sec * SR)
    y = x[:n * 2][::-1][-n:].copy()
    y *= np.linspace(0, 1, len(y))[:, None] ** 2
    put('sfx', y, t_end - sec, gain)


# ── the song ──
put('keys', S.PIANO.note(74, .5), at(1), -9, hold=2, rel=1)
tune(1, MOTIF_A, S.PIANO, -9, .5, oct=0, pan=0, hold=1.2)
arp(2, -11, .4)
tune(2, MOTIF_B, S.PIANO, -9, .5, oct=0, pan=0, hold=1.2)
arp(3, -10, .42); tune(3, MOTIF_A, S.VIBES, -18, .6)
arp(4, -10, .42); bass(4, (0, 8), -6, .5)
for b in (5, 6):
    arp(b, -13, .42); bass(b, (0, 8, 10), -7); bar_drums(b, **LIGHT, gain=-6)
tune(5, MOTIF_A, S.VIBES, -19, .6); tune(6, MOTIF_B, S.VIBES, -19, .6)
for b in (7, 8, 9, 10):
    arp(b, -10, .46, steps=(0, 2, 4, 2, 1, 3, 4, 3)); bass(b, (0, 3, 8, 11), -5); bar_drums(b, **PULSE, gain=-3 + (b - 7))
for i in range(8): put('drums', S.snare(.3 + i * .06), at(10, 2 + i * .25), -19 + i * 1.3, .05)
rev_crash(at(11))
put('drums', S.crash(.85), at(11), -9, -.2)

for b in range(11, 18):
    stab(b, 0); stab(b, 2.5, -9, .5, 1.0); arp(b, -13, .4)
    bass(b, gain=-1); bar_drums(b, **FULL, gain=3)
tune(11, MOTIF_A, S.GLOCK, -13, .7, oct=1); tune(12, MOTIF_B, S.GLOCK, -13, .7, oct=1)
tune(13, MOTIF_A, S.GLOCK, -12, .7, oct=1); tune(14, MOTIF_B, S.GLOCK, -12, .7, oct=1)
put('drums', S.crash(.6), at(15), -14, .2)

for b in (18, 19):
    arp(b, -13, .42); bass(b, (0, 8), -8, .5)
bar_drums(19, kick=(0,), side=(12,), hat=EIGHTS, gain=-4)
tune(18, MOTIF_A, S.VIBES, -18, .6); tune(19, MOTIF_B, S.VIBES, -18, .6)
for b in (20, 21, 22):
    arp(b, -13, .44); bass(b, (0, 3, 8, 10), -7); bar_drums(b, **LIGHT, gain=-4)
tune(21, MOTIF_A, S.VIBES, -19, .6); tune(22, MOTIF_B, S.VIBES, -19, .6)

for b in (23, 24):
    arp(b, -11, .42, steps=(0, 2, 3, 4, 3, 2, 1, 2)); bass(b, (0, 8), -8, .5); bar_drums(b, kick=(0,), side=(12,), hat=(0, 4, 8, 12), gain=-5)
for b in (25, 26):
    arp(b, -10, .46); bass(b, (0, 3, 8, 11), -5); bar_drums(b, **PULSE, gain=-2)
for i in range(8): put('drums', S.tom(15, .35 + i * .05), at(26, 2 + i * .25), -18 + i, .1)
rev_crash(at(27))

put('drums', S.crash(.8), at(27), -10, .2)
for b in range(27, 31):
    stab(b, 0); stab(b, 2.5, -9, .5, 1.0); arp(b, -12, .42)
    bass(b, gain=-1); bar_drums(b, **FULL, gain=3)
tune(27, MOTIF_A, S.GLOCK, -12, .7, oct=1); tune(28, MOTIF_B, S.GLOCK, -12, .7, oct=1)
tune(29, MOTIF_A, S.GLOCK, -13, .65, oct=1); tune(30, MOTIF_B, S.GLOCK, -13, .65, oct=1)

put('drums', S.crash(.75), at(31), -11, -.1)
stab(31, 0, -4, .7, 2.2); bass(31, (0, 8), -3); bar_drums(31, kick=(0, 8), snare=(), hat=EIGHTS, gain=-4)
tune(31, MOTIF_A, S.GLOCK, -11, .7, oct=1)
stab(32, 0, -5, .6, 2.2); bass(32, (0, 8), -4); bar_drums(32, kick=(0,), hat=(0, 4, 8, 12), gain=-7)
tune(32, MOTIF_B, S.VIBES, -17, .6, oct=1)
stab(33, 0, -5, .6, 2.2); bass(33, (0,), -4)
# the last cadence: home, held and left to ring
stab(34, 0, -3, .72, 4.2); bass(34, (0,), -2, .65); put('kick', S.kick(.6), at(34), -9)
put('bells', S.GLOCK.note(98, .7), at(34), -12, 0, hold=3, rel=2); put('bells', S.VIBES.note(86, .6), at(34, .5), -12, .2, hold=3, rel=2)

# the cello: long notes where the piano stands alone, and under the last cadence
for b_, m, g in ((2, 49, -13), (3, 47, -13), (4, 43, -12), (18, 43, -15), (19, 50, -15), (31, 50, -11), (32, 43, -11), (33, 45, -11)):
    put('keys', S.CELLO.note(m + 12, .55), at(b_), g, -.15, hold=2.2, rel=.5)
put('keys', S.CELLO.note(50, .6), at(34), -10, -.15, hold=3.6, rel=1.2)

# ── sound effects, read from the picture ──
for t in Q['clicks']: put('sfx', S.ticksc(.5), t, -15, .1, hold=.1, rel=.05)
for i, t in enumerate(Q['typing']): put('sfx', S.tickrc(.3 + .1 * (i % 3)), t, -25, -.1 + .2 * ((i * 7) % 3) / 2, hold=.06, rel=.03)
for t in Q['sends']: put('sfx', S.snap(.6), t, -14)
PENT = [74, 76, 78, 81, 83, 86, 88, 90]
for t, m in zip(Q['checks'], PENT): put('bells', S.GLOCK.note(m + 12, .55), t, -13, -.2 + (m % 3) * .15, hold=.5, rel=.8)
for i, (k, t) in enumerate(Q['layers'].items()): put('bells', S.VIBES.note(PENT[i] + 12, .55), t, -16, -.25 + i * .07, hold=.6, rel=.9)
for i, m in enumerate((81, 86, 90)): put('bells', S.GLOCK.note(m + 12, .6), Q['morph'] + i * .1, -13, -.2 + .2 * i, hold=.5, rel=.8)
put('sfx', S.claves(.5), Q['tight'], -18)
put('bells', S.VIBES.note(90, .6), Q['verified'], -13, hold=.8, rel=1); put('bells', S.VIBES.note(93, .6), Q['verified'] + BEAT / 2, -13, hold=.8, rel=1)
put('bells', S.GLOCK.note(98, .55), Q['downloaded'], -14, hold=.5, rel=1)
for i, m in enumerate((74, 78, 81, 86)): put('bells', S.VIBES.note(m + 12, .55), Q['plate3d'] + i * BEAT / 2, -15, -.2 + .13 * i, hold=.6, rel=1)


# ── the GS layer, placed at zero ──
def gs():
    w = REPO / 'audio' / 'work'
    out = np.zeros((N, 2), np.float32)
    level = {0: -2.0, 1: -6.0, 2: -9.0}
    for ch, g in level.items():
        x = np.fromfile(w / 'stems' / f'ch{ch:02d}.raw', dtype=np.float32).reshape(-1, 2)
        n = min(N, len(x))
        out[:n] += x[:n] * db(g)
    return out


def make_ir(rt=1.9, pre=.02, seed=3):
    r = np.random.default_rng(seed)
    n = int(rt * 1.4 * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)).astype(np.float32) * np.exp(-6.9 * t / rt)[:, None]
    ir = sosfilt(butter(2, 5200, 'low', fs=SR, output='sos'), ir, axis=0)
    ir[:int(pre * SR)] = 0
    return (ir / np.sqrt((ir ** 2).sum())).astype(np.float32)


IR = make_ir()
def reverb(x): return np.stack([fftconvolve(x[:, c], IR[:, c])[:N] for c in range(2)], 1).astype(np.float32)


def follow(x, rel=.18):
    d = 48
    a = np.abs(x).max(1)
    a = a[:len(a) // d * d].reshape(-1, d).max(1)
    o = np.zeros_like(a)
    e, r = 0.0, np.exp(-1 / (rel * SR / d))
    for i, v in enumerate(a):
        e = v if v > e else e * r
        o[i] = e
    return np.interp(np.arange(N), np.arange(len(o)) * d + d / 2, o)


ke = follow(TR['kick'])
ke = np.clip(ke / max(ke.max(), 1e-6), 0, 1)
duck = (1 - .3 * ke ** .7)[:, None].astype(np.float32)
pads = gs()
SEND = {'keys': .28, 'bells': .42, 'drums': .1, 'sfx': .12, 'bass': 0, 'kick': .03}
LVL = {'kick': 5, 'drums': 6, 'bass': -3, 'keys': 0, 'bells': 6, 'sfx': 5}
mix = np.zeros((N, 2), np.float32)
wet = pads * .3 * duck
for k, x in TR.items():
    y = x * db(LVL[k]) * (duck if k in ('keys', 'bells', 'bass') else 1)
    mix += y
    wet += y * SEND[k]
mix += pads * duck + reverb(wet)
mix = sosfilt(butter(2, 30, 'high', fs=SR, output='sos'), mix, axis=0).astype(np.float32)
mix = mix[:int(round(DUR * SR))]
fade = np.ones(len(mix), np.float32)
f0 = len(mix) - int(1.6 * SR)
fade[f0:] = np.linspace(1, 0, len(mix) - f0) ** 1.6
mix *= fade[:, None]
meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -15.5).astype(np.float32)


def limiter(x, ceil=db(-2.0), look=int(.005 * SR), rel=.08):
    pk = np.abs(x).max(1)
    g = minimum_filter1d(np.minimum(1.0, ceil / np.maximum(pk, 1e-9)), size=look * 2 + 1, mode='nearest')
    r = np.exp(-1 / (rel * SR))
    out = np.empty_like(g)
    c = 1.0
    for i in range(len(g)):
        c = g[i] if g[i] < c else g[i] + (c - g[i]) * r
        out[i] = c
    k = int(.003 * SR)
    return x * np.convolve(out, np.ones(k) / k, mode='same')[:, None], float(out.min())


mix, gmin = limiter(mix)
sf.write(str(REPO / 'public' / 'soundtrack.wav'), mix, SR, subtype='PCM_24')
print('peak dBFS %.2f  LUFS %.2f  limiter min gain %.3f  length %.2f s' % (20 * np.log10(np.abs(mix).max()), meter.integrated_loudness(mix), gmin, len(mix) / SR))
ranges = [('hook', 1, 4), ('listing', 4, 7), ('work', 7, 11), ('drawn', 11, 15), ('checks', 15, 18), ('edit', 18, 23), ('sheet', 23, 27), ('playground', 27, 31), ('end', 31, 35)]
for name, a, b in ranges:
    x = mix[int(at(a) * SR):int(at(b) * SR)]
    print('%-11s RMS %6.1f dB' % (name, 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)))
