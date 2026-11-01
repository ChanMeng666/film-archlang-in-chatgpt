import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { DURATION_FRAMES, FPS, H, W } from "./time";

export const Root: React.FC = () => <Composition id="film" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={W} height={H} />;
