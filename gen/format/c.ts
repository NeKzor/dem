// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { toSnakeCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class C implements Formatter {
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
      case "int":
        return `int ${toSnakeCase(field.name)}`;
      case "float":
        return `float ${toSnakeCase(field.name)}`;
      case "string":
        return `char ${toSnakeCase(field.name)}[${field.bits / 8}]`;
      default: {
        if (field.type.endsWith("[]")) {
          return `${toSnakeCase(field.type.slice(0, -2))}_t** ${
            toSnakeCase(field.name)
          }`;
        } else {
          return `${toSnakeCase(field.type)}_t* ${toSnakeCase(field.name)}`;
        }
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
