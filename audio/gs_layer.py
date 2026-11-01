"""The sustained layer, written with the code-composer engine of AI_MUSIC_CREATOR (reaesteve, CC BY-NC-SA 4.0)
and rendered with GeneralUser GS (S. Christian Collins). Run from audio/work, where the engine is copied.
The engine is not redistributed here; only the music made with it is."""
import sys

sys.path[:0] = ['.', '..']
from compose_kit import *  # noqa: E402,F403
from song import BARS  # noqa: E402

channel(0, 'strings', 49, gain=0.5, reverb=0.4, hpf=110, haas=14)  # noqa: F405
channel(1, 'pad', 89, gain=0.4, reverb=0.4, hpf=140, haas=16)  # noqa: F405
channel(2, 'horns', 60, gain=0.4, pan=-0.1, reverb=0.4, hpf=120)  # noqa: F405
tempo([(0, 140, 100, 100)], intro=0.0, tail=4.0, seed=11)  # noqa: F405


def span(a, b):
    return [(BARS[i], 4) for i in range(a, b)]


# bars 2–6: a held pad under the piano
chords(1, bar(2), span(2, 11), vel=52, lo=52, hi=72, n=3)  # noqa: F405
expression(1, bar(2), bar(4), 30, 80)  # noqa: F405
# bars 7–10: strings rise into the drop
chords(0, bar(7), span(7, 11), vel=66)  # noqa: F405
expression(0, bar(7), bar(11), 35, 112)  # noqa: F405
# bars 11–17: full
chords(0, bar(11), span(11, 18), vel=74)  # noqa: F405
expression(0, bar(11), bar(11) + 1, 112, 92)  # noqa: F405
chords(1, bar(11), span(11, 18), vel=58, lo=52, hi=72, n=3)  # noqa: F405
chords(2, bar(13), span(13, 18), vel=56, lo=50, hi=67, n=3)  # noqa: F405
# bars 18–22: the edit, thinner
chords(1, bar(18), span(18, 23), vel=56, lo=52, hi=72, n=3)  # noqa: F405
chords(0, bar(20), span(20, 23), vel=62)  # noqa: F405
expression(0, bar(20), bar(23), 40, 84)  # noqa: F405
# bars 23–26: darker, then the turn
chords(0, bar(23), span(23, 27), vel=66)  # noqa: F405
expression(0, bar(23), bar(25), 76, 60)  # noqa: F405
expression(0, bar(25), bar(27), 60, 112)  # noqa: F405
chords(2, bar(25), span(25, 27), vel=60, lo=50, hi=67, n=3)  # noqa: F405
# bars 27–30: the lift
chords(0, bar(27), span(27, 31), vel=74)  # noqa: F405
chords(1, bar(27), span(27, 31), vel=58, lo=52, hi=72, n=3)  # noqa: F405
chords(2, bar(27), span(27, 31), vel=60, lo=50, hi=67, n=3)  # noqa: F405
# bars 31–35: the close, held on D
chords(0, bar(31), span(31, 34) + [('D', 8)], vel=72)  # noqa: F405
chords(1, bar(31), span(31, 34) + [('D', 8)], vel=56, lo=52, hi=72, n=3)  # noqa: F405
chords(2, bar(31), span(31, 34) + [('D', 8)], vel=58, lo=50, hi=67, n=3)  # noqa: F405
expression(0, bar(34), bar(35), 100, 45)  # noqa: F405
export(end_beat=bar(35))  # noqa: F405
