/**
 * Build Nano Defender in release mode.
 * NanoDefender must be in the same parent directory as NanoCore.
 */
"use strict";

(async () => {
    console.log("[Nano] Build Defender :: Started");

    const buildPath = require("./build-engine.node.js").ezInit() + "_Defender";
    assert(isFirefox);

    let repository = "NanoDefender";
    if (process.argv.includes("--use-ubr-repository")) {
        // Undocumented internal option
        repository = "uBlockProtector";
    }

    await smartCopyDirectory("../" + repository + "/Extension Compiler/Extension", buildPath);

    // This is not beautiful, but good enough
    await fs.copyFile("../" + repository + "/Extension Compiler/Extension/common.js", buildPath + "/common.js");
    await fs.appendFile(buildPath + "/common.js", "\na.isFirefox = true;\na.debugMode = false;\n", { encoding: "utf8" });

    let manifest = await fs.readFile(buildPath + "/manifest.json", "utf8");
    manifest = JSON.parse(manifest);

    manifest["description"] = "An anti-adblock defuser for Nano Adblocker";
    manifest["homepage_url"] = "https://github.com/NanoAdblocker/NanoDefender/";
    delete manifest["minimum_chrome_version"];
    manifest["applications"] = {
        "gecko": {
            "strict_min_version": "57.0",
        },
    };

    await fs.writeFile(buildPath + "/manifest.json", JSON.stringify(manifest, null, 2), "utf8");

    console.log("[Nano] Build Defender :: Done");
})();
