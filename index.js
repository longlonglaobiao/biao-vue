#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function copyFiles(paths, filepath, rootPath) {
  paths.forEach(function (path) {
    let fullPath = filepath + "\\" + path;
    fs.stat(fullPath, (err, stats) => {
      if (err) {
        throw err;
      }
      console.log(fullPath);
      if (stats.isFile()) {
        // 如果是文件
        let data = fs.readFileSync(fullPath, "utf8");
        fs.writeFileSync(rootPath + "\\" + path, data, function (err) {
          if (err) throw err;
        });
      } else {
        // 如果是文件夹
        // console.log(stats.isDirectory());
        fs.mkdirSync(rootPath + "\\" + path, () => {});
        let paths = fs.readdirSync(fullPath); //同步读取当前目录
        copyFiles(paths, fullPath, rootPath + "\\" + path);
      }
    });
  });
}

(function () {
  let argv = process.argv.slice(2); // 获取到参数列表

  let data = fs.readFileSync(path.join(__dirname, "package.json")).toString();
  let package = JSON.parse(data);

  argv.forEach((v, i) => {
    switch (true) {
      case /^--version$/.test(v):
        console.log(package.version);
        break;
      case /^--author$/.test(v):
        console.log(package.author);
        break;
      // 后面添加 ssr server mock 等可选项
      default:
        // 如果都不匹配那么就是创建项目

        let rootPath = path.join(process.cwd(), argv[0]);
        fs.mkdirSync(rootPath);
        let filepath = path.join(__dirname, "temporary");
        let paths = fs.readdirSync(filepath); //同步读取当前目录
        copyFiles(paths, filepath, rootPath);
        break;
    }
  });
})();
