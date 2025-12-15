import { WireType } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
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
            { no: 1, name: "_id", kind: "scalar", localName: "_id", opt: true, T: 9 /*ScalarType.STRING*/ },
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
                case /* optional string _id */ 1:
                    message._id = reader.string();
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
        /* optional string _id = 1; */
        if (message._id !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message._id);
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
            { no: 1, name: "_id", kind: "scalar", localName: "_id", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "template_id", kind: "scalar", localName: "template_id", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "project_id", kind: "scalar", localName: "project_id", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "parent_id", kind: "scalar", localName: "parent_id", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "tree_id", kind: "scalar", localName: "tree_id", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "title", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "name", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "icon", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "cover", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "desc", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "order", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 13, name: "status", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "createdAt", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "updatedAt", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 16, name: "style", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 17, name: "attrs", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
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
                case /* optional string _id */ 1:
                    message._id = reader.string();
                    break;
                case /* optional string type */ 2:
                    message.type = reader.string();
                    break;
                case /* optional string template_id */ 3:
                    message.template_id = reader.string();
                    break;
                case /* optional string project_id */ 4:
                    message.project_id = reader.string();
                    break;
                case /* optional string parent_id */ 5:
                    message.parent_id = reader.string();
                    break;
                case /* optional string tree_id */ 6:
                    message.tree_id = reader.string();
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
                case /* optional string style */ 16:
                    message.style = reader.string();
                    break;
                case /* optional string attrs */ 17:
                    message.attrs = reader.string();
                    break;
                case /* Widget widget */ 18:
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
        /* optional string _id = 1; */
        if (message._id !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message._id);
        /* optional string type = 2; */
        if (message.type !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.type);
        /* optional string template_id = 3; */
        if (message.template_id !== undefined)
            writer.tag(3, WireType.LengthDelimited).string(message.template_id);
        /* optional string project_id = 4; */
        if (message.project_id !== undefined)
            writer.tag(4, WireType.LengthDelimited).string(message.project_id);
        /* optional string parent_id = 5; */
        if (message.parent_id !== undefined)
            writer.tag(5, WireType.LengthDelimited).string(message.parent_id);
        /* optional string tree_id = 6; */
        if (message.tree_id !== undefined)
            writer.tag(6, WireType.LengthDelimited).string(message.tree_id);
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
        /* optional string style = 16; */
        if (message.style !== undefined)
            writer.tag(16, WireType.LengthDelimited).string(message.style);
        /* optional string attrs = 17; */
        if (message.attrs !== undefined)
            writer.tag(17, WireType.LengthDelimited).string(message.attrs);
        /* Widget widget = 18; */
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
// @generated message type with reflection information, may provide speed optimized methods
class Response$Type extends MessageType {
    constructor() {
        super("Response", [
            { no: 1, name: "code", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "message", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "data", kind: "message", T: () => ComponentNode }
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
                case /* optional int32 code */ 1:
                    message.code = reader.int32();
                    break;
                case /* optional string message */ 2:
                    message.message = reader.string();
                    break;
                case /* optional ComponentNode data */ 3:
                    message.data = ComponentNode.internalBinaryRead(reader, reader.uint32(), options, message.data);
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
        /* optional int32 code = 1; */
        if (message.code !== undefined)
            writer.tag(1, WireType.Varint).int32(message.code);
        /* optional string message = 2; */
        if (message.message !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.message);
        /* optional ComponentNode data = 3; */
        if (message.data)
            ComponentNode.internalBinaryWrite(message.data, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Response
 */
export const Response = new Response$Type();
