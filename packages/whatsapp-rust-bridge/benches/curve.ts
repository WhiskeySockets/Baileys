import { bench, do_not_optimize, boxplot, summary, run } from "mitata";
import * as wasmCurve from "../dist/index.js";
import * as nodeCurve from "@whiskeysockets/libsignal-node/src/curve.js";

const bobKeyPair = nodeCurve.generateKeyPair();
const aliceKeyPair = nodeCurve.generateKeyPair();

const message = Buffer.from("message");

boxplot(() => {
  summary(() => {
    bench("Generate Key Pair Rust/Wasm", () => {
      const keyPair = wasmCurve.generateKeyPair();
      do_not_optimize(keyPair);
    });

    bench("Generate Key Pair libsignal-node", () => {
      const keyPair = nodeCurve.generateKeyPair();
      do_not_optimize(keyPair);
    });
  });

  summary(() => {
    bench("Calculate Agreement Rust/Wasm", () => {
      const shared1 = wasmCurve.calculateAgreement(
        bobKeyPair.pubKey,
        aliceKeyPair.privKey,
      );
      const shared2 = wasmCurve.calculateAgreement(
        aliceKeyPair.pubKey,
        bobKeyPair.privKey,
      );

      do_not_optimize(shared1);
      do_not_optimize(shared2);
    });

    bench("Calculate Agreement libsignal-node", () => {
      const shared1 = nodeCurve.calculateAgreement(
        bobKeyPair.pubKey,
        aliceKeyPair.privKey,
      );
      const shared2 = nodeCurve.calculateAgreement(
        aliceKeyPair.pubKey,
        bobKeyPair.privKey,
      );

      do_not_optimize(shared1);
      do_not_optimize(shared2);
    });
  });

  summary(() => {
    bench("Calculate Signature Rust/Wasm", () => {
      const signature = wasmCurve.calculateSignature(
        aliceKeyPair.privKey,
        message,
      );
      do_not_optimize(signature);
    });

    bench("Calculate Signature libsignal-node", () => {
      const signature = nodeCurve.calculateSignature(
        aliceKeyPair.privKey,
        message,
      );
      do_not_optimize(signature);
    });
  });

  summary(() => {
    const wasmSignature = wasmCurve.calculateSignature(
      aliceKeyPair.privKey,
      message,
    );
    const nodeSignature = nodeCurve.calculateSignature(
      aliceKeyPair.privKey,
      message,
    );

    bench("Verify Signature Rust/Wasm", () => {
      const isValid = wasmCurve.verifySignature(
        aliceKeyPair.pubKey,
        message,
        wasmSignature,
      );
      do_not_optimize(isValid);
    });

    bench("Verify Signature libsignal-node", () => {
      const isValid = nodeCurve.verifySignature(
        aliceKeyPair.pubKey,
        message,
        nodeSignature,
      );
      do_not_optimize(isValid);
    });
  });
});

await run();
