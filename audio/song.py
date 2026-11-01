"""The song's harmony, shared by the sampled score and the GeneralUser GS layer. D major, 100 BPM."""

# One chord per bar. The story sets the shape: open, pulse, drop, thin out for the edit, darken at
# the sheet that does not fit, lift at the Playground, resolve on the end card.
BARS = {
    1: 'D', 2: 'A', 3: 'Bm', 4: 'G', 5: 'D', 6: 'A',
    7: 'Bm', 8: 'G', 9: 'D', 10: 'A',
    11: 'D', 12: 'A', 13: 'Bm', 14: 'G', 15: 'D', 16: 'A', 17: 'Bm',
    18: 'G', 19: 'D', 20: 'A', 21: 'Bm', 22: 'G',
    23: 'Em', 24: 'Bm', 25: 'A', 26: 'A',
    27: 'D', 28: 'A', 29: 'Bm', 30: 'G',
    31: 'D', 32: 'G', 33: 'A', 34: 'D', 35: 'D',
}
VOICE = {
    'D': [50, 57, 62, 66, 69],
    'A': [49, 57, 61, 64, 69],
    'Bm': [47, 54, 59, 62, 66],
    'G': [43, 55, 59, 62, 67],
    'Em': [40, 55, 59, 64, 67],
}
ROOT = {'D': 38, 'A': 33, 'Bm': 35, 'G': 31, 'Em': 40}
# The tune: up to the home note, then a step back, as a compile goes out and returns.
MOTIF_A = [(0, 78), (1, 81), (2, 86), (3.5, 85)]
MOTIF_B = [(0, 83), (1.5, 81), (2, 78), (3, 76)]
