import ts from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

const config = {
  input: "src/lib/index.ts", // pack entry
  output: [
    {
      file: "dist/index.js", // ouput file
      format: "cjs", // file module specifications
    },
    {
      file: "dist/index.mjs", // ouput file
      format: "esm", // file module specifications
    },
  ],
  plugins: [
    commonjs(), // parse the module of commonjs specifications
    resolve(), // parse third-party lib, because rollup only can parse local module
    ts({
      tsconfig: "tsconfig.rollup.json", // specify tsconfig.json file, use to specify the packaging file range
    }),
  ],
  external: ["react", "react-dom"], // declare the third-party external module used, or the packaging will report an error
};

export default config;
