#!/bin/sh
# Rebuild the soundtrack: cues from the picture, the GS layer, then the sampled score.
set -e
ENGINE=../AI_MUSIC_CREATOR
npx tsx scripts/dump-cues.ts
mkdir -p audio/work/stems
cp "$ENGINE"/engine/compose_kit.py "$ENGINE"/engine/render.c "$ENGINE"/engine/tsf.h audio/work/
cd audio/work
[ -f GeneralUser-GS.sf2 ] || cat ../../"$ENGINE"/sound_library/GeneralUser-GS/GeneralUser-GS.sf2.part_* > GeneralUser-GS.sf2
[ -f render.exe ] || gcc -O2 -o render render.c -lm
rm -f events_ch*.txt
python ../gs_layer.py
TOT=$(python -c "import json;print(json.load(open('mix.json'))['total'])")
for f in events_ch*.txt; do c=$(echo "$f" | sed 's/events_ch\([0-9]*\).txt/\1/'); ./render GeneralUser-GS.sf2 "$f" "stems/ch$c.raw" "$TOT"; done
cd ../..
python audio/score.py
