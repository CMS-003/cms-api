export interface IRecord {
  _id: string;
  spider_id: string;
  source_id: string;
  origin: string;
  original: { [key: string]: any };
}
export interface IQuery {
  _id: string;
  title: string;
  value: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}
export interface IComponent {
  _id: string;
  project_id: string;
  template_id: string;
  parent_id: string;
  tree_id: string;
  name: string;
  type: string;
  title: string;
  desc: string;
  cover: string;
  icon: string;
  status: number;
  accepts: string[];
  order: number;
  widget: {
    field: string;
    value: object;
    type: string;
    refer: {
      label: string;
      value: string;
    };
    action: string;
    method: string;
    query: boolean;
    source: string;
  };
  url: string;
  resources: {
      _id: string;
      title: string;
      poster: string;
    }[];
  attrs: { [key: string]: any };
  style: { [key: string]: any };
  createdAt: Date;
  updatedAt: Date;
  queries: string[];
  children: IComponent[];
}
export interface ICapsule {
  _id: string;
  name: string;
  type: string;
  avatar: string;
  pass: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}
export interface ICounter {
  _id: string;
  resource_id: string;
  resource_type: string;
  views: number;
  comments: number;
  followings: number;
  followers: number;
  subscribers: number;
  shares: number;
  stars: number;
  likes: number;
  dislikes: number;
}
export interface ITask {
  _id: string;
  name: string;
  type: string;
  proxy: boolean;
  url: string;
  filepath: string;
  params: { [key: string]: any };
  header: { [key: string]: any };
  status: number;
  transcode: number;
  retries: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface IVerification {
  _id: string;
  method: string;
  type: number;
  code: string;
  content: string;
  user_id: string;
  receiver: string;
  createdAt: Date;
  expiredAt: Date;
  status: number;
}
export interface ISchedule {
  _id: string;
  cron: string;
  name: string;
  desc: string;
  status: number;
  script: string;
  createdAt: Date;
}
export interface IInterface {
  _id: string;
  name: string;
  desc: string;
  method: string;
  status: number;
  script: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ISpider {
  _id: string;
  name: string;
  desc: string;
  proxy: boolean;
  from: string;
  headers: { [key: string]: any };
  script: string;
  urls: {
      url: string;
      enabled: boolean;
      _id: boolean;
    }[];
  pattern: string;
  status: number;
  createdAt: Date;
  toJSON(): object;
  getParams(url: string): { [key:string]: any };
  getPureUrl(url: string): string;
  getResourceId(id: string): string;
}
export interface IStar {
  _id: string;
  uid: string;
  title: string;
  cover: string;
  rid: string;
  type: string;
  createdAt: Date;
}
export interface IFeedback {
  _id: string;
  resource_id: string;
  resource_title: string;
  content: string;
  comment: string;
  user_id: string;
  status: number;
  createdAt: Date;
}
export interface IUser {
  _id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  pass: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}
export interface IResource {
  _id: string;
  type: number;
  title: string;
  content: string;
  desc: string;
  tags: string[];
  uid: string;
  uname: string;
  status: number;
  publishedAt: Date;
  country: string;
  lang: string;
  cspn: string;
  types: string[];
  poster: string;
  thumbnail: string;
  alias: string[];
  createdAt: Date;
  updatedAt: Date;
  size: number;
  series: string;
  actors: {
      _id: string;
      name: string;
    }[];
  origin: string;
  chapters?: IMediaChapter[];
  images?: IMediaImage[];
  videos?: IMediaVideo[];
  audios?: IMediaAudio[];
  actors?: any[];
  counter?: { [key: string]: number | boolean };
}
export interface IMediaChapter {
  _id: string;
  uid: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  content: string;
  url: string;
  path: string;
  status: number;
  nth: number;
  createdAt: Date;
  updatedAt: Date;
  more: { [key: string]: any };
}
export interface IMediaAlbum {
  _id: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  more: { [key: string]: any };
}
export interface IMediaImage {
  _id: string;
  uid: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  more: { [key: string]: any };
}
export interface IMediaVideo {
  _id: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  more: { [key: string]: any };
}
export interface IMediaPixiv {
  _id: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  more: { [key: string]: any };
  uid: string;
}
export interface IMediaCaption {
  _id: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  more: { [key: string]: any };
}
export interface IVersion {
  _id: string;
  app: string;
  name: string;
  desc: string;
  path: string;
  verson: string;
  status: number;
  createdAt: Date;
}
export interface IAccount {
  _id: string;
  user_id: string;
  name: string;
  account: string;
  email: string;
  phone: string;
  mark: string;
  status: number;
  weight: number;
  createdAt: Date;
  updateedAt: Date;
  password: {
      pass: string;
      time: number;
      status: number;
    }[];
  deletedAt: Date;
}
export interface IConfig {
  _id: string;
  project_id: string;
  type: string;
  title: string;
  desc: string;
  order: number;
  value: { [key: string]: any };
  createdAt: Date;
  updatedAt: Date;
}
export interface IPass {
  _id: string;
  aid: string;
  password: string;
  createdAt: Date;
  updateedAt: Date;
}
export interface IMediaAudio {
  _id: string;
  res_id: string;
  res_type: string;
  type: string;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  more: { [key: string]: any };
}
export interface IMediaSegment {
  _id: string;
  res_id: string;
  res_type: string;
  type: number;
  title: string;
  path: string;
  url: string;
  nth: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  more: { [key: string]: any };
}
export interface IResourceDemo {
  _id: string;
  type: string;
  title: string;
  content: string;
  desc: string;
  tags: string[];
  uid: string;
  uname: string;
  status: number;
  publishedAt: Date;
  country: string;
  lang: string;
  cspn: string;
  types: string[];
  poster: string;
  thumbnail: string;
  alias: string[];
  createdAt: Date;
  updatedAt: Date;
  size: number;
  chapters?: IMediaChapter[];
  images?: IMediaImage[];
  videos?: IMediaVideo[];
  audios?: IMediaAudio[];
  actors?: any[];
  counter?: { [key: string]: number | boolean };
}
export interface ILog {
  _id: string;
  project_id: string;
  type: string;
  group: string;
  content: string;
  createdAt: Date;
}
export interface ISns {
  _id: string;
  user_id: string;
  sns_id: string;
  sns_type: string;
  nickname: string;
  avatar: string;
  detail: { [key: string]: any };
  status: number;
  createdAt: Date;
  access_token: string;
  refresh_token: string;
  access_expired_at: Date;
  refresh_expired_at: Date;
}
export interface IComponentType {
  _id: string;
  title: string;
  name: string;
  cover: string;
  group: string;
  status: number;
  accepts: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
  level: number;
}
export interface IProject {
  _id: string;
  title: string;
  name: string;
  cover: string;
  desc: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ITemplate {
  _id: string;
  project_id: string;
  name: string;
  type: string;
  title: string;
  cover: string;
  path: string;
  desc: string;
  status: number;
  order: number;
  attrs: { [key: string]: any };
  style: { [key: string]: any };
  createdAt: Date;
  updatedAt: Date;
}
export interface IFollow {
  _id: string;
  followee_id: string;
  follower_id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IHistory {
  _id: string;
  user_id: string;
  resource_id: string;
  resource_type: string;
  media_id: string;
  media_type: string;
  total: number;
  watched: number;
  ip: string;
  device: string;
  created_at: Date;
}
export interface IStat {
  _id: string;
  user_id: string;
  type: number;
  resource_id: string;
  resource_type: string;
  created_at: Date;
}
