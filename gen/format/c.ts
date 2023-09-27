// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class C implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`struct ${toSnakeCase(ctx.type.name)}_t {`);
    ctx.type.fields.forEach((field) => {
      out.push(`    ${this.genField({ ...ctx, field })};`);
    });
    out.push(`};`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `bool ${toSnakeCase(ctx.field.name)}`;
      case "byte":
        return `char ${toSnakeCase(ctx.field.name)}`;
      case "int":
        return `int ${toSnakeCase(ctx.field.name)}`;
      case "float":
        return `float ${toSnakeCase(ctx.field.name)}`;
      case "string":
        return `char ${toSnakeCase(ctx.field.name)}[${ctx.field.bits / 8}]`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          return `${toSnakeCase(ctx.field.type.slice(0, -2))}_t** ${
            toSnakeCase(ctx.field.name)
          }`;
        } else {
          return `${toSnakeCase(ctx.field.type)}${
            ctx.field.enum ? "" : "_t*"
          } ${toSnakeCase(ctx.field.name)}`;
        }
      }
    }
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
