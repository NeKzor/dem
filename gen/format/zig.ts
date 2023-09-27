// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Zig implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`const ${type.name} = struct {`);
    type.fields.forEach((field) => {
      out.push(`    ${this.genField(field)},`);
    });
    out.push(`};`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `${toSnakeCase(field.name)}: bool`;
      case "int": {
        switch (field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `${toSnakeCase(field.name)}: i${field.bits}`;
          default:
            return `${toSnakeCase(field.name)}: i32`;
        }
      }
      case "float":
        return `${toSnakeCase(field.name)}: f32`;
      case "string":
        return `${toSnakeCase(field.name)}: []const u8`;
      default: {
        if (field.type.endsWith("[]")) {
          return `${toSnakeCase(field.name)}: []${field.type.slice(0, -2)}`;
        } else {
          return `${toSnakeCase(field.name)}: ${toSnakeCase(field.type)}`;
        }
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
