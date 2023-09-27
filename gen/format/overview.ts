// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemType } from "../dem.ts";
import { Formatter } from "./formatter.ts";

export class Overview implements Formatter {
  genStruct(type: DemType, out: string[]): void {
    out.push(`| Name | Type | Size in bytes | Size in bits | Value |`);
    out.push(`| --- | --- | --- | --- | --- |`);
    type.fields.forEach((field) => {
      // TODO: link to non-primitive type
      out.push(
        `| ${field.name} | ${field.bits === 8 ? "byte" : field.type} | ${
          field.bits ? field.bits / 8 : "-"
        } | ${field.bits ?? "-"} | ${field.value ?? "-"} |`,
      );
    });
  }
  genEnum(type: DemEnum, out: string[]): void {
    throw new Error("Method not implemented.");
  }
}
