// import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { FunctionComponent } from "react";
import { render } from "react-dom";

interface RootProps {}

(async () => {  
  const Root: FunctionComponent<RootProps> = (props: any) => {
    return (
      <div>React</div>
    );
  };
  render(<Root />, document.getElementById("root") as HTMLElement);
})();
