import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const saveData = async (name: string, matricula: string, hoursWorked: string, date: string, hourValue: string, totalToPay: number) => {
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
      parsedData.splice(index, 1); 

      await AsyncStorage.setItem('@employee_data', JSON.stringify(parsedData));
      setDataList(parsedData); 
    } catch (error) {
      console.log('Erro ao excluir dados:', error);
    }
  };

  // Função para editar um item 
  const editData = (index: number) => {
    const itemToEdit = dataList[index];
    setName(itemToEdit.name);
    setMatricula(itemToEdit.matricula);
    setHoursWorked(itemToEdit.hoursWorked);
    setDate(itemToEdit.date);
    setHourValue(itemToEdit.hourValue);
    setTotalToPay(itemToEdit.totalToPay);
    deleteData(index); 
  };

  // Função para enviar os dados
  const handleSubmit = () => {
    if (name && matricula && hoursWorked && date && hourValue) {
      const total = calculateTotal();
      setTotalToPay(total); 

      saveData(name, matricula, hoursWorked, date, hourValue, total);


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
    getData(); 
  }, []);

  // Renderizando a lista de dados
  const renderItem = ({ item, index }: { item: Employee, index: number }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>R${item.totalToPay.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => editData(index)} style={styles.button}>
          <Text style={styles.buttonText}><Feather name="edit" size={24} color="black" /></Text> {/* Icone de editar */}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteData(index)} style={styles.button}>
          <Text style={styles.buttonText}><AntDesign name="delete" size={24} color="black" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textoPrimario}>
        <Text style={styles.Be}>Be</Text>
        <Text style={styles.text} >Talent</Text>
      </View>
      <Text style={styles.textSecudario}>Banco de Horas Extras</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome completo"
      />

      <View style={styles.campos}>
        <TextInput
          style={styles.input}
          value={matricula}
          onChangeText={setMatricula}
          placeholder="Matrícula"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Data (dd/mm/aaaa)"
        />
      </View>

      <TextInput
        style={styles.input}
        value={hoursWorked}
        onChangeText={setHoursWorked}
        placeholder="Quantidade de horas extras"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={hourValue}
        onChangeText={setHourValue}
        placeholder="Valor da hora do funcionário"
        keyboardType="numeric"
      />

      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.salvar} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Exibindo a lista de dados */}
      <FlatList
        data={dataList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#fff',
    color: '#000',
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  textoPrimario:{
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign:'center',
  }, 
  text: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: 400,
  },
  Be: {
    color: '#000',
    fontSize: 40,
    fontFamily: 'Poppins',
    fontWeight: 900,
  },
  textSecudario: {
    color: '#000',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Poppins',
    fontWeight: 200,

  },
  input: {
    height: 50,
    color: '#000',
    marginBottom: 15,
    paddingLeft: 10,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },

  containerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 40,
  },
  salvar: {
    padding: 15,
    backgroundColor: '#0000FF',
    width: 180,
    color: 'red',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  campos: {
    flexDirection: 'row',
    gap: 15,
  },


  // Parte de renderizar os itens
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    marginHorizontal: 10
  },
  itemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
  },
  itemText: {
    fontSize: 16,
    width: '45%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff', 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default TaskForm;
