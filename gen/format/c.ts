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
    out.push(`typedef struct {`);
    ctx.type.fields.forEach((field) => {
      out.push(`    ${this.genField({ ...ctx, field })};`);
    });
    out.push(`} ${toSnakeCase(ctx.type.name)}_t;`);
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
        return ctx.field.bits
          ? `char ${toSnakeCase(ctx.field.name)}[${ctx.field.bits / 8}]`
          : `char* ${toSnakeCase(ctx.field.name)}`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          const type = ctx.field.type.slice(0, -2);
          switch (type) {
            case "byte":
              return `char* ${toSnakeCase(ctx.field.name)}`;
            case "string":
              return `char** ${toSnakeCase(ctx.field.name)}`;
            default:
              return `${toSnakeCase(type)}_t** ${toSnakeCase(ctx.field.name)}`;
          }
        } else {
          return `${toSnakeCase(ctx.field.type)}${
            ctx.field.enum ? "" : "_t*"
          } ${toSnakeCase(ctx.field.name)}`;
        }
      }
    }
  }
  genZST(ctx: FormatContext, out: string[]): void {
    out.push(`typedef struct {} ${toSnakeCase(ctx.type.name)}_t;`);
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`enum ${toSnakeCase(ctx.enum.name)} {`);
    const prefix = ctx.enum.name.replaceAll(/[a-z]+/g, "");
    ctx.enum.values.forEach((value) => {
      out.push(
        `    ${prefix}_${
          toSnakeCase(value.name).toUpperCase()
        } = ${value.value},`,
      );
    });
    out.push(`};`);
  }
}
