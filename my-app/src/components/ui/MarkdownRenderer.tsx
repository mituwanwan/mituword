import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-cosmic-star mt-8 mb-4 bg-gradient-to-r from-cosmic-sun to-cosmic-earth bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-cosmic-star mt-6 mb-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium text-cosmic-star mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-cosmic-dust/80 leading-relaxed mb-4">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-cyan hover:text-cosmic-sun underline transition-colors duration-300"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-cosmic-dust/80 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-cosmic-dust/80 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-cosmic-dust/80">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cosmic-purple/50 pl-4 py-2 my-4 bg-cosmic-purple/5 rounded-r-lg italic text-cosmic-dust/70">
              {children}
            </blockquote>
          ),
          code: (props: any) => {
            const { children, className } = props;
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-cosmic-deeper/50 px-2 py-1 rounded text-cosmic-cyan text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-cosmic-deeper/50 p-4 rounded-lg text-cosmic-cyan text-sm font-mono overflow-x-auto">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4">{children}</pre>
          ),
          img: ({ src, alt }) => (
            <Image
              src={src || ""}
              alt={alt || ""}
              width={800}
              height={450}
              className="rounded-lg my-6 w-full max-w-2xl mx-auto shadow-glow"
            />
          ),
          hr: () => (
            <hr className="border-cosmic-purple/20 my-8" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-cosmic-purple/20 px-4 py-2 bg-cosmic-purple/10 text-cosmic-star font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-cosmic-purple/20 px-4 py-2 text-cosmic-dust/80">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
