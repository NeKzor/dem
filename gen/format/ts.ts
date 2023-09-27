// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { toCamelCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Ts implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`class ${type.name} {`);
    type.fields.forEach((field) => {
      out.push(`  public ${this.genField(field)};`);
    });
    out.push(`}`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `${toCamelCase(field.name)}?: boolean`;
      case "int":
        return `${toCamelCase(field.name)}?: number`;
      case "float":
        return `${toCamelCase(field.name)}?: number`;
      case "string":
        return `${toCamelCase(field.name)}?: string`;
      default: {
        return `${toCamelCase(field.name)}?: ${field.type}`;
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
