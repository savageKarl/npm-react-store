const path = require("path");

const resolve = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const ts = require("rollup-plugin-typescript2");
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: "src/lib/index.ts", // 打包入口
  output: [
    {
      file: "dist/index.js", // 输出的文件
      format: "cjs", // 文件模块规范
    },
  ],
  plugins: [
    commonjs(), // 解析 commonjs规范的模块
    // 打包插件
    resolve(), // rollup导入语法只能导入本地文件，这里用于转换语法，告诉导入的是第三方库
    terser(), // 压缩代码和去除注释
    ts({ // 解析 typescript
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      extensions: [".js", ".ts", ".tsx"], // 解析的扩展名
    }),
  ],
  external: ['react', 'react-dom'], // 声明使用的第三方外部模块，要不然打包就会报错
};
