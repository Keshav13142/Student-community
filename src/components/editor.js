import { useColorMode } from "@chakra-ui/react";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import CodeMirror from "@uiw/react-codemirror";

const MarkdownEditor = ({ onChange, value }) => {
	const { colorMode } = useColorMode();
	return (
		<CodeMirror
			{...(colorMode === "dark" ? { theme: tokyoNight } : {})}
			value={value}
			minHeight="30dvh"
			maxHeight="55dvh"
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
