import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Mark, mergeAttributes } from '@tiptap/core';

const CustomHighlight = Mark.create({
  name: 'customHighlight',
  parseHTML() {
    return [{ tag: 'span[data-highlight="true"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 
      'data-highlight': 'true', 
      class: 'bg-emerald-500/30 text-emerald-300 font-bold px-1 rounded shadow-sm border border-emerald-500/20' 
    }), 0];
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, CustomHighlight],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-invert max-w-none focus:outline-none min-h-[350px] [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:text-white [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-2 [&>h2]:border-b [&>h2]:border-white/10 [&>h2]:pb-1 [&>h2]:text-emerald-400 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-3 [&>p]:mb-2 [&>p]:text-white/70 [&>ul>li]:text-white/70 [&_strong]:text-white [&_strong]:font-bold'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Re-sync content when the prop changes (e.g. initial load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-wrapper flex flex-col h-full border border-emerald-500/20 rounded-lg overflow-hidden bg-white/[0.01]">
      <div className="flex items-center gap-1 p-2 border-b border-emerald-500/20 bg-emerald-500/[0.05] overflow-x-auto custom-scrollbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('bold') ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('italic') ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('bulletList') ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors ${editor.isActive('orderedList') ? 'bg-emerald-500/30 text-emerald-300' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-emerald-500/20 text-white/70 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
