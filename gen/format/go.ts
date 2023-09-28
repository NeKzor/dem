// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { Formatter } from "./formatter.ts";

export class Go implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`type ${ctx.type.name} struct {`);
    let longestName = 0;
    const fields = ctx.type.fields.map((field) => {
      const fieldGen = this.genField({ ...ctx, field });
      const [name, type] = fieldGen.split(" ", 2);
      if (name.length > longestName) {
        longestName = name.length;
      }
      return [name, type];
    });
    fields.forEach(([name, type]) => {
      const padding = (longestName + 1) - name.length;
      out.push(`\t${name}${" ".repeat(padding)}${type}`);
    });
    out.push(`}`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `${ctx.field.name} bool`;
      case "byte":
        return `${ctx.field.name} int8`;
      case "int": {
        switch (ctx.field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `${ctx.field.name} int${ctx.field.bits}`;
          default:
            return `${ctx.field.name} int`;
        }
      }
      case "float":
        return `${ctx.field.name} float32`;
      case "string":
        return `${ctx.field.name} string`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          return `${ctx.field.name} []${ctx.field.type.slice(0, -2)}`;
        } else {
          return `${ctx.field.name} ${ctx.field.type}`;
        }
      }
    }
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`type ${ctx.enum.name} byte`);
    out.push("");
    out.push(`const (`);
    let longestName = 0;
    const fields = ctx.enum.values.map((value) => {
      if (value.name.length > longestName) {
        longestName = value.name.length;
      }
      return [value.name, value.value] as [string, number];
    });
    fields.forEach(([name, value], idx) => {
      const padding = longestName - name.length;
      out.push(
        `\t${name}${" ".repeat(padding)}${idx ? "" : " " + ctx.enum.name} ${
          idx ? " ".repeat(ctx.enum.values.length + 3) : ""
        }= ${value},`,
      );
    });
    out.push(`)`);
  }
}
