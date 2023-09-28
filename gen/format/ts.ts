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
    out.push(`export class ${ctx.type.name} {`);
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
        if (ctx.field.type.endsWith("[]")) {
          const type = ctx.field.type.slice(0, -2);
          switch (type) {
            case "bool":
              return `${toCamelCase(ctx.field.name)}?: boolean[]`;
            case "byte":
            case "int":
            case "float":
              return `${toCamelCase(ctx.field.name)}?: number[]`;
            case "string":
              return `${toCamelCase(ctx.field.name)}?: string[]`;
            default:
              return `${toCamelCase(ctx.field.name)}?: ${type}[]`;
          }
        } else {
          return `${toCamelCase(ctx.field.name)}?: ${ctx.field.type}`;
        }
      }
    }
  }
  genZST(ctx: FormatContext, out: string[]): void {
    out.push(`class ${ctx.type.name} {}`);
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    out.push(`export enum ${ctx.enum.name} {`);
    ctx.enum.values.forEach((value) => {
      out.push(`  ${value.name} = ${value.value},`);
    });
    out.push(`}`);
  }
}
