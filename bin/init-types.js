import constant from '#constant.js';
import _ from 'lodash'
import fss from 'node:fs'
import fsa from 'node:fs/promises'

const file_doc = constant.PATH.SRC + '/@types/document.d.ts';
const file_model = constant.PATH.SRC + '/@types/model.d.ts'

function schema2type(schema, Name, level = 1) {
  let text = '';
  const pad = ''.padStart(level * 2, ' ');
  if (schema.type === 'Object') {
    if (_.isEmpty(schema.properties)) {
      return 'object'
    } else {
      for (let k in schema.properties) {
        text += pad + k + ': ' + schema2type(schema.properties[k], '', level + 1) + ';\n'
      }
      if (Name.startsWith('Resource')) {
        text += '  chapters?: IMediaChapter[];\n'
        text += '  images?: IMediaImage[];\n'
        text += '  videos?: IMediaVideo[];\n'
        text += '  audios?: IMediaAudio[];\n'
        text += '  actors?: any[];\n'
        text += '  counter?: { [key: string]: number };\n'
      }
    }
  } else if (schema.type === 'String') {
    return 'string';
  } else if (schema.type === 'Number') {
    return 'number';
  } else if (schema.type === 'Date') {
    return 'Date';
  } else if (schema.type === 'Boolean') {
    return 'boolean';
  } else if (schema.type === 'Mixed') {
    return 'object';
  } else if (schema.type === 'Array') {
    return schema2type(schema.items[0], '', level + 1) + '[]';
  }
  return `{\n${text.trimEnd()}\n${''.padStart((level - 1) * 2, ' ')}}${level === 1 ? '\n' : ''}`;
}

export function initTypes(schemas) {
  fss.writeFileSync(file_doc, '', { encoding: 'utf-8' })
  fss.writeFileSync(file_model, `
import mongoose from "mongoose";
import Base, { CustomParams } from 'schema/dist/base.js';
import MJsonSchema from 'schema/dist/database/schema/JsonSchema.js'
import MConnection from 'schema/dist/database/schema/connection.js'
import { IJsonSchema, IConnection } from 'schema/dist/@types/schema.js'

declare class MJsonSchema extends Base<IJsonSchema> {
  constructor(db: mongoose.Connection, params?: CustomParams<IJsonSchema>);
}

declare class MConnection extends Base<IConnection> {
  constructor(db: mongoose.Connection, params?: CustomParams<IConnection>);
}

`, { encoding: 'utf-8' })
  // 导入所有IDocument
  fss.writeFileSync(file_model, `import { ${schemas.map(s => s.name.replace(/^M/, 'I')).join(', ')} } from './document.d.js';\n`, { encoding: 'utf8', flag: 'a' })

  for (let i = 0; i < schemas.length; i++) {
    const doc = schemas[i];
    const Name = doc.name.replace(/^M/, '');
    fss.writeFileSync(file_doc, `export interface I${Name} ${schema2type(doc.schema, Name)}`, { flag: 'a', encoding: 'utf-8' })
    fss.writeFileSync(file_model, `
declare class M${Name} extends Base<I${Name}> {
  constructor(db: mongoose.Connection, params?: CustomParams<I${Name}>);
}
`, { flag: 'a', encoding: 'utf-8' })
  };
  // 导出所有MModel
  fss.writeFileSync(file_model, `export { MJsonSchema, MConnection, ${schemas.map(s => s.name).join(', ')} }\n`, { encoding: 'utf8', flag: 'a' })
}