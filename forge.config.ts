import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import MakerDMG from "@electron-forge/maker-dmg";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import MakerZIP from "@electron-forge/maker-zip";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { mainConfig } from "./webpack.main.config";

import { rendererConfig } from "./webpack.renderer.config";
import { join } from "path";

const icon_path = join(__dirname, "src", "assets", "icon");

const HOMEPAGE = "https://github.com/antonalvarezbc/WildbookExport";
const MAINTAINER = "Anton Alvarez";
const DESCRIPTION = "Download annotated images from a Wildbook Encounter Annotation Export";

// Debian/RPM package names must be lowercase, but the packaged executable keeps the
// productName casing, so `bin` has to match the binary electron-packager produces.
const linuxPackageOptions = {
  name: "wildex",
  productName: "WildEx",
  genericName: "Wildbook Annotation Exporter",
  bin: "WildEx",
  description: DESCRIPTION,
  icon: icon_path + ".png",
  homepage: HOMEPAGE,
};

const config: ForgeConfig = {
  packagerConfig: {
    asar: false,
    icon: icon_path,
  },
  rebuildConfig: {},
    makers: [
      new MakerSquirrel(
        {
          iconUrl:
            "https://raw.githubusercontent.com/antonalvarezbc/WildbookExport/main/src/assets/icon.ico",
          setupIcon: icon_path + ".ico",
          skipUpdateIcon: true,
        },
        ["win32"],
      ),

      new MakerDMG(
        {
          name: "WildEx",
          icon: icon_path + ".icns",
          overwrite: true,
        },
        ["darwin"],
      ),

      new MakerDeb(
        {
          options: {
            ...linuxPackageOptions,
            // inlined so the maker's literal union type applies instead of string[]
            categories: ["Science", "Utility"],
            maintainer: MAINTAINER,
          },
        },
        ["linux"],
      ),

      new MakerRpm(
        {
          options: {
            ...linuxPackageOptions,
            categories: ["Science", "Utility"],
            license: "MIT",
          },
        },
        ["linux"],
      ),

      // portable fallback for users who can't install a .deb/.rpm, and for macOS CI artifacts
      new MakerZIP({}, ["darwin", "linux"]),
    ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
