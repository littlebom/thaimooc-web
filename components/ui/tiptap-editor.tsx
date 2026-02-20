"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Minus,
  X,
  Youtube,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// ── YouTube URL parser ────────────────────────────────────────────────────────
function getYoutubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

// ── YouTube Node View (shown inside the editor) ───────────────────────────────
function YoutubeEmbedView({ node }: { node: any }) {
  return (
    <NodeViewWrapper>
      <div contentEditable={false} className="my-4 select-none">
        <div className="relative w-full" style={{ paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={node.attrs.src}
            className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-1">วิดีโอ YouTube</p>
      </div>
    </NodeViewWrapper>
  );
}

// ── Custom Tiptap Node ────────────────────────────────────────────────────────
const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return { src: { default: null } };
  },

  parseHTML() {
    return [{ tag: 'div[data-youtube-embed]' }];
  },

  // HTML stored in DB and rendered on public pages
  renderHTML({ node }) {
    return [
      "div",
      { "data-youtube-embed": "" },
      [
        "iframe",
        {
          src: node.attrs.src,
          frameborder: "0",
          allowfullscreen: "",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          style:
            "display:block;width:100%;aspect-ratio:16/9;border-radius:8px;border:none;",
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeEmbedView);
  },

  addCommands() {
    return {
      setYoutubeEmbed:
        (options: { src: string }) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: options.src },
          });
        },
    } as any;
  },
});

// ── Main Editor Component ─────────────────────────────────────────────────────
export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [uploading, setUploading] = useState(false);

  // Link modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Color picker
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const colorInputRef = useRef<HTMLInputElement>(null);

  // YouTube modal
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const youtubeInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      YoutubeEmbed,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (linkModalOpen) setTimeout(() => linkInputRef.current?.focus(), 50);
  }, [linkModalOpen]);

  useEffect(() => {
    if (youtubeModalOpen) {
      setYoutubeUrl("");
      setYoutubeError("");
      setTimeout(() => youtubeInputRef.current?.focus(), 50);
    }
  }, [youtubeModalOpen]);

  if (!editor) return null;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("imageType", "others");
          const response = await fetch("/api/upload", { method: "POST", body: formData });
          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          if (data.success && data.url) {
            editor.chain().focus().setImage({ src: data.url }).run();
          } else throw new Error(data.error || "Upload failed");
        } catch (error) {
          console.error("Upload error:", error);
          alert("ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const openLinkModal = () => {
    setLinkUrl(editor.getAttributes("link").href || "");
    setLinkModalOpen(true);
  };

  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl("");
  };

  const applyColor = () => {
    editor.chain().focus().setColor(selectedColor).run();
    setColorPickerOpen(false);
  };

  const applyYoutube = () => {
    const embedUrl = getYoutubeEmbedUrl(youtubeUrl.trim());
    if (!embedUrl) {
      setYoutubeError("URL ไม่ถูกต้อง โปรดใส่ลิงก์ YouTube ที่ถูกต้อง");
      return;
    }
    (editor.chain().focus() as any).setYoutubeEmbed({ src: embedUrl }).run();
    setYoutubeModalOpen(false);
  };

  const previewEmbedUrl = youtubeUrl ? getYoutubeEmbedUrl(youtubeUrl) : null;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="border rounded-lg overflow-hidden relative">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          type="button" size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="ตัวหนา (Bold)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="ตัวเอียง (Italic)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button" size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="หัวข้อ 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="หัวข้อ 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button" size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="รายการแบบจุด"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="รายการแบบตัวเลข"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="คำพูดอ้างอิง"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm" variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="เส้นแบ่ง"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <Button
          type="button" size="sm"
          variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="ชิดซ้าย"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="กึ่งกลาง"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="ชิดขวา"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Media */}
        <Button
          type="button" size="sm" variant="ghost"
          onClick={addImage}
          disabled={uploading}
          title="แทรกรูปภาพ"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          onClick={openLinkModal}
          title="แทรกลิงก์"
        >
          <Link2 className="h-4 w-4" />
        </Button>

        {/* YouTube button */}
        <Button
          type="button" size="sm" variant="ghost"
          onClick={() => setYoutubeModalOpen(true)}
          title="แทรกวิดีโอ YouTube"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Youtube className="h-4 w-4" />
        </Button>

        {/* Color picker trigger */}
        <div className="relative">
          <Button
            type="button" size="sm" variant="ghost"
            onClick={() => setColorPickerOpen((v) => !v)}
            title="สีตัวอักษร"
            className="gap-1"
          >
            <Palette className="h-4 w-4" />
            <span
              className="w-3 h-3 rounded-full border border-gray-400"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>

          {colorPickerOpen && (
            <div className="absolute top-10 left-0 z-50 bg-white border rounded-lg shadow-lg p-3 w-48">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">เลือกสีตัวอักษร</span>
                <button onClick={() => setColorPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1 mb-2">
                {["#000000","#374151","#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899","#06B6D4","#ffffff","#6B7280"].map((c) => (
                  <button
                    key={c} type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                    onClick={() => { setSelectedColor(c); editor.chain().focus().setColor(c).run(); setColorPickerOpen(false); }}
                    title={c}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={colorInputRef}
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="flex-1 text-xs border rounded px-1 py-1"
                  placeholder="#000000"
                />
                <button
                  type="button" onClick={applyColor}
                  className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90"
                >
                  ใช้
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button" size="sm" variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="ยกเลิก"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button" size="sm" variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="ทำซ้ำ"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {uploading && (
        <div className="p-2 bg-blue-50 text-blue-700 text-sm">
          กำลังอัพโหลดรูปภาพ...
        </div>
      )}

      {/* Link Modal */}
      {linkModalOpen && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg shadow-xl p-5 w-80 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">แทรกลิงก์</h3>
              <button onClick={() => setLinkModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => e.key === "Enter" && applyLink()}
            />
            <div className="flex gap-2 justify-end">
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={() => { editor.chain().focus().unsetLink().run(); setLinkModalOpen(false); }}
                  className="text-sm text-red-500 hover:text-red-700 mr-auto"
                >
                  ลบลิงก์
                </button>
              )}
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="button" onClick={applyLink}
                className="text-sm px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90"
              >
                ใส่ลิงก์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Modal */}
      {youtubeModalOpen && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg shadow-xl p-5 w-96 mx-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">แทรกวิดีโอ YouTube</h3>
              </div>
              <button onClick={() => setYoutubeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              รองรับ: youtube.com/watch?v=... · youtu.be/... · youtube.com/shorts/...
            </p>

            <input
              ref={youtubeInputRef}
              type="url"
              value={youtubeUrl}
              onChange={(e) => { setYoutubeUrl(e.target.value); setYoutubeError(""); }}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`w-full border rounded px-3 py-2 text-sm mb-1 focus:outline-none focus:ring-2 ${
                youtubeError ? "border-red-400 focus:ring-red-300" : "focus:ring-primary/50"
              }`}
              onKeyDown={(e) => e.key === "Enter" && applyYoutube()}
            />

            {youtubeError && (
              <p className="text-xs text-red-500 mb-2">{youtubeError}</p>
            )}

            {/* Live preview */}
            {previewEmbedUrl && (
              <div className="mt-3 mb-1">
                <p className="text-xs text-gray-500 mb-1">ตัวอย่าง:</p>
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-black"
                  style={{ paddingBottom: "56.25%", height: 0 }}
                >
                  <iframe
                    src={previewEmbedUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => setYoutubeModalOpen(false)}
                className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={applyYoutube}
                className="text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1.5"
              >
                <Youtube className="h-3.5 w-3.5" />
                แทรกวิดีโอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
