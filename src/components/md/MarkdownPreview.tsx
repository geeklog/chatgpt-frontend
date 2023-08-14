import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'

import { Box, Button, Tag } from '@chakra-ui/react';
import CopyButton from '../accessories/CopyButton';
import './MarkdownPreview.css';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import MermaidRenderer from './MermaidRenderer';
import Prompt from '../chat/Prompt';

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('scss', scss)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('python', python)

function MarkdownPreview({markdown}: {markdown: string}) {
  const syntaxTheme = oneDark
  
  const MarkdownComponents: object = Object.assign({}, ChakraUIRenderer(), {
    div({node, inline, className, children, ...props}: any) {
      if (className === 'prompt') {
        return <Prompt label="PROMPT">{String(children)}</Prompt>
      } else {
        return <div>{String(children)}</div>
      }
    },
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match? match[1]: null;
      if (language === 'mermaid' || String(children).startsWith('graph ')) {
        return (
          <div className="mermaid">
            <CopyButton text={children}/>
            <MermaidRenderer code={children} />
          </div>
        );
      }
      return !inline ? (
        <Box maxW={680} pos='relative'>
          <CopyButton text={children}/>
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, '')}
            style={syntaxTheme}
            language={match? match[1]: null}
            PreTag="div"
            {...props}
          />
        </Box>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  });

  return (
    <ReactMarkdown
      className='md-preview'
      components={MarkdownComponents}
      children={markdown}
      skipHtml={false}
      rehypePlugins={[rehypeRaw]}
    />
  )
}

export default MarkdownPreview;