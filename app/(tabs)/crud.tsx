import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Employee {
  name: string;
  matricula: string;
  hoursWorked: string;
  date: string;
  hourValue: string;
  totalToPay: number;
}

const TaskForm = () => {
  const [dataList, setDataList] = useState<Employee[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Employee>({
    name: '',
    matricula: '',
    hoursWorked: '',
    date: '',
    hourValue: '',
    totalToPay: 0,
  });

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

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        try {
          const storedData = await AsyncStorage.getItem("@employee_data");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setDataList(parsedData);
          }
        } catch (error) {
          console.log("Erro ao recuperar dados:", error);
        }
      };
      getData();
    }, [modalVisible])
  );
  

  const deleteData = async (index: number) => {
    try {
      const updatedData = [...dataList];
      updatedData.splice(index, 1);
      await AsyncStorage.setItem('@employee_data', JSON.stringify(updatedData));
      setDataList(updatedData);
    } catch (error) {
      console.log('Erro ao excluir:', error);
    }
  };

  const editData = (index: number) => {
    const selectedItem = dataList[index];
  
    setFormData({
      name: selectedItem.name,
      matricula: selectedItem.matricula,
      hoursWorked: selectedItem.hoursWorked,
      date: selectedItem.date,
      hourValue: selectedItem.hourValue,
      totalToPay: selectedItem.totalToPay
    });
  
    setEditIndex(index);
    setModalVisible(true);
  };
  

  const saveEditData = async () => {
    if (editIndex !== null) {
      try {
        let updatedData = [...dataList];
        updatedData[editIndex] = {
          ...formData,
          totalToPay: parseFloat(formData.hoursWorked) * parseFloat(formData.hourValue) // Recalcula o total
        };
  
        await AsyncStorage.setItem('@employee_data', JSON.stringify(updatedData)); // Salva no AsyncStorage
        setDataList(updatedData); 
        setModalVisible(false);
        setEditIndex(null);

        getData();

      } catch (error) {
        console.log("Erro ao editar:", error);
      }
    }
  };
  
  

  const renderItem = ({ item, index }: { item: Employee; index: number }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>R${item.totalToPay.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => editData(index)} style={styles.button}>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteData(index)} style={styles.button}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.textoPrimario}>
        <Text style={styles.Be}>Be</Text>
        <Text style={styles.text}>Talent</Text>
      </View>
      <Text style={styles.textSecudario}>Banco de Horas Extras</Text>
      <FlatList data={dataList} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />

      {/* Modal para Edição */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Registro</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={formData.hoursWorked}
              onChangeText={(text) => setFormData({ ...formData, hoursWorked: text })}
              placeholder="Horas Extras"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={formData.hourValue}
              onChangeText={(text) => setFormData({ ...formData, hourValue: text })}
              placeholder="Valor por Hora"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveEditData}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  textoPrimario: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Poppins',
    color: '#000',
    fontWeight: '400',
  },
  Be: {
    color: '#000',
    fontSize: 40,
    fontFamily: 'Poppins',
    fontWeight: '900',
  },
  textSecudario: {
    color: '#000',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Poppins',
    fontWeight: '200',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    marginHorizontal: 10,
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
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
