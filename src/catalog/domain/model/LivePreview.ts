export interface ILivePreview {
  link: string;
  name: string;
  enabled: boolean;
  version: string;
}

export class LivePreview implements ILivePreview {
  private _link: string = "";
  private _name: string = "";
  private _enabled: boolean = false;
  private _version: string = "";

  constructor(props?: ILivePreview | undefined) {
    if (props) {
      this._link = props.link;
      this._name = props.name;
      this._enabled = props.enabled;
      this._version = props.version;
    }
  }

  public raw(): ILivePreview {
    return {
      enabled: this._enabled,
      link: this._link,
      name: this._name,
      version: this._version,
    };
  }

  public set link(val: any) {
    this._link = val;
  }
  public set name(val: any) {
    this._name = val;
  }
  public set enabled(val: any) {
    this._enabled = val;
  }
  
  public set version(val: any) {
    this._version = val;
  }
  public get link() {
    return this._link;
  }
  public get name() {
    return this._name;
  }
  public get enabled() {
    return this._enabled;
  }
  public get version() {
    return this._version;
  }
}
