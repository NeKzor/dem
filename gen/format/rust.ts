// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Rust implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`pub struct ${ctx.type.name} {`);
    ctx.type.fields.forEach((field) => {
      out.push(`    pub ${this.genField({ ...ctx, field })},`);
    });
    out.push(`}`);
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
        return `${toSnakeCase(ctx.field.name)}: String`;
      default: {
        if (ctx.field.type.endsWith("[]")) {
          const type = ctx.field.type.slice(0, -2);
          switch (type) {
            case "bool":
              return `${toSnakeCase(ctx.field.name)}: Vec<bool>`;
            case "byte":
              return `${toSnakeCase(ctx.field.name)}: Vec<u8>`;
            case "int":
              return `${toSnakeCase(ctx.field.name)}: Vec<i32>`;
            case "float":
              return `${toSnakeCase(ctx.field.name)}: Vec<f32>`;
            case "string":
              return `${toSnakeCase(ctx.field.name)}: Vec<String>`;
            default:
              return `${toSnakeCase(ctx.field.name)}: Vec<${
                ctx.field.type.slice(0, -2)
              }>`;
          }
        } else {
          return `${
            ctx.field.name === "Type" ? "r#type" : toSnakeCase(ctx.field.name)
          }: ${ctx.field.type}`;
        }
      }
    }
  }
  genZST(ctx: FormatContext, out: string[]): void {
    out.push(`pub struct ${ctx.type.name};`);
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`pub enum ${ctx.enum.name} {`);
    ctx.enum.values.forEach((value) => {
      out.push(`    ${value.name} = ${value.value},`);
    });
    out.push(`}`);
  }
}
