// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Cpp implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`struct ${toSnakeCase(type.name)}_t {`);
    type.fields.forEach((field) => {
      out.push(`    ${this.genField(field)};`);
    });
    out.push(`};`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `bool ${toSnakeCase(field.name)}`;
      case "int": {
        switch (field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `int${field.bits}_t ${toSnakeCase(field.name)}`;
          default:
            return `int ${toSnakeCase(field.name)}`;
        }
      }
      case "float":
        return `float32_t ${toSnakeCase(field.name)}`;
      case "string":
        return `std::string ${toSnakeCase(field.name)}`;
      default: {
        if (field.type.endsWith("[]")) {
          return `std::vector<${toSnakeCase(field.type.slice(0, -2))}_t> ${
            toSnakeCase(field.name)
          }`;
        } else {
          return `${toSnakeCase(field.type)}_t ${toSnakeCase(field.name)}`;
        }
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
