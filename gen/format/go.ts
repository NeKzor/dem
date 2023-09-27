// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";
import { Formatter } from "./formatter.ts";

export class Go implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`type ${type.name} struct {`);
    let longestName = 0;
    const fields = type.fields.map((field) => {
      const fieldGen = this.genField(field);
      const [name, type] = fieldGen.split(" ", 2);
      if (name.length > longestName) {
        longestName = name.length;
      }
      return [name, type];
    });
    fields.forEach(([name, type]) => {
      const padding = (longestName + 1) - name.length;
      out.push(`\t${name}${" ".repeat(padding)}${type}`);
    });
    out.push(`};`);
  }
  genField(field: DemField): string {
    switch (field.type) {
      case "bool":
        return `${field.name}: bool`;
      case "int": {
        switch (field.bits) {
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
            return `${field.name} int${field.bits}`;
          default:
            return `${field.name} int`;
        }
      }
      case "float":
        return `${field.name} float32`;
      case "string":
        return `${field.name} string`;
      default: {
        if (field.type.endsWith("[]")) {
          return `${field.name} []${field.type.slice(0, -2)}`;
        } else {
          return `${field.name} ${field.type}`;
        }
      }
    }
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
