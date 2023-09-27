// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { toCamelCase } from "../utils.ts";
import { Formatter } from "./formatter.ts";

export class Js implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`class ${type.name} {`);
    type.fields.forEach((field) => {
      out.push(`  ${this.genField(field)} ${toCamelCase(field.name)};`);
    });
    out.push(`}`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `/** @type {boolean} */`;
      case "int":
        return `/** @type {number} */`;
      case "float":
        return `/** @type {number} */`;
      case "string":
        return `/** @type {string} */`;
      default: {
        return `/** @type {${field.type}} */`;
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
