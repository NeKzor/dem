// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Cpp implements Formatter {
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
        return `int8_t ${toSnakeCase(ctx.field.name)}`;
      case "int": {
        switch (ctx.field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `int${ctx.field.bits}_t ${toSnakeCase(ctx.field.name)}`;
          default:
            return `int ${toSnakeCase(ctx.field.name)}`;
        }
      }
      case "float":
        return `float32_t ${toSnakeCase(ctx.field.name)}`;
      case "string":
        return `std::string ${toSnakeCase(ctx.field.name)}`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          return `std::vector<${toSnakeCase(ctx.field.type.slice(0, -2))}_t> ${
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
