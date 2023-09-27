// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toCamelCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Ts implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`class ${ctx.type.name} {`);
    ctx.type.fields.forEach((field) => {
      out.push(`  public ${this.genField({ ...ctx, field })};`);
    });
    out.push(`}`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `${toCamelCase(ctx.field.name)}?: boolean`;
      case "byte":
      case "int":
      case "float":
        return `${toCamelCase(ctx.field.name)}?: number`;
      case "string":
        return `${toCamelCase(ctx.field.name)}?: string`;
      default: {
        return `${toCamelCase(ctx.field.name)}?: ${ctx.field.type}`;
      }
    }
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
