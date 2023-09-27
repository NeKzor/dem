// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

import { DemEnum, DemField, DemType } from "../dem.ts";

export interface Formatter {
  genStruct(type: DemType, out: string[]): void;
  genField?(field: DemField): string;
  genEnum(type: DemEnum, out: string[]): void;
}
