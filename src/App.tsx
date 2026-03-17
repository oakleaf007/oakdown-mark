/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Image as ImageIcon, 
  Type, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon,
  Edit3,
  BookOpen,
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarkdownAttribute {
  name: string;
  syntax: string;
  description: string;
  example: string;
}

const ATTRIBUTES: MarkdownAttribute[] = [
  { name: 'Heading 1', syntax: '# Text', description: 'Main title', example: '# Title' },
  { name: 'Heading 2', syntax: '## Text', description: 'Section header', example: '## Section' },
  { name: 'Bold', syntax: '**Text**', description: 'Strong emphasis', example: '**Bold Text**' },
  { name: 'Italic', syntax: '*Text*', description: 'Emphasis', example: '*Italic Text*' },
  { name: 'Strikethrough', syntax: '~~Text~~', description: 'Deleted text', example: '~~Strikethrough~~' },
  { name: 'Unordered List', syntax: '- Item', description: 'Bullet points', example: '- Item 1\n- Item 2' },
  { name: 'Ordered List', syntax: '1. Item', description: 'Numbered list', example: '1. First\n2. Second' },
  { name: 'Blockquote', syntax: '> Text', description: 'Quoted text', example: '> This is a quote' },
  { name: 'Inline Code', syntax: '`Code`', description: 'Code snippet', example: '`const x = 10;`' },
  { name: 'Code Block', syntax: '```\nCode\n```', description: 'Multi-line code', example: '```js\nconsole.log("Hi");\n```' },
  { name: 'Link', syntax: '[Text](URL)', description: 'Hyperlink', example: '[Google](https://google.com)' },
  { name: 'Image', syntax: '![Alt](URL)', description: 'Embedded image', example: '![Logo](https://picsum.photos/200)' },
];

