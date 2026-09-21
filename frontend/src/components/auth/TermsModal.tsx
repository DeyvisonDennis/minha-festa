"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type TermsModalProps = {
  titulo: string;
  atualizadoEm: string;
  conteudo: string;
  onClose: () => void;
};

export function TermsModal({
  titulo,
  atualizadoEm,
  conteudo,
  onClose,
}: TermsModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-8 py-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {titulo}
            </h2>
            <p className="mt-1 text-sm text-muted">{atualizadoEm}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6">
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {conteudo}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}