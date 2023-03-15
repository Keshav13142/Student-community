import { synthWave } from "@/utils/theme";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

const RenderMarkdown = ({ content }) => {
  return (
    <ReactMarkdown
      className="max-w-[85vw] lg:max-w-[60vw] xl:min-w-[50vw] 2xl:min-w-[45vw]"
      rehypePlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              wrapLines
              style={synthWave}
              showLineNumbers
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
