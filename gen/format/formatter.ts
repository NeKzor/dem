// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemEnumValue, DemField, DemType } from "../dem.ts";

export interface FormatContext {
  type: DemType;
  types: DemType[];
  enums: DemEnum[];
  getLink: (field: DemField | string) => string;
}

export interface FormatFieldContext extends FormatContext {
  field: DemField;
}

export interface FormatEnumContext {
  enum: DemEnum;
  getLink: (value: DemEnumValue) => string;
}

export interface Formatter {
  genStruct(ctx: FormatContext, out: string[]): void;
  genField?(ctx: FormatFieldContext): string;
  genZST?(ctx: FormatContext, out: string[]): void;
  genEnum(ctx: FormatEnumContext, out: string[]): void;
}
