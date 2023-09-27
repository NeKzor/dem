type DemFieldType = "bool" | "int" | "float" | "string";

interface DemField {
  name: string;
  bits: number;
  type: DemFieldType | string;
  value?: string;
  description?: string;
}

interface DemType {
  name: string;
  fields: DemField[];
}

interface DemEnumValue {
  name: string;
  ref?: string;
  description?: string;
  value: number;
}

interface DemEnum {
  name: string;
  values: DemEnumValue[];
}

interface Dem {
  types: DemType[];
  enums: DemEnum[];
}

const toSnakeCase = (value: string) => {
  return value.split(/\.?(?=[A-Z])/).join("_").toLowerCase();
};

const toCamelCase = (value: string) => {
  return value[0].toLowerCase() + value.substring(1);
};

const genOverview = (type: DemType, out: string[]) => {
  out.push(`| Name | Type | Size in bytes | Size in bits | Value |`);
  out.push(`| --- | --- | --- | --- | --- |`);
  type.fields.forEach((field) => {
    // TODO: link to non-primitive type
    out.push(
      `| ${field.name} | ${field.type} | ${field.bits / 8} | ${field.bits} | ${
        field.value ?? "-"
      } |`,
    );
  });
};

const genCField = (field: DemField) => {
  switch (field.type) {
    case "bool":
      return `bool ${toSnakeCase(field.name)}`;
    case "int":
      return `int ${toSnakeCase(field.name)}`;
    case "float":
      return `float ${toSnakeCase(field.name)}`;
    case "string":
      return `char ${toSnakeCase(field.name)}[${field.bits / 8}]`;
    default: {
      if (field.type.endsWith("[]")) {
        return `${toSnakeCase(field.type.slice(0, -2))}_t** ${
          toSnakeCase(field.name)
        }`;
      } else {
        return `${toSnakeCase(field.type)}_t* ${toSnakeCase(field.name)}`;
      }
    }
  }
};
const genC = (type: DemType, out: string[]) => {
  out.push(`struct ${toSnakeCase(type.name)}_t {`);
  type.fields.forEach((field) => {
    out.push(`  ${genCField(field)};`);
  });
  out.push(`};`);
};

const genCppField = (field: DemField) => {
  switch (field.type) {
    case "bool":
      return `bool ${toSnakeCase(field.name)}`;
    case "int": {
      switch (field.bits) {
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
          return `int${field.bits}_t ${toSnakeCase(field.name)}`;
        default:
          return `int ${toSnakeCase(field.name)}`;
      }
    }
    case "float":
      return `float32_t ${toSnakeCase(field.name)}`;
    case "string":
      return `std::string ${toSnakeCase(field.name)}`;
    default: {
      if (field.type.endsWith("[]")) {
        return `std::vector<${toSnakeCase(field.type.slice(0, -2))}_t> ${
          toSnakeCase(field.name)
        }`;
      } else {
        return `${toSnakeCase(field.type)}_t ${toSnakeCase(field.name)}`;
      }
    }
  }
};
const genCpp = (type: DemType, out: string[]) => {
  out.push(`struct ${toSnakeCase(type.name)}_t {`);
  type.fields.forEach((field) => {
    out.push(`  ${genCppField(field)};`);
  });
  out.push(`};`);
};

const genCsharpField = (field: DemField) => {
  switch (field.type) {
    case "bool":
      return `bool ${field.name}`;
    case "int":
      return `int ${field.name}`;
    case "float":
      return `float ${field.name}`;
    case "string":
      return `string ${field.name}`;
    default: {
      if (field.type.endsWith("[]")) {
        return `List<${field.type.slice(0, -2)}> ${field.name}`;
      } else {
        return `${field.type} ${field.name}`;
      }
    }
  }
};
const genCsharp = (type: DemType, out: string[]) => {
  out.push(`class ${type.name} {`);
  type.fields.forEach((field) => {
    out.push(`  public ${field.type} ${field.name} { get; set; }`);
  });
  out.push(`}`);
};

const genJSFieldDoc = (field: DemField) => {
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
};
const genJS = (type: DemType, out: string[]) => {
  out.push(`class ${type.name} {`);
  type.fields.forEach((field) => {
    out.push(`  ${genJSFieldDoc(field)} ${toCamelCase(field.name)};`);
  });
  out.push(`}`);
};

const genTSField = (field: DemField) => {
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
};
const genTS = (type: DemType, out: string[]) => {
  out.push(`class ${type.name} {`);
  type.fields.forEach((field) => {
    out.push(`  ${genTSField(field)};`);
  });
  out.push(`};`);
};

