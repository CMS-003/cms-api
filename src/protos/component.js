import { WireType } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
// @generated message type with reflection information, may provide speed optimized methods
class Value$Type extends MessageType {
    constructor() {
        super("Value", [
            { no: 1, name: "string_value", kind: "scalar", oneof: "kind", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "number_value", kind: "scalar", oneof: "kind", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "bool_value", kind: "scalar", oneof: "kind", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "object_value", kind: "message", oneof: "kind", T: () => Object },
            { no: 5, name: "array_value", kind: "message", oneof: "kind", T: () => Array$ },
            { no: 6, name: "null_value", kind: "scalar", oneof: "kind", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.kind = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string string_value */ 1:
                    message.kind = {
                        oneofKind: "stringValue",
                        stringValue: reader.string()
                    };
                    break;
                case /* double number_value */ 2:
                    message.kind = {
                        oneofKind: "numberValue",
                        numberValue: reader.double()
                    };
                    break;
                case /* bool bool_value */ 3:
                    message.kind = {
                        oneofKind: "boolValue",
                        boolValue: reader.bool()
                    };
                    break;
                case /* Object object_value */ 4:
                    message.kind = {
                        oneofKind: "objectValue",
                        objectValue: Object.internalBinaryRead(reader, reader.uint32(), options, message.kind.objectValue)
                    };
                    break;
                case /* Array array_value */ 5:
                    message.kind = {
                        oneofKind: "arrayValue",
                        arrayValue: Array$.internalBinaryRead(reader, reader.uint32(), options, message.kind.arrayValue)
                    };
                    break;
                case /* bool null_value */ 6:
                    message.kind = {
                        oneofKind: "nullValue",
                        nullValue: reader.bool()
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string string_value = 1; */
        if (message.kind.oneofKind === "stringValue")
            writer.tag(1, WireType.LengthDelimited).string(message.kind.stringValue);
        /* double number_value = 2; */
        if (message.kind.oneofKind === "numberValue")
            writer.tag(2, WireType.Bit64).double(message.kind.numberValue);
        /* bool bool_value = 3; */
        if (message.kind.oneofKind === "boolValue")
            writer.tag(3, WireType.Varint).bool(message.kind.boolValue);
        /* Object object_value = 4; */
        if (message.kind.oneofKind === "objectValue")
            Object.internalBinaryWrite(message.kind.objectValue, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* Array array_value = 5; */
        if (message.kind.oneofKind === "arrayValue")
            Array$.internalBinaryWrite(message.kind.arrayValue, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* bool null_value = 6; */
        if (message.kind.oneofKind === "nullValue")
            writer.tag(6, WireType.Varint).bool(message.kind.nullValue);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Value
 */
export const Value = new Value$Type();
// @generated message type with reflection information, may provide speed optimized methods
class KvPair$Type extends MessageType {
    constructor() {
        super("KvPair", [
            { no: 1, name: "label", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.label = "";
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string label */ 1:
                    message.label = reader.string();
                    break;
                case /* string value */ 2:
                    message.value = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string label = 1; */
        if (message.label !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.label);
        /* string value = 2; */
        if (message.value !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message KvPair
 */
export const KvPair = new KvPair$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Object$Type extends MessageType {
    constructor() {
        super("Object", [
            { no: 1, name: "fields", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => Value } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.fields = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<string, Value> fields */ 1:
                    this.binaryReadMap1(message.fields, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap1(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = Value.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for Object.fields");
            }
        }
        map[key ?? ""] = val ?? Value.create();
    }
    internalBinaryWrite(message, writer, options) {
        /* map<string, Value> fields = 1; */
        for (let k of globalThis.Object.keys(message.fields)) {
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            Value.internalBinaryWrite(message.fields[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Object
 */
export const Object = new Object$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Array$$Type extends MessageType {
    constructor() {
        super("Array", [
            { no: 1, name: "values", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => Value }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.values = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated Value values */ 1:
                    message.values.push(Value.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated Value values = 1; */
        for (let i = 0; i < message.values.length; i++)
            Value.internalBinaryWrite(message.values[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Array
 */
export const Array$ = new Array$$Type();
// @generated message type with reflection information, may provide speed optimized methods
class JSONString$Type extends MessageType {
    constructor() {
        super("JSONString", [
            { no: 1, name: "value", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "data", kind: "scalar", opt: true, T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string value */ 1:
                    message.value = reader.string();
                    break;
                case /* optional bytes data */ 2:
                    message.data = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* optional string value = 1; */
        if (message.value !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.value);
        /* optional bytes data = 2; */
        if (message.data !== undefined)
            writer.tag(2, WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message JSONString
 */
export const JSONString = new JSONString$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Widget$Type extends MessageType {
    constructor() {
        super("Widget", [
            { no: 1, name: "field", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "query", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ },
            { no: 5, name: "source", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "refer", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => KvPair },
            { no: 7, name: "action", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "method", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.refer = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string field */ 1:
                    message.field = reader.string();
                    break;
                case /* optional string value */ 2:
                    message.value = reader.string();
                    break;
                case /* optional string type */ 3:
                    message.type = reader.string();
                    break;
                case /* optional bool query */ 4:
                    message.query = reader.bool();
                    break;
                case /* optional string source */ 5:
                    message.source = reader.string();
                    break;
                case /* repeated KvPair refer */ 6:
                    message.refer.push(KvPair.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* optional string action */ 7:
                    message.action = reader.string();
                    break;
                case /* optional string method */ 8:
                    message.method = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* optional string field = 1; */
        if (message.field !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.field);
        /* optional string value = 2; */
        if (message.value !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.value);
        /* optional string type = 3; */
        if (message.type !== undefined)
            writer.tag(3, WireType.LengthDelimited).string(message.type);
        /* optional bool query = 4; */
        if (message.query !== undefined)
            writer.tag(4, WireType.Varint).bool(message.query);
        /* optional string source = 5; */
        if (message.source !== undefined)
            writer.tag(5, WireType.LengthDelimited).string(message.source);
        /* repeated KvPair refer = 6; */
        for (let i = 0; i < message.refer.length; i++)
            KvPair.internalBinaryWrite(message.refer[i], writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* optional string action = 7; */
        if (message.action !== undefined)
            writer.tag(7, WireType.LengthDelimited).string(message.action);
        /* optional string method = 8; */
        if (message.method !== undefined)
            writer.tag(8, WireType.LengthDelimited).string(message.method);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Widget
 */
export const Widget = new Widget$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Resource$Type extends MessageType {
    constructor() {
        super("Resource", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "cover", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "poster", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "thumbnail", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "status", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string id */ 1:
                    message.id = reader.string();
                    break;
                case /* optional string title */ 2:
                    message.title = reader.string();
                    break;
                case /* optional string cover */ 3:
                    message.cover = reader.string();
                    break;
                case /* optional string poster */ 4:
                    message.poster = reader.string();
                    break;
                case /* optional string thumbnail */ 5:
                    message.thumbnail = reader.string();
                    break;
                case /* optional int32 status */ 6:
                    message.status = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* optional string id = 1; */
        if (message.id !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* optional string title = 2; */
        if (message.title !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* optional string cover = 3; */
        if (message.cover !== undefined)
            writer.tag(3, WireType.LengthDelimited).string(message.cover);
        /* optional string poster = 4; */
        if (message.poster !== undefined)
            writer.tag(4, WireType.LengthDelimited).string(message.poster);
        /* optional string thumbnail = 5; */
        if (message.thumbnail !== undefined)
            writer.tag(5, WireType.LengthDelimited).string(message.thumbnail);
        /* optional int32 status = 6; */
        if (message.status !== undefined)
            writer.tag(6, WireType.Varint).int32(message.status);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Resource
 */
export const Resource = new Resource$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ComponentNode$Type extends MessageType {
    constructor() {
        super("ComponentNode", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "template_id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "project_id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "parent_id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "tree_id", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "title", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "name", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "icon", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "cover", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "desc", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "order", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 13, name: "status", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "createdAt", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "updatedAt", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 16, name: "style", kind: "message", T: () => Value },
            { no: 17, name: "attrs", kind: "message", T: () => Value },
            { no: 18, name: "widget", kind: "message", T: () => Widget },
            { no: 19, name: "accepts", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 20, name: "url", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 21, name: "resources", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => Resource },
            { no: 22, name: "queries", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 23, name: "children", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => ComponentNode }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.accepts = [];
        message.resources = [];
        message.queries = [];
        message.children = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string id */ 1:
                    message.id = reader.string();
                    break;
                case /* optional string type */ 2:
                    message.type = reader.string();
                    break;
                case /* optional string template_id */ 3:
                    message.templateId = reader.string();
                    break;
                case /* optional string project_id */ 4:
                    message.projectId = reader.string();
                    break;
                case /* optional string parent_id */ 5:
                    message.parentId = reader.string();
                    break;
                case /* optional string tree_id */ 6:
                    message.treeId = reader.string();
                    break;
                case /* optional string title */ 7:
                    message.title = reader.string();
                    break;
                case /* optional string name */ 8:
                    message.name = reader.string();
                    break;
                case /* optional string icon */ 9:
                    message.icon = reader.string();
                    break;
                case /* optional string cover */ 10:
                    message.cover = reader.string();
                    break;
                case /* optional string desc */ 11:
                    message.desc = reader.string();
                    break;
                case /* optional int32 order */ 12:
                    message.order = reader.int32();
                    break;
                case /* optional int32 status */ 13:
                    message.status = reader.int32();
                    break;
                case /* optional string createdAt */ 14:
                    message.createdAt = reader.string();
                    break;
                case /* optional string updatedAt */ 15:
                    message.updatedAt = reader.string();
                    break;
                case /* optional Value style */ 16:
                    message.style = Value.internalBinaryRead(reader, reader.uint32(), options, message.style);
                    break;
                case /* optional Value attrs */ 17:
                    message.attrs = Value.internalBinaryRead(reader, reader.uint32(), options, message.attrs);
                    break;
                case /* optional Widget widget */ 18:
                    message.widget = Widget.internalBinaryRead(reader, reader.uint32(), options, message.widget);
                    break;
                case /* repeated string accepts */ 19:
                    message.accepts.push(reader.string());
                    break;
                case /* optional string url */ 20:
                    message.url = reader.string();
                    break;
                case /* repeated Resource resources */ 21:
                    message.resources.push(Resource.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated string queries */ 22:
                    message.queries.push(reader.string());
                    break;
                case /* repeated ComponentNode children */ 23:
                    message.children.push(ComponentNode.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* optional string id = 1; */
        if (message.id !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* optional string type = 2; */
        if (message.type !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.type);
        /* optional string template_id = 3; */
        if (message.templateId !== undefined)
            writer.tag(3, WireType.LengthDelimited).string(message.templateId);
        /* optional string project_id = 4; */
        if (message.projectId !== undefined)
            writer.tag(4, WireType.LengthDelimited).string(message.projectId);
        /* optional string parent_id = 5; */
        if (message.parentId !== undefined)
            writer.tag(5, WireType.LengthDelimited).string(message.parentId);
        /* optional string tree_id = 6; */
        if (message.treeId !== undefined)
            writer.tag(6, WireType.LengthDelimited).string(message.treeId);
        /* optional string title = 7; */
        if (message.title !== undefined)
            writer.tag(7, WireType.LengthDelimited).string(message.title);
        /* optional string name = 8; */
        if (message.name !== undefined)
            writer.tag(8, WireType.LengthDelimited).string(message.name);
        /* optional string icon = 9; */
        if (message.icon !== undefined)
            writer.tag(9, WireType.LengthDelimited).string(message.icon);
        /* optional string cover = 10; */
        if (message.cover !== undefined)
            writer.tag(10, WireType.LengthDelimited).string(message.cover);
        /* optional string desc = 11; */
        if (message.desc !== undefined)
            writer.tag(11, WireType.LengthDelimited).string(message.desc);
        /* optional int32 order = 12; */
        if (message.order !== undefined)
            writer.tag(12, WireType.Varint).int32(message.order);
        /* optional int32 status = 13; */
        if (message.status !== undefined)
            writer.tag(13, WireType.Varint).int32(message.status);
        /* optional string createdAt = 14; */
        if (message.createdAt !== undefined)
            writer.tag(14, WireType.LengthDelimited).string(message.createdAt);
        /* optional string updatedAt = 15; */
        if (message.updatedAt !== undefined)
            writer.tag(15, WireType.LengthDelimited).string(message.updatedAt);
        /* optional Value style = 16; */
        if (message.style)
            Value.internalBinaryWrite(message.style, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
        /* optional Value attrs = 17; */
        if (message.attrs)
            Value.internalBinaryWrite(message.attrs, writer.tag(17, WireType.LengthDelimited).fork(), options).join();
        /* optional Widget widget = 18; */
        if (message.widget)
            Widget.internalBinaryWrite(message.widget, writer.tag(18, WireType.LengthDelimited).fork(), options).join();
        /* repeated string accepts = 19; */
        for (let i = 0; i < message.accepts.length; i++)
            writer.tag(19, WireType.LengthDelimited).string(message.accepts[i]);
        /* optional string url = 20; */
        if (message.url !== undefined)
            writer.tag(20, WireType.LengthDelimited).string(message.url);
        /* repeated Resource resources = 21; */
        for (let i = 0; i < message.resources.length; i++)
            Resource.internalBinaryWrite(message.resources[i], writer.tag(21, WireType.LengthDelimited).fork(), options).join();
        /* repeated string queries = 22; */
        for (let i = 0; i < message.queries.length; i++)
            writer.tag(22, WireType.LengthDelimited).string(message.queries[i]);
        /* repeated ComponentNode children = 23; */
        for (let i = 0; i < message.children.length; i++)
            ComponentNode.internalBinaryWrite(message.children[i], writer.tag(23, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message ComponentNode
 */
export const ComponentNode = new ComponentNode$Type();