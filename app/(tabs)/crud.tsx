import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo a interface para os dados do funcionário
interface Employee {
  name: string;
  matricula: string;
  hoursWorked: string;
  date: string;
  hourValue: string;
  totalToPay: number;
}

const TaskForm = () => {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [date, setDate] = useState('');
  const [hourValue, setHourValue] = useState('');
  const [totalToPay, setTotalToPay] = useState<number | null>(null);
  const [dataList, setDataList] = useState<Employee[]>([]); // Tipando dataList como um array de Employee

  // Função para calcular o total a pagar
  const calculateTotal = () => {
    if (hoursWorked && hourValue) {
      return parseFloat(hoursWorked) * parseFloat(hourValue);
    }
    return 0;
  };

  // Função para salvar os dados no AsyncStorage
  const saveData = async (name:string, matricula:string, hoursWorked:string, date:string, hourValue:string, totalToPay:number) => {
    try {
      const data: Employee = {
        name,
        matricula,
        hoursWorked,
        date,
        hourValue,
        totalToPay,
      };

      const storedData = await AsyncStorage.getItem('@employee_data');
      let parsedData: Employee[] = storedData ? JSON.parse(storedData) : [];
      parsedData.push(data); // Adiciona o novo dado

      await AsyncStorage.setItem('@employee_data', JSON.stringify(parsedData));
      console.log('Dados salvos com sucesso!');
      setDataList(parsedData); // Atualiza a lista na tela
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  };

  // Função para recuperar dados
  const getData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@employee_data');
      if (storedData) {
        setDataList(JSON.parse(storedData));
      }
    } catch (error) {
      console.log('Erro ao recuperar dados:', error);
    }
  };

  // Função para excluir um item
  const deleteData = async (index: number) => {
    try {
      const storedData = await AsyncStorage.getItem('@employee_data');
      let parsedData: Employee[] = storedData ? JSON.parse(storedData) : [];
      parsedData.splice(index, 1); // Remove o item

      await AsyncStorage.setItem('@employee_data', JSON.stringify(parsedData));
      setDataList(parsedData); // Atualiza a lista na tela
    } catch (error) {
      console.log('Erro ao excluir dados:', error);
    }
  };

  // Função para editar um item (exemplo simples: apenas reatualizar com novos dados)
  const editData = (index: number) => {
    const itemToEdit = dataList[index];
    setName(itemToEdit.name);
    setMatricula(itemToEdit.matricula);
    setHoursWorked(itemToEdit.hoursWorked);
    setDate(itemToEdit.date);
    setHourValue(itemToEdit.hourValue);
    setTotalToPay(itemToEdit.totalToPay);
    deleteData(index); // Exclui o item para substituir com os novos dados
  };

  // Função para enviar os dados
  const handleSubmit = () => {
    if (name && matricula && hoursWorked && date && hourValue) {
      const total = calculateTotal();
      setTotalToPay(total); // Atualiza o total a pagar

      // Salva os dados no AsyncStorage
      saveData(name, matricula, hoursWorked, date, hourValue, total);

      // Resetando os campos após o envio
      setName('');
      setMatricula('');
      setHoursWorked('');
      setDate('');
      setHourValue('');
    } else {
      console.log('Preencha todos os campos!');
    }
  };

  useEffect(() => {
    getData(); // Recupera os dados salvos ao carregar o componente
  }, []);

  // Renderizando a lista de dados
  const renderItem = ({ item, index }: { item: Employee, index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>{item.date}</Text>
      <Text style={styles.itemText}>R${item.totalToPay.toFixed(2)}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => editData(index)} style={styles.button}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteData(index)} style={styles.button}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.formContainer}>
      <Text>Nome do Funcionário</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome completo"
      />

      <Text>Matrícula</Text>
      <TextInput
        style={styles.input}
        value={matricula}
        onChangeText={setMatricula}
        placeholder="Número de matrícula"
        keyboardType="numeric"
      />

      <Text>Quantidade de Horas Extras</Text>
      <TextInput
        style={styles.input}
        value={hoursWorked}
        onChangeText={setHoursWorked}
        placeholder="Quantidade de horas extras"
        keyboardType="numeric"
      />

      <Text>Data</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Data (dd/mm/aaaa)"
      />

      <Text>Valor da Hora</Text>
      <TextInput
        style={styles.input}
        value={hourValue}
        onChangeText={setHourValue}
        placeholder="Valor da hora do funcionário"
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={handleSubmit} />

      {/* Exibindo a lista de dados */}
      <FlatList
        data={dataList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    width: '30%',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  button: {
    padding: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default TaskForm;
