// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Zig implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`const ${ctx.type.name} = struct {`);
    ctx.type.fields.forEach((field) => {
      out.push(`    ${this.genField({ ...ctx, field })},`);
    });
    out.push(`};`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `${toSnakeCase(ctx.field.name)}: bool`;
      case "byte":
        return `${toSnakeCase(ctx.field.name)}: i8`;
      case "int": {
        switch (ctx.field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `${toSnakeCase(ctx.field.name)}: i${ctx.field.bits}`;
          default:
            return `${toSnakeCase(ctx.field.name)}: i32`;
        }
      }
      case "float":
        return `${toSnakeCase(ctx.field.name)}: f32`;
      case "string":
        return `${toSnakeCase(ctx.field.name)}: []u8`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          const type = ctx.field.type.slice(0, -2);
          switch (type) {
            case "bool":
              return `${toSnakeCase(ctx.field.name)}: []bool`;
            case "byte":
              return `${toSnakeCase(ctx.field.name)}: []u8`;
            case "int":
              return `${toSnakeCase(ctx.field.name)}: []i32`;
            case "float":
              return `${toSnakeCase(ctx.field.name)}: []f32`;
            case "string":
              return `${toSnakeCase(ctx.field.name)}: [][]u8`;
            default:
              return `${toSnakeCase(ctx.field.name)}: []${
                ctx.field.type.slice(0, -2)
              }`;
          }
        } else {
          return `${toSnakeCase(ctx.field.name)}: ${
            toSnakeCase(ctx.field.type)
          }`;
        }
      }
    }
  }
  genZST(ctx: FormatContext, out: string[]): void {
    out.push(`const ${ctx.type.name} = struct {};`);
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`const ${ctx.enum.name} = enum {`);
    ctx.enum.values.forEach((value) => {
      out.push(`    ${toSnakeCase(value.name)} = ${value.value},`);
    });
    out.push(`};`);
  }
}
