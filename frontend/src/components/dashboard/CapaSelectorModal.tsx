"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { OPCOES_CAPA } from "@/lib/opcoes-capa";

type CapaSelectorModalProps = {
  capaAtualId: string;
  onClose: () => void;
  onSelecionar: (capaId: string) => void;
};

export function CapaSelectorModal({
  capaAtualId,
  onClose,
  onSelecionar,
}: CapaSelectorModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Escolher imagem de capa
            </h2>
            <p className="mt-1 text-xs text-muted">
              Fotos gratuitas — em breve você poderá enviar a sua própria imagem.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="cursor-pointer rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid max-h-[calc(85vh-88px)] grid-cols-2 gap-3 overflow-y-auto p-6 sm:grid-cols-3">
          {OPCOES_CAPA.map((opcao) => {
            const selecionada = opcao.id === capaAtualId;
            return (
              <button
                key={opcao.id}
                onClick={() => {
                  onSelecionar(opcao.id);
                  onClose();
                }}
                className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 ${
                  selecionada ? "border-primary" : "border-transparent hover:border-primary/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={opcao.url}
                  alt={opcao.label}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                {selecionada && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={14} />
                  </span>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-left text-xs font-medium text-white">
                  {opcao.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}