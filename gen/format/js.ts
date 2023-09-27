// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import {
  FormatContext,
  FormatEnumContext,
  FormatFieldContext,
} from "./formatter.ts";
import { toCamelCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Js implements Formatter {
  genStruct(ctx: FormatContext, out: string[]): void {
    out.push(`class ${ctx.type.name} {`);
    ctx.type.fields.forEach((field) => {
      out.push(
        `  ${this.genField({ ...ctx, field })}\n  ${toCamelCase(field.name)};`,
      );
    });
    out.push(`}`);
  }
  genField(ctx: FormatFieldContext): string {
    switch (ctx.field.type) {
      case "bool":
        return `/** @type {boolean} */`;
      case "byte":
      case "int":
        return `/** @type {number} */`;
      case "float":
        return `/** @type {number} */`;
      case "string":
        return `/** @type {string} */`;
      default: {
        return `/** @type {${ctx.field.type}} */`;
      }
    }
  }
  genEnum(ctx: FormatEnumContext, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
