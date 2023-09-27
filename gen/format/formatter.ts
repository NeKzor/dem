// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";

export interface FormatContext {
  type: DemType;
  types: DemType[];
  enums: DemEnum[];
  getLink: (field: DemField) => string;
}

export interface FormatFieldContext extends FormatContext {
  field: DemField;
}

export interface FormatEnumContext {
  enum: DemEnum;
}

export interface Formatter {
  genStruct(ctx: FormatContext, out: string[]): void;
  genField?(ctx: FormatFieldContext): string;
  genEnum(ctx: FormatEnumContext, out: string[]): void;
}
