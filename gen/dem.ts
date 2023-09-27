// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

export type DemFieldType = "bool" | "int" | "float" | "string";

export interface DemField {
  name: string;
  bits: number;
  type: DemFieldType | string;
  value?: string;
  description?: string;
}

export interface DemType {
  name: string;
  fields: DemField[];
}

export interface DemEnumValue {
  name: string;
  ref?: string;
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
  generate?: boolean;
}

export interface DemMapping {
  mappings: [];
}
