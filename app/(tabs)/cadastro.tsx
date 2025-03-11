import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// SQLite.enablePromise(true);  

type BancoHora = {
  nome: string;
  matricula: string;
  qtdHoras: number;
  data: string;
  valorHora: number;
};

const App = () => {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [qtdHoras, setQtdHoras] = useState('');
  const [data, setData] = useState('');
  const [valorHora, setValorHora] = useState('');
  const [funcionarios, setFuncionarios] = useState<BancoHora[]>([]);

  useEffect(() => {
    const initDB = async () => {
      const db = await SQLite.openDatabase({ name: 'bancoHoras.db', location: 'default' });
      await db.executeSql(
        'CREATE TABLE IF NOT EXISTS funcionarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, matricula TEXT, qtdHoras INTEGER, data TEXT, valorHora REAL)'
      );
      loadFuncionarios();
    };
    initDB();
  }, []);

  const loadFuncionarios = async () => {
    const db = await SQLite.openDatabase({ name: 'bancoHoras.db', location: 'default' });
    const results = await db.executeSql('SELECT * FROM funcionarios');
    const funcionariosData = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      funcionariosData.push(results[0].rows.item(i));
    }
    setFuncionarios(funcionariosData);
  };

  const salvar = async () => {
    const db = await SQLite.openDatabase({ name: 'bancoHoras.db', location: 'default' });
    await db.executeSql(
      'INSERT INTO funcionarios (nome, matricula, qtdHoras, data, valorHora) VALUES (?, ?, ?, ?, ?)',
      [nome, matricula, qtdHoras, data, valorHora]
    );
    loadFuncionarios();
    Alert.alert(
      'Sucesso!', 
      'Funcionário cadastrado com sucesso!', 
      [{ text: 'OK', onPress: () => console.log('Usuário clicou em OK') }]
    );
  };

  const excluir = async (id:string) => {
    const db = await SQLite.openDatabase({ name: 'bancoHoras.db', location: 'default' });
    await db.executeSql('DELETE FROM funcionarios WHERE id = ?', [id]);
    loadFuncionarios();
  };

  const editar = (item: BancoHora) => {
    setNome(item.nome);
    setMatricula(item.matricula);
    setQtdHoras(item.qtdHoras.toString());
    setData(item.data);
    setValorHora(item.valorHora.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BeTalent</Text>
      <Text style={styles.subTitle}>Banco de Horas Extras</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Funcionário"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <TextInput
        style={styles.input}
        placeholder="Qtd horas Extras"
        value={qtdHoras}
        onChangeText={setQtdHoras}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da hora"
        value={valorHora}
        onChangeText={setValorHora}
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={salvar} />

      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <Text style={styles.itemText}>R$ {item.qtdHoras * item.valorHora}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editar(item)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.matricula)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0000FF',
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2F3D92',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  itemText: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  edit: {
    color: 'yellow',
    marginRight: 10,
  },
  delete: {
    color: 'red',
  },
});

export default App;
