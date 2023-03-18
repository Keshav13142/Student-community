import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import CodeMirror from "@uiw/react-codemirror";

const MarkdownEditor = ({ onChange, value }) => {
  return (
    <CodeMirror
      value={value}
      minHeight="30vh"
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
      ]}
      onChange={onChange}
      className="border border-slate-300"
    />
  );
};

export default MarkdownEditor;
