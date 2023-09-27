// Copyright (c) 2023, NeKz
// SPDX-License-Identifier: MIT

export const toSnakeCase = (value: string) => {
  return value.split(/\.?(?=[A-Z])/).join("_").toLowerCase();
};

export const toCamelCase = (value: string) => {
  return value[0].toLowerCase() + value.substring(1);
};
