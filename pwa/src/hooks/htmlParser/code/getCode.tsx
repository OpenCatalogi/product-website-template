import * as styles from "./getCode.module.css";
import { Code, CodeBlock } from "@utrecht/component-library-react/dist/css-module";
import { domToReact } from "html-react-parser";

export const getCode = (name: string, props: any, children: any, options: any) => {
  switch (name) {
    case "code":
      return (
        <Code className={styles.inlineCode} {...props}>
          {domToReact(children, options)}
        </Code>
      );
    case "pre":
      return <CodeBlock {...props}>{domToReact(children, options)}</CodeBlock>;
  }
};
