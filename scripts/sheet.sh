#!/bin/sh
# sh scripts/sheet.sh out/s out/sheet.jpg 2 640
d=$1; o=$2; c=${3:-2}; w=${4:-640}; tmp="$d/.n"; rm -rf "$tmp"; mkdir -p "$tmp"; i=0
for f in $(ls "$d"/*.jpg | sort); do cp "$f" "$tmp/$(printf %03d $i).jpg"; i=$((i+1)); done
r=$(( (i + c - 1) / c ))
ffmpeg -y -v error -i "$tmp/%03d.jpg" -vf "scale=$w:-1,tile=${c}x$r" -frames:v 1 -update 1 "$o"; rm -rf "$tmp"
