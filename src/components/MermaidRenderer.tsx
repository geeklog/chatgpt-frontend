import mermaid from 'mermaid';
import { useEffect, useState } from 'react';

mermaid.initialize({
  startOnLoad: true
});

export default function MermaidRenderer({code}: {code: string}) {
  const [mermaidDiagram, setMermaidDiagram] = useState<any>('');
  useEffect(() => {
    const renderDiagram = async () => {
      const {svg} = await mermaid.render('mermaid-svg', String(code));
      setMermaidDiagram(svg);
    }
    renderDiagram();
  }, [code]);

  return <div className="mermaid" dangerouslySetInnerHTML={{ __html: mermaidDiagram }} />
}