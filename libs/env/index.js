import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { VALID_FLAW_CHECKS } from "../constants/index.js";

// Spread into two lines to get the ROOT path,
// to prevent Webpack from treating 'new URL("../..", import.meta.url)' as an import.
const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(currentDir, "..", "..");

dotenv.config({
  path: path.join(ROOT, process.env.ENV_FILE || ".env"),
});

// -----
// build
// -----

export const BUILD_OUT_ROOT =
  process.env.BUILD_OUT_ROOT || path.join(ROOT, "client", "build");

// TODO (far future): Switch to "error" when number of flaws drops.
export const DEFAULT_FLAW_LEVELS = process.env.BUILD_FLAW_LEVELS || "*:warn";

export const FILES = process.env.BUILD_FILES || "";
export const FOLDERSEARCH = process.env.BUILD_FOLDERSEARCH || "";
export const GOOGLE_ANALYTICS_ACCOUNT =
  process.env.BUILD_GOOGLE_ANALYTICS_ACCOUNT || "";
export const GOOGLE_ANALYTICS_DEBUG = JSON.parse(
  process.env.BUILD_GOOGLE_ANALYTICS_DEBUG || "false"
);
export const NO_PROGRESSBAR = Boolean(
  JSON.parse(process.env.BUILD_NO_PROGRESSBAR || process.env.CI || "false")
);
export const FIX_FLAWS = JSON.parse(process.env.BUILD_FIX_FLAWS || "false");
export const FIX_FLAWS_DRY_RUN = JSON.parse(
  process.env.BUILD_FIX_FLAWS_DRY_RUN || "false"
);
export const FIX_FLAWS_TYPES = new Set(
  (process.env.BUILD_FIX_FLAWS_TYPES &&
    process.env.BUILD_FIX_FLAWS_TYPES.split(",")) || [...VALID_FLAW_CHECKS]
);

if ([...FIX_FLAWS_TYPES].some((flawType) => !VALID_FLAW_CHECKS.has(flawType))) {
  throw new Error(
    `Env var BUILD_FIX_FLAWS_TYPES must be a subset of ${[
      ...VALID_FLAW_CHECKS.values(),
    ].join(",")}`
  );
}

export const FIX_FLAWS_VERBOSE = JSON.parse(
  // It's on by default because it's such a sensible option to always have
  // on.
  process.env.BUILD_FIX_FLAWS_VERBOSE || "true"
);

// See explanation in docs/envvars.md
export const ALWAYS_ALLOW_ROBOTS = JSON.parse(
  process.env.BUILD_ALWAYS_ALLOW_ROBOTS || "false"
);

// -------
// content
// -------

export const CONTENT_ROOT = correctContentPathFromEnv("CONTENT_ROOT");

export const CONTENT_TRANSLATED_ROOT = correctContentPathFromEnv(
  "CONTENT_TRANSLATED_ROOT"
);

export const CONTRIBUTOR_SPOTLIGHT_ROOT = correctContentPathFromEnv(
  "CONTRIBUTOR_SPOTLIGHT_ROOT"
);

// This makes it possible to know, give a root folder, what is the name of
// the repository on GitHub.
// E.g. `'https://github.com/' + REPOSITORY_URLS[document.fileInfo.root]`
export const REPOSITORY_URLS = {
  [CONTENT_ROOT]: "mdn/content",
};

// Make a combined array of all truthy roots. This way, you don't
// need to constantly worry about CONTENT_TRANSLATED_ROOT potentially being
// null.
export const ROOTS = [CONTENT_ROOT];
if (CONTENT_TRANSLATED_ROOT) {
  ROOTS.push(CONTENT_TRANSLATED_ROOT);
  REPOSITORY_URLS[CONTENT_TRANSLATED_ROOT] = "mdn/translated-content";
}

function correctContentPathFromEnv(envVarName) {
  let pathName = process.env[envVarName];
  if (!pathName) {
    return;
  }
  pathName = fs.realpathSync(pathName);
  if (
    path.basename(pathName) !== "files" &&
    fs.existsSync(path.join(pathName, "files"))
  ) {
    // It can be "corrected"
    pathName = path.join(pathName, "files");
    console.warn(
      `Corrected the ${envVarName} environment variable to ${pathName}`
    );
  } else if (!fs.existsSync(pathName)) {
    throw new Error(`${path.resolve(pathName)} does not exist`);
  }
  return pathName;
}

// ---------
// filecheck
// ---------

export const MAX_FILE_SIZE = JSON.parse(
  process.env.FILECHECK_MAX_FILE_SIZE || 500 * 1024 // 500KiB
);

// ----------
// kumascript
// ----------

const SERVER_PORT = process.env.SERVER_PORT || 5042;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

// Allow the `process.env.BUILD_LIVE_SAMPLES_BASE_URL` to be falsy
// if it *is* set.
export const LIVE_SAMPLES_BASE_URL =
  process.env.BUILD_LIVE_SAMPLES_BASE_URL !== undefined
    ? process.env.BUILD_LIVE_SAMPLES_BASE_URL
    : SERVER_URL;

export const INTERACTIVE_EXAMPLES_BASE_URL =
  process.env.BUILD_INTERACTIVE_EXAMPLES_BASE_URL ||
  "https://interactive-examples.mdn.mozilla.net";

// ------
// server
// ------

export const STATIC_ROOT =
  process.env.SERVER_STATIC_ROOT || path.join(ROOT, "client", "build");
export const PROXY_HOSTNAME =
  process.env.REACT_APP_KUMA_HOST || "developer.mozilla.org";
export const CONTENT_HOSTNAME = process.env.SERVER_CONTENT_HOST;
export const OFFLINE_CONTENT = process.env.SERVER_OFFLINE_CONTENT === "true";

export const FAKE_V1_API = JSON.parse(process.env.SERVER_FAKE_V1_API || false);