const genGoField = (field: DemField) => {
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
};
const genGo = (type: DemType, out: string[]) => {
  out.push(`struct ${type.name} {`);
  type.fields.forEach((field) => {
    out.push(`  ${genGoField(field)}`);
  });
  out.push(`};`);
};

const genRustField = (field: DemField) => {
  switch (field.type) {
    case "bool":
      return `${toSnakeCase(field.name)}: bool`;
    case "int": {
      switch (field.bits) {
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
          return `${toSnakeCase(field.name)} i${field.bits}`;
        default:
          return `${toSnakeCase(field.name)}: i32`;
      }
    }
    case "float":
      return `${toSnakeCase(field.name)}: f32`;
    case "string":
      return `${toSnakeCase(field.name)}: String`;
    default: {
      if (field.type.endsWith("[]")) {
        return `${toSnakeCase(field.name)}: Vec<${field.type.slice(0, -2)}>`;
      } else {
        return `${toSnakeCase(field.name)}: ${field.type}`;
      }
    }
  }
};
const genRust = (type: DemType, out: string[]) => {
  out.push(`pub struct ${type.name} {`);
  type.fields.forEach((field) => {
    out.push(`  pub ${genRustField(field)},`);
  });
  out.push(`}`);
};

const genZigField = (field: DemField) => {
  switch (field.type) {
    case "bool":
      return `${toSnakeCase(field.name)}: bool`;
    case "int": {
      switch (field.bits) {
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
          return `${toSnakeCase(field.name)}: i${field.bits}`;
        default:
          return `${toSnakeCase(field.name)}: i32`;
      }
    }
    case "float":
      return `${toSnakeCase(field.name)}: f32`;
    case "string":
      return `${toSnakeCase(field.name)}: []const u8`;
    default: {
      if (field.type.endsWith("[]")) {
        return `${toSnakeCase(field.name)}: []${field.type.slice(0, -2)}`;
      } else {
        return `${toSnakeCase(field.name)}: ${toSnakeCase(field.type)}`;
      }
    }
  }
};
const genZig = (type: DemType, out: string[]) => {
  out.push(`const ${type.name} = struct {`);
  type.fields.forEach((field) => {
    out.push(`  ${genZigField(field)},`);
  });
  out.push(`};`);
};

const generators: [(type: DemType, out: string[]) => void, string, string][] = [
  [genOverview, "Overview", "overview"],
  [genC, "C", "c"],
  [genCpp, "C++", "cpp"],
  [genCsharp, "C#", "csharp"],
  [genJS, "JS", "js"],
  [genTS, "TS", "ts"],
  [genGo, "Go", "go"],
  [genRust, "Rust", "rust"],
  [genZig, "Zig", "zig"],
];

const dem = JSON.parse(await Deno.readTextFile(".dem.json")) as Dem;

const { mappings } = JSON.parse(await Deno.readTextFile(".dem.map.json")) as {
  mappings: { name: string; path: string; generate?: boolean }[];
};

for (const { name, path, generate } of mappings) {
  if (!generate) {
    continue;
  }

  const content = (await Deno.readTextFile(path)).split("\n");

  // TODO: Switch to mdx v2 comments when Docusaurus v3 comes out

  const start = content.indexOf(`<!-- @dem-gen-begin:${name} -->}`);
  const end = content.indexOf(`<!-- @dem-gen-end:${name} -->}`);
  if (start === -1 || end === -1) {
    console.warn(`Missing begin-end markers in ${path} : ${start} - ${end}`);
    continue;
  }

  const demType = dem.types.find((type) => type.name === name);
  if (!demType) {
    console.warn(`Found missing type: ${name}`);
    continue;
  }

  const out: string[] = [];
  out.push(`import Tabs from '@theme/Tabs';`);
  out.push(`import TabItem from '@theme/TabItem';`);
  out.push(`<Tabs>`);
  generators.forEach(([gen, label, value]) => {
    out.push(`<TabItem value="${value}" label="${label}">`);
    out.push("");
    out.push(`\`\`\`${value}`);
    gen(demType, out);
    out.push(`\`\`\``);
    out.push("");
    out.push(`</TabItem>`);
  });
  out.push(`</Tabs>`);

  const newContent = [
    ...content.slice(0, start + 1),
    ...out,
    ...content.slice(end),
  ];

  await Deno.writeTextFile(path + "_new.mdx", newContent.join("\n"));
}
