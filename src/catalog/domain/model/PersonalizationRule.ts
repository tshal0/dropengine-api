export interface IPersonalizationRule {
  name: string;
  type: string;
  label: string;
  options: string;
  pattern: string;
  required: boolean;
  maxLength: number;
  placeholder: string;
}
export class PersonalizationRule implements IPersonalizationRule {
  private _name: string = "";
  private _type: string = "";
  private _label: string = "";
  private _options: string = "";
  private _pattern: string = "";
  private _required: boolean = false;
  private _maxLength: number = 0;
  private _placeholder: string = "";

  constructor(props?: IPersonalizationRule | undefined) {
    if (props) {
      this._name = props.name;
      this._type = props.type;
      this._label = props.label;
      this._options = props.options;
      this._pattern = props.pattern;
      this._required = props.required;
      this._maxLength = props.maxLength;
      this._placeholder = props.placeholder;
    }
  }

  public raw(): IPersonalizationRule {
    return {
      name: this._name,
      type: this._type,
      label: this._label,
      options: this._options,
      pattern: this._pattern,
      required: this._required,
      maxLength: this._maxLength,
      placeholder: this._placeholder,
    };
  }

  public set name(val: any) {
    this._name = val;
  }
  public set type(val: any) {
    this._type = val;
  }
  public set label(val: any) {
    this._label = val;
  }
  public set options(val: any) {
    this._options = val;
  }
  public set pattern(val: any) {
    this._pattern = val;
  }
  public set required(val: any) {
    this._required = val;
  }
  public set maxLength(val: any) {
    this._maxLength = val;
  }
  public set placeholder(val: any) {
    this._placeholder = val;
  }

  public get name() {
    return this._name;
  }
  public get type() {
    return this._type;
  }
  public get label() {
    return this._label;
  }
  public get options() {
    return this._options;
  }
  public get pattern() {
    return this._pattern;
  }
  public get required() {
    return this._required;
  }
  public get maxLength() {
    return this._maxLength;
  }
  public get placeholder() {
    return this._placeholder;
  }
}
