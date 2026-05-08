import { bench, do_not_optimize, boxplot, summary, run } from "mitata";
import { generateAudioWaveform, getAudioDuration } from "../dist/index.js";
import {
  getAudioWaveform as getAudioWaveformOld,
  getAudioDuration as getAudioDurationOld,
} from "baileys";
import fs from "node:fs";

const fileBuffer = fs.readFileSync("./assets/sonata.mp3");

boxplot(() => {
  summary(() => {
    bench("Waveform wasm/rust", () => {
      const waveform = generateAudioWaveform(fileBuffer);
      do_not_optimize(waveform);
    });

    bench("Waveform Baileys", async () => {
      const waveform = await getAudioWaveformOld(fileBuffer);
      do_not_optimize(waveform);
    });
  });

  summary(() => {
    bench("Duration wasm/rust", async () => {
      const duration = await getAudioDuration(fileBuffer);
      do_not_optimize(duration);
    });

    bench("Duration Baileys", async () => {
      const duration = await getAudioDurationOld(fileBuffer);
      do_not_optimize(duration);
    });
  });
});

await run();
