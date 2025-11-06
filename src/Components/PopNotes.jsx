"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useToast } from "./toast"
import { createNote as apiCreateNote, deleteNote as apiDeleteNote, getAllNotes as apiGetAllNotes, updateNote as apiUpdateNote } from "../api/notes"

// Local utility (migrated from '@/lib/utils')
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const TRANSITION = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, handler])
}

const PopoverContext = createContext(undefined)

function usePopover() {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider")
  }
  return context
}

function usePopoverLogic() {
  const uniqueId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState("")

  const openPopover = () => setIsOpen(true)
  const closePopover = () => {
    setIsOpen(false)
    setNote("")
  }

  return { isOpen, openPopover, closePopover, uniqueId, note, setNote }
}

export function PopoverRoot({ children, className }) {
  const popoverLogic = usePopoverLogic()

  return (
    <PopoverContext.Provider value={popoverLogic}>
      <MotionConfig transition={TRANSITION}>
        <div
          className={cn(
            "relative flex items-center justify-center isolate",
            className
          )}
        >
          {children}
        </div>
      </MotionConfig>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children, className }) {
  const { openPopover, uniqueId } = usePopover()

  return (
    <motion.button
      key="button"
      layoutId={`popover-${uniqueId}`}
      className={cn(
        "flex h-9 items-center border border-zinc-950/10 bg-white px-3 text-zinc-950 dark:border-zinc-50/10 dark:bg-zinc-700 dark:text-zinc-50",
        className
      )}
      style={{
        borderRadius: 8,
      }}
      onClick={openPopover}
    >
      <motion.span layoutId={`popover-label-${uniqueId}`} className="text-sm">
        {children}
      </motion.span>
    </motion.button>
  )
}

export function PopoverContent({ children, className }) {
  const { isOpen, closePopover, uniqueId } = usePopover()
  const formContainerRef = useRef(null)

  useClickOutside(formContainerRef, closePopover)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopover()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [closePopover])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopover}
          />
          {/* Centered panel */}
          <motion.div
            ref={formContainerRef}
            layoutId={`popover-${uniqueId}`}
            className={cn("fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[72vh] w-[1000px] max-w-[96vw] overflow-hidden border border-gray-200 bg-white outline-none shadow-2xl rounded-3xl", className)}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function PopoverForm({ children, onSubmit, className }) {
  const { note, closePopover } = usePopover()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(note)
    closePopover()
  }

  return (
    <form
      className={cn("flex h-full flex-col", className)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  )
}

