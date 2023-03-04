import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown'
import { Box } from '@chakra-ui/react';
import CopyButton from './CopyButton';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('scss', scss)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('json', json)

function MarkdownPreview({markdown}: {markdown: string}) {
  const syntaxTheme = oneDark
  
  const MarkdownComponents: object = Object.assign({}, ChakraUIRenderer(), {
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '')
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
      skipHtml
    />
  )
}

export default MarkdownPreview;