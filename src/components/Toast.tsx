import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

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

export function Toast({ visivel, mensagem, tipo, onClose }: ToastProps) {
  const [animacao, setAnimacao] = useState(new Animated.Value(0));
  const [opacidade, setOpacidade] = useState(new Animated.Value(0));

  const mostrar = useCallback(() => {
    setAnimacao(new Animated.Value(0));
    setOpacidade(new Animated.Value(0));

    Animated.parallel([
      Animated.timing(animacao, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacidade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animacao, opacidade]);

  const esconder = useCallback(() => {
    Animated.parallel([
      Animated.timing(animacao, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacidade, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [animacao, opacidade, onClose]);

  React.useEffect(() => {
    if (visivel) {
      mostrar();
    } else {
      esconder();
    }
  }, [visivel, mostrar, esconder]);

  const translateY = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const cores = CORES[tipo];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: cores.bg, borderLeftColor: cores.border },
        { opacity: opacidade, transform: [{ translateY }] },
      ]}
    >
      <Text style={[styles.texto, { color: cores.texto }]}>{mensagem}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
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
  const [toast, setToast] = useState<{ visivel: boolean; mensagem: string; tipo: ToastType }>({
    visivel: false,
    mensagem: "",
    tipo: "info",
  });

  const mostrarToast = useCallback((mensagem: string, tipo: ToastType) => {
    setToast({ visivel: true, mensagem, tipo });
  }, []);

  const esconderToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visivel: false }));
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