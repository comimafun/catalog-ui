import { Editor, EditorContent, useEditor } from '@tiptap/react';
import type { EditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { classNames } from '@/utils/classNames';
import EditorMenuIcon from '@/icons/editor/EditorMenuIcon';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import type { Level } from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useState,
} from 'react';
import LinkIcon from '@/icons/LinkIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import XCircleIcon from '@/icons/XCircleIcon';
import Uploader from '../Uploader';
import ImageIcon from '@/icons/ImageIcon';
import { ACCEPTED_IMAGE_TYPES_SET, MEGABYTE } from '@/constants/common';
import toast from 'react-hot-toast';
import { prettifyError } from '@/utils/helper';
import { uploadService } from '@/services/upload';
import { create } from 'zustand';
import Spin from '../Spin';
import { CommonStoreSetter } from '@/types/common';

type EditorStore = {
  isLoading: boolean;
};

type EditorStoreSetter = CommonStoreSetter<EditorStore>;

const useEditorStore = create<EditorStore & EditorStoreSetter>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

const HEADING_LEVELS = [1, 2, 3] as Level[];

export const PROSE_WYISIWYG_CLASSNAMES = [
  'prose',
  'prose-p:mt-2 prose-p:mb-2',
  'prose-h1:mt-4 prose-h1:mb-4',
  'prose-h2:mt-3 prose-h2:mb-3',
  'prose-h3:mt-2 prose-h3:mb-2',
];

const extensions = [
  StarterKit.configure({
    heading: {
      levels: HEADING_LEVELS,
    },
    dropcursor: {
      color: '#6A00F5',
      width: 2,
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
  Image.configure({
    HTMLAttributes: {
      loading: 'lazy',
    },
  }),
];

type HandleDrop = EditorOptions['editorProps']['handleDrop'];

const editorCtx = createContext<Editor | null>(null);

const EditorProvider = ({
  children,
  content,
  onChange,
}: {
  children: React.ReactNode;
  content?: string;
  onChange?: (html: string) => void;
}) => {
  const isLoading = useEditorStore((s) => s.isLoading);
  const setLoading = useEditorStore((s) => s.setIsLoading);
  const handleDrop: HandleDrop = (view, event, _slice, moved) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      const file = event.dataTransfer.files[0];
      if (file.size > 2 * MEGABYTE) {
        toast.error('Max file size is 2MB');
        return;
      }

      if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
        toast.error(
          'File type must be' + Array.from(ACCEPTED_IMAGE_TYPES_SET).join(', '),
        );
        return;
      }
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      if (!coordinates) return false;
      setLoading(true);
      uploadService
        .uploadImage({
          file,
          type: 'profiles',
        })
        .then(({ data }) => {
          const { schema } = view.state;
          const node = schema.nodes.image.create({
            src: data,
            alt: file.name,
          });
          const transaction = view.state.tr.insert(coordinates.pos, node);
          return view.dispatch(transaction);
        })
        .catch((err) => {
          toast.error(prettifyError(err as Error));
          return false;
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return false;
  };
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
      handleDrop,
    },
  });

  useEffect(() => {
    if (content && content !== '<p</p>') {
      editor?.commands.setContent(content);
    } else {
      editor?.commands.setContent('<p>Tell us about your circle! 🥳</p>');
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <Spin spinning={isLoading}>
      <editorCtx.Provider value={editor}>{children}</editorCtx.Provider>
    </Spin>
  );
};

const useLocaleEditor = () => {
  const ctx = useContext(editorCtx);
  if (!ctx) {
    throw new Error('useLocaleEditor must be used within a EditorProvider');
  }
  return ctx;
};

const LinkMenu = () => {
  const [link, setLink] = useState('');

  const editor = useLocaleEditor();

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <button
          type="button"
          className={classNames(
            'rounded border border-neutral-500 p-1',
            editor.isActive('link')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white text-neutral-500',
          )}
        >
          <LinkIcon width={16} height={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <form className="flex gap-1">
          <input
            type="text"
            className="rounded border border-neutral-500 p-1 px-2"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value.trim())}
          />
          <button
            className="rounded border border-neutral-500 p-1"
            type="button"
            onClick={() => {
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
          >
            {editor.isActive('link') ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            className="rounded border border-neutral-500 p-1"
            onClick={() => {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              setLink('');
            }}
          >
            <XCircleIcon width={16} height={16} />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

const HeadingsMenu = () => {
  const editor = useLocaleEditor();

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <div
          className={classNames(
            'rounded border border-neutral-500 p-1 text-neutral-500',
            editor.isActive('heading')
              ? 'bg-neutral-500 !text-white'
              : 'bg-white',
          )}
        >
          Heading
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
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
                  editor.chain().toggleHeading({ level: level }).run()
                }
              >
                Heading {level}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ImageMenu = () => {
  const setLoading = useEditorStore((s) => s.setIsLoading);
  const editor = useLocaleEditor();

  return (
    <Uploader
      accept={Array.from(ACCEPTED_IMAGE_TYPES_SET).join(',')}
      className="'flex text-neutral-500', items-center rounded border border-neutral-500 bg-white p-1"
      customRequest={async (files) => {
        try {
          setLoading(true);
          const file = files?.[0];
          if (!file) return;

          if (file.size > 2 * MEGABYTE) {
            toast.error('Max file size is 2MB');
            return;
          }

          if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
            toast.error(
              'File type must be' +
                Array.from(ACCEPTED_IMAGE_TYPES_SET).join(','),
            );
            return;
          }
          const { data } = await uploadService.uploadImage({
            file,
            type: 'profiles',
          });

          editor.chain().focus().setImage({ src: data, alt: file.name }).run();
        } catch (error) {
          toast.error(prettifyError(error as Error));
        } finally {
          setLoading(false);
        }
      }}
    >
      <ImageIcon width={16} height={16} />
    </Uploader>
  );
};

const MenuBar = () => {
  const editor = useLocaleEditor();

  return (
    <div className="w-full rounded-t-lg border-x-1 border-t-1 border-neutral-500 px-2.5 py-2">
      <div className="relative flex gap-1">
        <HeadingsMenu />
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

        <LinkMenu />

        <ImageMenu />
      </div>
    </div>
  );
};

const Main = () => {
  const editor = useLocaleEditor();

  return (
    <Fragment>
      <MenuBar />
      <EditorContent editor={editor} />
    </Fragment>
  );
};

const EditorWYSIWYG = ({
  content = '<p>Tell us about your circle! 🥳</p>',
  onChange,
}: {
  content?: string;
  onChange?: (html: string) => void;
}) => {
  return (
    <EditorProvider content={content} onChange={onChange}>
      <Main />
    </EditorProvider>
  );
};

export default EditorWYSIWYG;
