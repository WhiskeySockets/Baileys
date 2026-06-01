import { bench, do_not_optimize, boxplot, summary, run } from "mitata";
import { generateProfilePicture, extractImageThumb } from "../dist/index.js";
import {
  generateProfilePicture as generateProfilePictureOld,
  extractImageThumb as extractImageThumbOld,
} from "baileys";
import fs from "node:fs";

const fileBuffer = fs.readFileSync("./assets/image.png");

boxplot(() => {
  summary(() => {
    // Synchronous - no async/await needed
    bench("Profile Picture wasm/rust", () => {
      const profilePicture = generateProfilePicture(fileBuffer, 96);
      do_not_optimize(profilePicture);
    });

    // Async - uses sharp internally
    bench("Profile Picture libsignal-node", async () => {
      const profilePicture = await generateProfilePictureOld(fileBuffer, {
        width: 96,
        height: 96,
      });
      do_not_optimize(profilePicture);
    });
  });

  summary(() => {
    // Synchronous - no async/await needed
    bench("Extract thumbnail wasm/rust", () => {
      const thumbnail = extractImageThumb(fileBuffer, 96);
      do_not_optimize(thumbnail);
    });

    // Async - uses sharp internally
    bench("Extract thumbnail libsignal-node", async () => {
      const thumbnail = await extractImageThumbOld(fileBuffer, 96);
      do_not_optimize(thumbnail);
    });
  });
});

await run();
