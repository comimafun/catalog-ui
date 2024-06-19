import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { classNames } from '@/utils/classNames';
import EditorMenuIcon from '@/icons/editor/EditorMenuIcon';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Level } from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';
import LinkIcon from '@/icons/LinkIcon';
import { Tooltip } from '@nextui-org/react';
import XCircleIcon from '@/icons/XCircleIcon';

const HEADING_LEVELS = [1, 2, 3] as Level[];

export const PROSE_WYISIWYG_CLASSNAMES = [
  'prose',
  'prose-p:mt-2 prose-p:mb-2',
  'prose-h1:mt-4 prose-h1:mb-4',
  'prose-h2:mt-3 prose-h2:mb-3',
  'prose-h3:mt-2 prose-h3:mb-2',
];

// define your extension array
const extensions = [
  StarterKit.configure({
    heading: {
      levels: HEADING_LEVELS,
    },
  }),
  Underline,
  Link.configure({
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
    protocols: ['https'],
    linkOnPaste: true,
    autolink: true,
  }),
  // TODO: Add image extension
  Image,
];

const LinkMenu = ({ editor }: { editor: Editor | null }) => {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = (open: boolean) => {
    const previousUrl = editor?.getAttributes('link')?.href;
    if (previousUrl) {
      setLink(previousUrl);
    }

    setOpen(open);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Tooltip
        isOpen={open}
        onOpenChange={(o) => {
          handleOpen(o);
        }}
        placement="bottom-start"
        content={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!link) {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .unsetLink()
                  .run();
                return;
              }
              // update link
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: link })
                .run();
            }}
            className="flex gap-1"
          >
            <input
              type="text"
              className="rounded border border-neutral-500 p-1 px-2"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value.trim())}
            />
            <button
              className="rounded border border-neutral-500 p-1"
              type="submit"
            >
              {editor.isActive('link') ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              className="rounded border border-neutral-500 p-1"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .unsetLink()
                  .run();
                setLink('');
              }}
            >
              <XCircleIcon width={16} height={16} />
            </button>
          </form>
        }
      >
        <button
          type="button"
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('link')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
          onClick={() => {
            handleOpen(!open);
          }}
        >
          <LinkIcon width={16} height={20} />
        </button>
      </Tooltip>
    </div>
  );
};

const HeadingsMenu = ({ editor }: { editor: Editor | null }) => {
  const [open, setOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const TooltipContent = () => {
    return (
      <div className="flex flex-col overflow-hidden rounded-lg bg-white">
        {HEADING_LEVELS.map((level) => {
          return (
            <button
              type="button"
              className={classNames(
                'whitespace-nowrap px-2 py-2 transition-all hover:bg-neutral-500 hover:text-white',
                editor.isActive('heading', { level })
                  ? 'bg-neutral-500 !text-white'
                  : 'bg-white text-neutral-500',
              )}
              key={level}
              disabled={
                !editor.can().chain().focus().toggleHeading({ level }).run()
              }
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
            >
              Heading {level}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative">
      <Tooltip
        placement="bottom-start"
        classNames={{
          content: 'p-0',
        }}
        isOpen={open}
        onOpenChange={(o) => setOpen(o)}
        content={<TooltipContent />}
      >
        <div
          className={classNames(
            'rounded border border-neutral-500 p-1 text-neutral-500',
            editor.isActive('heading')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white',
          )}
        >
          {' '}
          Heading
        </div>
      </Tooltip>
    </div>
  );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="w-full rounded-t-lg border-x-1 border-t-1 border-neutral-500 px-2.5 py-2">
      <div className="relative flex gap-1">
        <HeadingsMenu editor={editor} />
        <button
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('bold')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <EditorMenuIcon.Bold width={16} height={16} />
        </button>
        <button
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('italic')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <EditorMenuIcon.Italic width={16} height={16} />
        </button>
        <button
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('underline')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
        >
          <EditorMenuIcon.Underline width={16} height={16} />
        </button>
        <button
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('strike')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <EditorMenuIcon.StrikeThrough width={16} height={16} />
        </button>

        <LinkMenu editor={editor} />
      </div>
    </div>
  );
};

const EditorWYSIWYG = ({
  content = '<p>Tell us about your circle! 🥳</p>',
  onChange,
}: {
  content?: string;
  onChange?: (html: string) => void;
}) => {
  const editor = useEditor({
    content,
    onUpdate: (c) => onChange?.(c.editor.getHTML()),
    extensions,
    editorProps: {
      attributes: {
        class: classNames(
          'focus:outline-none border rounded-b-lg border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:ring-opacity-50',
          'py-1 px-2.5 w-full min-h-[260px]',
          ...PROSE_WYISIWYG_CLASSNAMES,
        ),
      },
    },
  });

  useEffect(() => {
    if (content && content !== '<p</p>') {
      editor?.commands.setContent(content);
    } else {
      editor?.commands.setContent('<p>Tell us about your circle! 🥳</p>');
    }
  }, [content, editor]);

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default EditorWYSIWYG;
