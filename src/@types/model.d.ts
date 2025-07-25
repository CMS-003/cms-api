
import mongoose from "mongoose";
import { Base, CustomParams, MConnection, MJsonSchema } from 'schema';
import { IJsonSchema, IConnection } from 'schema/dist/@types'

declare class MJsonSchema extends Base<IJsonSchema> {
  constructor(db: mongoose.Connection, params?: CustomParams<IJsonSchema>);
}

declare class MConnection extends Base<IConnection> {
  constructor(db: mongoose.Connection, params?: CustomParams<IConnection>);
}

import { IRecord, IQuery, IComponent, ICapsule, ICounter, ITask, IVerification, ISchedule, IInterface, ISpider, IStar, IFeedback, IUser, IResource, IMediaChapter, IMediaAlbum, IMediaImage, IMediaVideo, IMediaPixiv, IMediaCaption, IVersion, IAccount, IConfig, IPass, IMediaAudio, IMediaSegment, IResourceDemo, ILog, ISns, IComponentType, IProject, ITemplate, IFollow, IHistory, IStat } from './document.d.js';

declare class MRecord extends Base<IRecord> {
  constructor(db: mongoose.Connection, params?: CustomParams<IRecord>);
}

declare class MQuery extends Base<IQuery> {
  constructor(db: mongoose.Connection, params?: CustomParams<IQuery>);
}

declare class MComponent extends Base<IComponent> {
  constructor(db: mongoose.Connection, params?: CustomParams<IComponent>);
}

declare class MCapsule extends Base<ICapsule> {
  constructor(db: mongoose.Connection, params?: CustomParams<ICapsule>);
}

declare class MCounter extends Base<ICounter> {
  constructor(db: mongoose.Connection, params?: CustomParams<ICounter>);
}

declare class MTask extends Base<ITask> {
  constructor(db: mongoose.Connection, params?: CustomParams<ITask>);
}

declare class MVerification extends Base<IVerification> {
  constructor(db: mongoose.Connection, params?: CustomParams<IVerification>);
}

declare class MSchedule extends Base<ISchedule> {
  constructor(db: mongoose.Connection, params?: CustomParams<ISchedule>);
}

declare class MInterface extends Base<IInterface> {
  constructor(db: mongoose.Connection, params?: CustomParams<IInterface>);
}

declare class MSpider extends Base<ISpider> {
  constructor(db: mongoose.Connection, params?: CustomParams<ISpider>);
}

declare class MStar extends Base<IStar> {
  constructor(db: mongoose.Connection, params?: CustomParams<IStar>);
}

declare class MFeedback extends Base<IFeedback> {
  constructor(db: mongoose.Connection, params?: CustomParams<IFeedback>);
}

declare class MUser extends Base<IUser> {
  constructor(db: mongoose.Connection, params?: CustomParams<IUser>);
}

declare class MResource extends Base<IResource> {
  constructor(db: mongoose.Connection, params?: CustomParams<IResource>);
}

declare class MMediaChapter extends Base<IMediaChapter> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaChapter>);
}

declare class MMediaAlbum extends Base<IMediaAlbum> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaAlbum>);
}

declare class MMediaImage extends Base<IMediaImage> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaImage>);
}

declare class MMediaVideo extends Base<IMediaVideo> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaVideo>);
}

declare class MMediaPixiv extends Base<IMediaPixiv> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaPixiv>);
}

declare class MMediaCaption extends Base<IMediaCaption> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaCaption>);
}

declare class MVersion extends Base<IVersion> {
  constructor(db: mongoose.Connection, params?: CustomParams<IVersion>);
}

declare class MAccount extends Base<IAccount> {
  constructor(db: mongoose.Connection, params?: CustomParams<IAccount>);
}

declare class MConfig extends Base<IConfig> {
  constructor(db: mongoose.Connection, params?: CustomParams<IConfig>);
}

declare class MPass extends Base<IPass> {
  constructor(db: mongoose.Connection, params?: CustomParams<IPass>);
}

declare class MMediaAudio extends Base<IMediaAudio> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaAudio>);
}

declare class MMediaSegment extends Base<IMediaSegment> {
  constructor(db: mongoose.Connection, params?: CustomParams<IMediaSegment>);
}

declare class MResourceDemo extends Base<IResourceDemo> {
  constructor(db: mongoose.Connection, params?: CustomParams<IResourceDemo>);
}

declare class MLog extends Base<ILog> {
  constructor(db: mongoose.Connection, params?: CustomParams<ILog>);
}

declare class MSns extends Base<ISns> {
  constructor(db: mongoose.Connection, params?: CustomParams<ISns>);
}

declare class MComponentType extends Base<IComponentType> {
  constructor(db: mongoose.Connection, params?: CustomParams<IComponentType>);
}

declare class MProject extends Base<IProject> {
  constructor(db: mongoose.Connection, params?: CustomParams<IProject>);
}

declare class MTemplate extends Base<ITemplate> {
  constructor(db: mongoose.Connection, params?: CustomParams<ITemplate>);
}

declare class MFollow extends Base<IFollow> {
  constructor(db: mongoose.Connection, params?: CustomParams<IFollow>);
}

declare class MHistory extends Base<IHistory> {
  constructor(db: mongoose.Connection, params?: CustomParams<IHistory>);
}

declare class MStat extends Base<IStat> {
  constructor(db: mongoose.Connection, params?: CustomParams<IStat>);
}
export { MJsonSchema, MConnection, MRecord, MQuery, MComponent, MCapsule, MCounter, MTask, MVerification, MSchedule, MInterface, MSpider, MStar, MFeedback, MUser, MResource, MMediaChapter, MMediaAlbum, MMediaImage, MMediaVideo, MMediaPixiv, MMediaCaption, MVersion, MAccount, MConfig, MPass, MMediaAudio, MMediaSegment, MResourceDemo, MLog, MSns, MComponentType, MProject, MTemplate, MFollow, MHistory, MStat }
