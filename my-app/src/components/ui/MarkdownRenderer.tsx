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
            <h1 className="text-3xl font-bold mt-8 mb-4 bg-gradient-to-r dark:from-void-sun dark:to-void-earth from-realm-sunset to-realm-ocean bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 bg-gradient-to-r dark:from-void-purple dark:to-void-pink from-realm-ocean to-realm-grass bg-clip-text text-transparent">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium dark:text-void-star text-realm-foreground mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="dark:text-void-dust/80 text-realm-mist/80 leading-relaxed mb-4">
              {children}
            </p>
          ),
          a: ({ href, children }) => {
            const dangerousProtocols = /^javascript:|^data:|^vbscript:|^file:/i;
            const safeHref = href && !dangerousProtocols.test(href) ? href : '#';
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-void-cyan text-realm-ocean hover:dark:text-void-sun hover:text-realm-sunset underline transition-colors duration-300"
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside dark:text-void-dust/80 text-realm-mist/80 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside dark:text-void-dust/80 text-realm-mist/80 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="dark:text-void-dust/80 text-realm-mist/80">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 dark:border-void-purple/50 border-realm-sky/50 pl-4 py-2 my-4 dark:bg-void-purple/5 bg-realm-sky/5 rounded-r-lg italic dark:text-void-dust/70 text-realm-mist/70">
              {children}
            </blockquote>
          ),
          code: (props: any) => {
            const { children, className } = props;
            const isInline = !className;
            if (isInline) {
              return (
                <code className="dark:bg-void-deeper/50 bg-realm-sky/20 px-2 py-1 rounded dark:text-void-cyan text-realm-ocean text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block dark:bg-void-deeper/50 bg-realm-sky/20 p-4 rounded-lg dark:text-void-cyan text-realm-ocean text-sm font-mono overflow-x-auto">
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
            <hr className="dark:border-void-purple/20 border-realm-sky/20 my-8" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border dark:border-void-purple/20 border-realm-sky/20 px-4 py-2 dark:bg-void-purple/10 bg-realm-sky/10 dark:text-void-star text-realm-foreground font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border dark:border-void-purple/20 border-realm-sky/20 px-4 py-2 dark:text-void-dust/80 text-realm-mist/80">
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
