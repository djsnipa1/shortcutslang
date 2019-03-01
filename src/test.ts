import * as fs from "fs";
import * as bplistc from "bplist-creator";

import parser from "./ShortcutsParser";

const data = parser.beginParse(`${process.argv[2] || fs.readFileSync("./src/test.shorttxt", "utf8")  }\n`);

const shortcut = data.asShortcut();
const shortcutData = shortcut.build();
console.dir(shortcutData, {depth: null}); //eslint-disable-line no-console
// @ts-ignore
const buffer = bplistc(shortcutData);
fs.writeFileSync("./src/test.shortcut", buffer);
