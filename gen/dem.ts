// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

export type DemFieldType = "bool" | "int" | "float" | "string";

export interface DemField {
  name: string;
  bits: number;
  byteSize?: string;
  type: DemFieldType | string;
  value?: string;
  values: { type: DemFieldType | string }[];
  description?: string;
  newEngine?: boolean;
  enum?: boolean;
}

export interface DemType {
  name: string;
  fields: DemField[];
}

export interface DemEnumValue {
  name: string;
  description?: string;
  value: number;
}

export interface DemEnum {
  name: string;
  values: DemEnumValue[];
}

export interface Dem {
  types: DemType[];
  enums: DemEnum[];
}

export interface Mapping {
  name: string;
  path: string;
  ref?: string;
  generate?: boolean;
}

export interface DemMapping {
  mappings: Mapping[];
}