export function PopoverLabel({ children, className }) {
  const { uniqueId, note } = usePopover()

  return (
    <motion.span
      layoutId={`popover-label-${uniqueId}`}
      aria-hidden="true"
      style={{
        opacity: note ? 0 : 1,
      }}
      className={cn(
        "absolute left-4 top-3 select-none text-sm text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </motion.span>
  )
}

export function PopoverTextarea({ className }) {
  const { note, setNote } = usePopover()

  return (
    <textarea
      className={cn(
        "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none",
        className
      )}
      autoFocus
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  )
}

export function PopoverFooter({ children, className }) {
  return (
    <div
      key="close"
      className={cn("flex justify-between px-4 py-3", className)}
    >
      {children}
    </div>
  )
}

export function PopoverCloseButton({ className }) {
  const { closePopover } = usePopover()

  return (
    <button
      type="button"
      className={cn("flex items-center", className)}
      onClick={closePopover}
      aria-label="Close popover"
    >
      <X size={16} className="text-zinc-900 dark:text-zinc-100" />
    </button>
  )
}

export function PopoverSubmitButton({ className }) {
  return (
    <button
      className={cn(
        "relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className
      )}
      type="submit"
      aria-label="Submit note"
    >
      Submit
    </button>
  )
}

export function PopoverHeader({ children, className }) {
  return (
    <div
      className={cn(
        "px-4 py-2 font-semibold text-gray-900",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PopoverBody({ children, className }) {
  return <div className={cn("p-4", className)}>{children}</div>
}

// New component: PopoverButton
export function PopoverButton({ children, onClick, className }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Notes panel with sidebar list and editor, persisted to localStorage
export function NotesPanel() {
  const storageKey = 'notes-panel-v1';
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGetAllNotes();
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const normalized = list.map((n) => ({
          id: n.id || n._id || n.noteId || n.note_id,
          title: n.title ?? 'Untitled',
          content: n.content ?? '',
          createdAt: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
          updatedAt: n.updatedAt ? new Date(n.updatedAt).getTime() : Date.now(),
        })).filter((n) => n.id);
        setNotes(normalized);
        if (normalized.length > 0) setSelectedId(normalized[0].id);
      } catch {
        // Fallback to localStorage
        try {
          const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) {
            setNotes(parsed);
            if (parsed.length > 0) setSelectedId(parsed[0].id);
          }
        } catch {}
      }
    };
    load();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const addNote = async () => {
    if (notes.length >= 10) {
      toast.error('Limit reached: You can only have 10 notes.');
      return;
    }
    try {
      const resp = await apiCreateNote({ title: 'Untitled', content: '' });
      const n = resp?.data || resp;
      const id = n?.id || n?._id || n?.noteId || `n_${Date.now()}`;
      const newNote = { id, title: n?.title ?? 'Untitled', content: n?.content ?? '', createdAt: Date.now(), updatedAt: Date.now() };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedId(id);
      toast.success('Note created');
    } catch (err) {
      // Fallback local create when API fails
      const id = `n_${Date.now()}`;
      const newNote = { id, title: 'Untitled', content: '', createdAt: Date.now(), updatedAt: Date.now() };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedId(id);
      const msg = err?.response?.data?.message || 'Note created locally (server rejected request)';
      toast.error(msg);
    }
  };

  const deleteNote = async () => {
    if (!selectedId) return;
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== selectedId);
      if (next.length > 0) setSelectedId(next[0].id); else setSelectedId(null);
      return next;
    });
    try { await apiDeleteNote(selectedId); } catch {}
    toast.success('Note deleted');
  };

  // Create a note automatically if user starts typing with none selected
  const ensureCurrentNote = () => {
    if (selectedId) return selectedId;
    if (notes.length >= 10) {
      toast.error('Limit reached: You can only have 10 notes.');
      return null;
    }
    const id = `n_${Date.now()}`;
    const newNote = { id, title: 'Untitled', content: '', createdAt: Date.now(), updatedAt: Date.now() };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(id);
    return id;
  };

  const updateContent = (value) => {
    const id = selectedId || ensureCurrentNote();
    if (!id) return;
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, content: value, updatedAt: Date.now() } : n));
    queueUpdate(id, { content: value });
  };

  const updateTitle = (value) => {
    const id = selectedId || ensureCurrentNote();
    if (!id) return;
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, title: value, updatedAt: Date.now() } : n));
    queueUpdate(id, { title: value });
  };

  // Debounced update to API
  const pendingRef = useRef(null);
  const queueUpdate = (id, patch) => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    pendingRef.current = setTimeout(async () => {
      try { await apiUpdateNote(id, patch); } catch {}
    }, 500);
  };

  const current = notes.find((n) => n.id === selectedId) || null;

  return (
    <div className="h-full w-full grid grid-cols-[300px_1fr] text-gray-900">
      {/* Sidebar */}
      <div className="border-r border-gray-200 bg-white flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={addNote}
              className="px-3 py-1.5 text-sm font-semibold rounded-md border border-emerald-300 bg-white text-gray-900 shadow-sm hover:bg-emerald-50 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              New
            </button>
            <button
              onClick={deleteNote}
              className="px-3 py-1.5 text-sm font-semibold rounded-md border border-red-300 bg-white text-red-600 shadow-sm hover:bg-red-50 hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Delete
            </button>
          </div>
          <div className="text-xs text-gray-500">{notes.length}/10</div>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No notes yet. Click New to create one.</div>
          )}
          <ul className="divide-y divide-gray-100">
            {notes.map((n) => (
              <li key={n.id} className={cn("p-3 cursor-pointer", selectedId === n.id ? "bg-emerald-50" : "hover:bg-gray-50")} onClick={() => setSelectedId(n.id)}>
                <div className="text-sm font-bold text-gray-900 truncate">{n.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500">Updated {new Date(n.updatedAt).toLocaleDateString()} {new Date(n.updatedAt).toLocaleTimeString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Editor */}
      <div className="bg-white h-full flex flex-col">
        <div className="h-14 border-b border-gray-200 flex items-center gap-3 px-4 text-sm text-gray-700">
          <input
            className="flex-1 bg-transparent outline-none text-lg font-semibold text-gray-900 placeholder:text-gray-400"
            placeholder="Untitled"
            value={current?.title || ''}
            onFocus={ensureCurrentNote}
            onChange={(e)=>updateTitle(e.target.value)}
          />
          <div className="ml-auto text-xs text-gray-500">{current ? new Date(current.updatedAt).toLocaleString() : ''}</div>
        </div>
        <textarea
          className="w-full flex-1 p-6 text-base outline-none resize-none text-gray-900 placeholder:text-gray-400"
          placeholder="Start typing..."
          value={current?.content || ''}
          onFocus={ensureCurrentNote}
          onChange={(e) => updateContent(e.target.value)}
        />
      </div>
    </div>
  );
}

function snippet(text) {
  if (!text) return '';
  const s = text.replace(/\r?\n/g, ' ').trim();
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}
