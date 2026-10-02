import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import {
  obterEspecialidades,
  obterMedicos,
  salvarEspecialidades,
  salvarMedicos,
  obterConsultas,
  salvarConsultas,
} from "../services/storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { Consulta } from "../interfaces/consulta";
import { styles } from "../styles/admin.styles";
import { useToast } from "../components";

export default function Admin({
  navigation,
}: {
  navigation: { navigate: (screen: string) => void };
}) {
  const mostrarToast = useToast();

  const [nomeEsp, setNomeEsp] = useState("");
  const [descEsp, setDescEsp] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  const [nomeMed, setNomeMed] = useState("");
  const [crmMed, setCrmMed] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [nomePac, setNomePac] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    const especialidadesSalvas = await obterEspecialidades();
    const medicosSalvos = await obterMedicos();
    setEspecialidades(especialidadesSalvas);
    setMedicos(medicosSalvos);
  }

  async function adicionarEspecialidade() {
    if (!nomeEsp || !descEsp) {
      mostrarToast("Preencha nome e descrição", "erro");
      return;
    }

    const novaEsp: Especialidade = {
      id: especialidades.length + 1,
      nome: nomeEsp,
      descricao: descEsp,
    };

    const novasEsps = [...especialidades, novaEsp];
    setEspecialidades(novasEsps);
    await salvarEspecialidades(novasEsps);

    setNomeEsp("");
    setDescEsp("");
    mostrarToast("Especialidade adicionada!", "sucesso");
  }

  async function adicionarMedico() {
    if (!nomeMed || !crmMed) {
      mostrarToast("Preencha nome e CRM", "erro");
      return;
    }

    if (especialidades.length === 0) {
      mostrarToast("Adicione uma especialidade primeiro!", "erro");
      return;
    }

    const novoMed: Medico = {
      id: medicos.length + 1,
      nome: nomeMed,
      crm: crmMed,
      especialidade: especialidades[0],
      ativo: true,
    };

    const novosMeds = [...medicos, novoMed];
    setMedicos(novosMeds);
    await salvarMedicos(novosMeds);

    setNomeMed("");
    setCrmMed("");
    mostrarToast("Médico adicionado!", "sucesso");
  }

  async function criarConsultaTeste() {
    if (!nomePac || !dataConsulta) {
      mostrarToast("Preencha nome do paciente e data", "erro");
      return;
    }

    if (medicos.length === 0) {
      mostrarToast("Adicione um médico primeiro!", "erro");
      return;
    }

    const pacienteTeste: Paciente = {
      id: Date.now(),
      nome: nomePac,
      cpf: "123.456.789-00",
      email: "paciente@email.com",
      telefone: "(11) 98765-4321",
    };

    const partesData = dataConsulta.split("/");
    if (partesData.length !== 3) {
      mostrarToast("Use a data no formato DD/MM/AAAA", "erro");
      return;
    }

    const [dia, mes, ano] = partesData;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

    if (Number.isNaN(data.getTime())) {
      mostrarToast("Data inválida. Use DD/MM/AAAA", "erro");
      return;
    }

    const novaConsulta: Consulta = {
      id: Date.now(),
      medico: medicos[0],
      paciente: pacienteTeste,
      data: data,
      valor: 350,
      status: "agendada",
      observacoes: "Consulta de teste",
    };

    const consultasAtuais = await obterConsultas();
    await salvarConsultas([...consultasAtuais, novaConsulta]);

    setNomePac("");
    setDataConsulta("");

    mostrarToast("Consulta criada! Volte para Home", "sucesso");
    setTimeout(() => navigation.navigate("Home"), 1500);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.content}>
        <View style={styles.secao}>
          <Text style={styles.titulo}>1. Adicionar Especialidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da especialidade"
            value={nomeEsp}
            onChangeText={setNomeEsp}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descEsp}
            onChangeText={setDescEsp}
          />
          <Button title="Adicionar Especialidade" onPress={adicionarEspecialidade} />

          <View style={styles.lista}>
            {especialidades.map((esp) => (
              <Text key={esp.id} style={styles.item}>
                • {esp.nome} - {esp.descricao}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>2. Adicionar Médico</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do médico"
            value={nomeMed}
            onChangeText={setNomeMed}
          />
          <TextInput
            style={styles.input}
            placeholder="CRM"
            value={crmMed}
            onChangeText={setCrmMed}
          />
          <Button title="Adicionar Médico" onPress={adicionarMedico} />

          <View style={styles.lista}>
            {medicos.map((med) => (
              <Text key={med.id} style={styles.item}>
                • {med.nome} ({med.crm}) - {med.especialidade.nome}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>3. Criar Consulta de Teste</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do paciente"
            value={nomePac}
            onChangeText={setNomePac}
          />
          <TextInput
            style={styles.input}
            placeholder="Data (DD/MM/AAAA)"
            value={dataConsulta}
            onChangeText={setDataConsulta}
          />
          <Button title="Criar Consulta" onPress={criarConsultaTeste} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}