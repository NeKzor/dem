// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { Formatter } from "./formatter.ts";

export class Csharp implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`class ${type.name} {`);
    type.fields.forEach((field) => {
      out.push(`    public ${this.genField(field)} { get; set; }`);
    });
    out.push(`}`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `bool ${field.name}`;
      case "int":
        return `int ${field.name}`;
      case "float":
        return `float ${field.name}`;
      case "string":
        return `string ${field.name}`;
      default: {
        if (field.type.endsWith("[]")) {
          return `List<${field.type.slice(0, -2)}> ${field.name}`;
        } else {
          return `${field.type} ${field.name}`;
        }
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
