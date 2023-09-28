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
        return `std::byte ${toSnakeCase(ctx.field.name)}`;
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
          const type = ctx.field.type.slice(0, -2);
          switch (type) {
            case "byte":
              return `std::vector<std::byte> ${toSnakeCase(ctx.field.name)}`;
            case "string":
              return `std::vector<std::string> ${toSnakeCase(ctx.field.name)}`;
            case "bool":
            case "int":
            case "float":
              return `std::vector<${type}> ${toSnakeCase(ctx.field.name)}`;
            default:
              return `std::vector<${toSnakeCase(type)}_t> ${
                toSnakeCase(ctx.field.name)
              }`;
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
    out.push(`struct ${toSnakeCase(ctx.type.name)}_t {};`);
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`enum class ${toSnakeCase(ctx.enum.name)} {`);
    ctx.enum.values.forEach((value) => {
      out.push(
        `    ${toSnakeCase(value.name).toUpperCase()} = ${value.value},`,
      );
    });
    out.push(`};`);
  }
}
