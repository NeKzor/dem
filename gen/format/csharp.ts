// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { Formatter } from "./formatter.ts";

export class Csharp implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`class ${ctx.type.name} {`);
    ctx.type.fields.forEach((field) => {
      out.push(`    public ${this.genField({ ...ctx, field })} { get; set; }`);
    });
    out.push(`}`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `bool ${ctx.field.name}`;
      case "byte":
        return `byte ${ctx.field.name}`;
      case "int":
        return `int ${ctx.field.name}`;
      case "float":
        return `float ${ctx.field.name}`;
      case "string":
        return `string ${ctx.field.name}`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          return `List<${ctx.field.type.slice(0, -2)}> ${ctx.field.name}`;
        } else {
          return `${ctx.field.type} ${ctx.field.name}`;
        }
      }
    }
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
