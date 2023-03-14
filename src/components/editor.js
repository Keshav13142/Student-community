import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import CodeMirror from "@uiw/react-codemirror";

const MarkdownEditor = ({ onChange, value }) => {
  return (
    <CodeMirror
      value={value}
      minHeight="50vh"
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
      ]}
      onChange={onChange}
      className="max-w-[85vw] border border-slate-300 lg:max-w-[60vw] xl:min-w-[50vw] 2xl:min-w-[40vw]"
    />
  );
};

export default MarkdownEditor;
