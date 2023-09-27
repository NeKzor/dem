// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { Dem, DemMapping } from "./dem.ts";
import {
  C,
  Cpp,
  Csharp,
  Go,
  Js,
  Formatter,
  Overview,
  Rust,
  Ts,
  Zig,
} from "./format/mod.ts";

const formatters: [language: Formatter, label: string, value: string][] = [
  [new Overview(), "Overview", "overview"],
  [new C(), "C", "c"],
  [new Cpp(), "C++", "cpp"],
  [new Csharp(), "C#", "csharp"],
  [new Js(), "JS", "js"],
  [new Ts(), "TS", "ts"],
  [new Go(), "Go", "go"],
  [new Rust(), "Rust", "rust"],
  [new Zig(), "Zig", "zig"],
];

const dem = JSON.parse(await Deno.readTextFile(".dem.json")) as Dem;
const { mappings } = JSON.parse(
  await Deno.readTextFile(".dem.map.json"),
) as DemMapping;

const genType = async (
  path: string,
  content: string[],
  name: string,
  start: number,
  end: number,
): Promise<boolean> => {
  const demType = dem.types.find((type) => type.name === name);
  if (!demType) {
    return false;
  }

  const out: string[] = [];
  out.push(`import Tabs from '@theme/Tabs';`);
  out.push(`import TabItem from '@theme/TabItem';`);
  out.push("");
  out.push(`<Tabs groupId="lang">`);
  formatters.forEach(([language, label, value]) => {
    const isCode = value !== 'overview';
    out.push(`<TabItem value="${value}" label="${label}">`);
    out.push("");
    isCode && out.push(`\`\`\`${value}`);
    language.genStruct(demType, out);
    isCode && out.push(`\`\`\``);
    out.push("");
    out.push(`</TabItem>`);
  });
  out.push(`</Tabs>`);
  out.push("");

  const newContent = [
    ...content.slice(0, start + 1),
    ...out,
    ...content.slice(end),
  ];

  await Deno.writeTextFile(path, newContent.join("\n"));

  return true;
};

const genEnum = async (
  path: string,
  content: string[],
  name: string,
  start: number,
  end: number,
): Promise<boolean> => {
  const demType = dem.enums.find((type) => type.name === name);
  if (!demType) {
    return false;
  }

  const out: string[] = [];
  out.push(`import Tabs from '@theme/Tabs';`);
  out.push(`import TabItem from '@theme/TabItem';`);
  out.push(`<Tabs>`);
  formatters.forEach(([language, label, value]) => {
    out.push(`<TabItem value="${value}" label="${label}">`);
    out.push("");
    out.push(`\`\`\`${value}`);
    language.genEnum(demType, out);
    out.push(`\`\`\``);
    out.push("");
    out.push(`</TabItem>`);
  });
  out.push(`</Tabs>`);

  const newContent = [
    ...content.slice(0, start + 1),
    ...out,
    ...content.slice(end),
  ];

  await Deno.writeTextFile(path, newContent.join("\n"));

  return true;
};

for (const { name, path, generate } of mappings) {
  if (!generate) {
    continue;
  }

  const content = (await Deno.readTextFile(path)).split("\n");

  // TODO: Switch to mdx v2 comments when Docusaurus v3 comes out
  const start = content.indexOf(`<!-- @dem-gen-begin:${name} -->`);
  const end = content.indexOf(`<!-- @dem-gen-end:${name} -->`);

  if (start === -1 || end === -1) {
    console.warn(`Missing begin-end markers in ${path} : ${start} - ${end}`);
    continue;
  }

  if (await genType(path, content, name, start, end)) {
    continue;
  }

  if (await genEnum(path, content, name, start, end)) {
    continue;
  }

  console.warn(`Found missing type/enum: ${name}`);
}
