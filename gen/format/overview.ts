// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { FormatContext, FormatEnumContext, Formatter } from "./formatter.ts";

export class Overview implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`| Name | Type | Size in bytes | Size in bits | Value |`);
    out.push(`| --- | --- | --- | --- | --- |`);
    const notes: string[] = [];
    ctx.type.fields.forEach((field) => {
      if (field.description) {
        notes.push(field.description);
      }

      // TODO: link to non-primitive type
      out.push(
        `| ${field.name}${
          field.newEngine ? `<sup title="New Engine">NE</sup>` : ""
        }${
          field.description
            ? `<sup>${field.newEngine ? " " : ""}${notes.length}</sup>`
            : ""
        } | ${
          field.enum || field.type[0] === field.type[0].toUpperCase()
            ? ctx.getLink(field)
            : field.type
        } | ${field.bits ? field.bits / 8 : "-"} | ${
          field.bits ? field.bits : "-"
        } | ${field.value ?? "-"} |`,
      );
    });

    notes.forEach((note, idx) => {
      idx && out.push("<br/>");
      const lines: string[] = [];
      let line = `<sup>${idx + 1}</sup>`;
      const words = note.split(" ");
      for (const word of words) {
        if (line.length + word.length <= 120) {
          line += " " + word;
        } else {
          lines.push(line);
          line = word;
        }
      }
      lines.push(line);
      lines.forEach((line) => out.push(line));
    });
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
