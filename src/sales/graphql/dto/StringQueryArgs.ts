export class StringQueryArgs {
  constructor(props?: StringQueryArgs | undefined) {
    if (props) {
      this.eq = props.eq;
      this.ne = props.ne;
      this.in = props.in;
      this.nin = props.nin;
    }
  }
  eq: string;
  ne: string;
  in: string[];
  nin: string[];
}