export default function App() {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to OakDown Mark

Start typing here to see the magic happen! 

## Features
- **Live Preview**: See changes instantly.
- **Shortcuts**: Use the toolbar for quick formatting.
- **Image Drop**: Drag and drop image URLs directly into the editor.
- **Guide**: Check the sidebar for syntax help.

Try it out: ~~strikethrough~~, *italics*, and **bold** are all here.

\`\`\`javascript
console.log("Happy coding!");
\`\`\`
`);
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('edit');
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to handle initial view based on screen size
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setView('split');
      setShowGuide(true);
    }
  }, []);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = 
      markdown.substring(0, start) + 
      before + selectedText + after + 
      markdown.substring(end);

    setMarkdown(newText);
    
    // Set focus back and adjust cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text/plain');
    if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
      const imageMarkdown = `\n![Image](${url})\n`;
      insertText(imageMarkdown);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearEditor = () => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
            <Edit3 className="text-white w-5 h-5" />
          </div>
          <h1 className="font-semibold text-sm sm:text-lg tracking-tight truncate">OakDown</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-[#F0F0F0] p-1 rounded-xl">
          <button 
            onClick={() => setView('edit')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${view === 'edit' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setView('split')}
            className={`hidden md:block px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'split' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
          >
            Split
          </button>
          <button 
            onClick={() => setView('preview')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${view === 'preview' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`p-2 rounded-lg transition-colors ${showGuide ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Toggle Guide"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <button 
            onClick={downloadFile}
            className="flex items-center gap-2 bg-white border border-black/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-12 border-b border-black/5 bg-white flex items-center px-4 sm:px-6 gap-1 shrink-0 overflow-x-auto no-scrollbar">
        <ToolbarButton icon={<Bold size={18} />} onClick={() => insertText('**', '**')} title="Bold" />
        <ToolbarButton icon={<Italic size={18} />} onClick={() => insertText('*', '*')} title="Italic" />
        <ToolbarButton icon={<Strikethrough size={18} />} onClick={() => insertText('~~', '~~')} title="Strikethrough" />
        <div className="w-px h-6 bg-black/5 mx-2" />
        <ToolbarButton icon={<Type size={18} />} onClick={() => insertText('# ')} title="Heading" />
        <ToolbarButton icon={<List size={18} />} onClick={() => insertText('- ')} title="Bullet List" />
        <ToolbarButton icon={<ListOrdered size={18} />} onClick={() => insertText('1. ')} title="Numbered List" />
        <div className="w-px h-6 bg-black/5 mx-2" />
        <ToolbarButton icon={<Quote size={18} />} onClick={() => insertText('> ')} title="Quote" />
        <ToolbarButton icon={<Code size={18} />} onClick={() => insertText('`', '`')} title="Inline Code" />
        <ToolbarButton icon={<LinkIcon size={18} />} onClick={() => insertText('[', '](url)')} title="Link" />
        <ToolbarButton icon={<ImageIcon size={18} />} onClick={() => insertText('![alt](', ')')} title="Image" />
        <div className="flex-1" />
        <button 
          onClick={clearEditor}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear Editor"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          {(view === 'edit' || view === 'split') && (
            <div 
              className={`flex-1 relative bg-white ${view === 'split' ? 'border-r border-black/5' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full p-4 sm:p-8 resize-none outline-none font-mono text-[14px] sm:text-[15px] leading-relaxed text-gray-800"
                placeholder="Type your markdown here..."
                spellCheck={false}
              />
              <div className="absolute bottom-4 right-6 text-[10px] uppercase tracking-widest text-gray-400 font-mono pointer-events-none">
                {markdown.length} characters | {markdown.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>
          )}

          {/* Preview Pane */}
          {(view === 'preview' || view === 'split') && (
            <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-8 prose-container">
              <div className="max-w-none prose prose-slate prose-headings:font-semibold prose-a:text-black prose-img:rounded-2xl">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {markdown || "*No content to preview*"}
                </Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Attribute Guide Sidebar / Drawer */}
        <AnimatePresence>
          {showGuide && (
            <>
              {/* Mobile Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setShowGuide(false)}
              />
              
              {/* Sidebar Content */}
              <motion.aside 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:relative lg:z-0 lg:shadow-none lg:border-l lg:border-black/5 lg:w-80 shrink-0"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Syntax Guide</h2>
                    <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-black">
                      <Plus className="rotate-45 w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {ATTRIBUTES.map((attr) => (
                      <div key={attr.name} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{attr.name}</span>
                          <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">{attr.syntax}</code>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{attr.description}</p>
                        <div className="p-3 bg-gray-50 rounded-xl border border-black/5 group-hover:border-black/10 transition-colors">
                          <div className="text-[11px] font-mono text-gray-400 mb-1 uppercase tracking-tighter">Example</div>
                          <div className="text-sm prose prose-sm prose-slate max-w-none">
                            <Markdown remarkPlugins={[remarkGfm]}>{attr.example}</Markdown>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .prose-container {
          scrollbar-gutter: stable;
        }

        /* Basic Markdown Styling */
        .prose h1 { font-size: 2.25rem; margin-top: 0; margin-bottom: 1.5rem; border-bottom: 1px solid #E5E5E5; padding-bottom: 0.5rem; }
        .prose h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
        .prose h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .prose p { margin-bottom: 1.25rem; line-height: 1.75; color: #374151; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose blockquote { border-left: 4px solid #E5E5E5; padding-left: 1rem; font-style: italic; color: #6B7280; margin: 1.5rem 0; }
        .prose code { background: #F3F4F6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; }
        .prose pre { background: #1F2937; color: #F9FAFB; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; }
        .prose pre code { background: transparent; padding: 0; color: inherit; font-size: 0.875rem; }
        .prose a { color: #2563EB; text-decoration: underline; text-underline-offset: 2px; }
        .prose img { max-width: 100%; height: auto; margin: 1.5rem 0; border-radius: 1rem; }
        .prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .prose th, .prose td { border: 1px solid #E5E5E5; padding: 0.75rem; text-align: left; }
        .prose th { background: #F9FAFB; font-weight: 600; }
      `}} />
    </div>
  );
}

function ToolbarButton({ icon, onClick, title }: { icon: React.ReactNode, onClick: () => void, title: string }) {
  return (
    <button 
      onClick={onClick}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
      title={title}
    >
      {icon}
    </button>
  );
}
