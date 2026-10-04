import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ToastType = "sucesso" | "erro" | "info";

type ToastProps = {
  visivel: boolean;
  mensagem: string;
  tipo: ToastType;
  onClose: () => void;
};

const CORES = {
  sucesso: { bg: "#E8F5E9", border: "#4CAF50", texto: "#2E7D32" },
  erro: { bg: "#FFEBEE", border: "#F44336", texto: "#C62828" },
  info: { bg: "#E3F2FD", border: "#2196F3", texto: "#1565C0" },
};

function Toast({ visivel, mensagem, tipo, onClose }: ToastProps) {
  if (!visivel) return null;

  const cores = CORES[tipo];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mensagem}
      onPress={onClose}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: cores.bg, borderLeftColor: cores.border },
        pressed && styles.pressionado,
      ]}
    >
      <Text style={[styles.texto, { color: cores.texto }]}>{mensagem}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
    cursor: "pointer",
  },
  pressionado: {
    opacity: 0.85,
  },
  texto: {
    fontSize: 14,
    fontWeight: "500",
  },
});

type ToastContextType = {
  mostrarToast: (mensagem: string, tipo: ToastType) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    visivel: boolean;
    mensagem: string;
    tipo: ToastType;
  }>({ visivel: false, mensagem: "", tipo: "info" });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const esconderToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setToast((atual) => ({ ...atual, visivel: false }));
  }, []);

  const mostrarToast = useCallback((mensagem: string, tipo: ToastType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ visivel: true, mensagem, tipo });
    timeoutRef.current = setTimeout(() => {
      setToast((atual) => ({ ...atual, visivel: false }));
      timeoutRef.current = null;
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <Toast
        visivel={toast.visivel}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onClose={esconderToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context.mostrarToast;
}
