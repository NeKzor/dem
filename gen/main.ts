// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { Dem, DemEnumValue, DemField, DemMapping } from "./dem.ts";
import { FormatContext, FormatEnumContext } from "./format/formatter.ts";
import {
  C,
  Cpp,
  Csharp,
  Formatter,
  Go,
  Js,
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

const importCache = new Set<string>();

const getLink = (field: DemField | string) => {
  const fieldType = typeof field === "string" ? field : field.type;
  const innerType = fieldType.endsWith("[]")
    ? fieldType.slice(0, -2)
    : fieldType;
  const mapping = mappings.find(({ name }) => name === innerType);
  if (!mapping) {
    return fieldType;
  }
  if (mapping.ref) {
    return `[${fieldType}](${mapping.ref})`;
  }
  return `[${fieldType}](${mapping.path.slice(4)})`;
};

const getEnumLink = (value: DemEnumValue) => {
  const typeName = value.name;
  const mapping = mappings.find(({ name }) => name === typeName);
  return mapping ? `[${typeName}](${mapping.path.slice(4)})` : typeName;
};

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

  if (!importCache.has(path)) {
    importCache.add(path);
    out.push(`import Tabs from '@theme/Tabs';`);
    out.push(`import TabItem from '@theme/TabItem';`);
  }

  out.push("");
  out.push(`<Tabs groupId="lang">`);

  const ctx: FormatContext = {
    type: demType,
    types: dem.types,
    enums: dem.enums,
    getLink,
  };

  formatters.forEach(([language, label, value]) => {
    const isCode = value !== "overview";
    if (!demType.fields.length && !language.genZST) {
      return;
    }

    out.push(`<TabItem value="${value}" label="${label}">`);
    out.push("");
    isCode && out.push(`\`\`\`${value}`);
    if (demType.fields.length) {
      language.genStruct(ctx, out);
    } else {
      language.genZST!(ctx, out);
    }
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
  const demEnum = dem.enums.find((type) => type.name === name);
  if (!demEnum) {
    return false;
  }

  const ctx: FormatEnumContext = {
    enum: demEnum,
    getLink: getEnumLink,
  };

  const out: string[] = [];

  if (!importCache.has(path)) {
    importCache.add(path);
    out.push(`import Tabs from '@theme/Tabs';`);
    out.push(`import TabItem from '@theme/TabItem';`);
  }

  out.push("");
  out.push(`<Tabs groupId="lang">`);

  formatters.forEach(([language, label, value]) => {
    const isCode = value !== "overview";
    out.push(`<TabItem value="${value}" label="${label}">`);
    out.push("");
    isCode && out.push(`\`\`\`${value}`);
    language.genEnum(ctx, out);
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

for (const { name, path, generate } of mappings) {
  if (!generate) {
    continue;
  }

  const content = (await Deno.readTextFile(path)).split("\n");

  // TODO: Switch to mdx v2 comments when Docusaurus v3 comes out
  const start = content.indexOf(`<!-- @dem-gen-begin:${name} -->`);
  const end = content.indexOf(`<!-- @dem-gen-end:${name} -->`);

  if (start === -1 || end === -1) {
    console.warn(
      `Missing begin-end markers in ${path} : ${name} : ${start} - ${end}`,
    );
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
