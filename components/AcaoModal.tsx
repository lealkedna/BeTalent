import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
//import AsyncStorage from "@react-native-async-storage/async-storage";

export function AcaoModal({ 
  handleClose, 
  handleSubmit, 
  hoursWorked, 
  setHoursWorked, 
  date, 
  setDate, 
  hourValue, 
  setHourValue 
}) {

  const handleSave = () => {
    handleSubmit();
    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={{ flex: 1, zIndex: 9 }} onPress={handleClose}></TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.textSecundario}>Banco de Horas Extras</Text>

        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Data (dd/mm/aaaa)"
        />

        <TextInput
          style={styles.input}
          value={hoursWorked}
          onChangeText={setHoursWorked}
          keyboardType="numeric"
          placeholder="Quantidade de horas extras"
        />

        <TextInput
          style={styles.input}
          value={hourValue}
          onChangeText={setHourValue}
          keyboardType="numeric"
          placeholder="Valor da hora do funcionário"
        />

        <TouchableOpacity style={styles.salvar} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "#DFDFDF",
    marginVertical: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    // borderRadius: 10,
  },
  textSecundario: {
    color: '#201E1E',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'Helvetica',
    fontWeight: 200,
  },
  input: {
    height: 50,
    color: '#000',
    marginBottom: 15,
    paddingLeft: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderRadius: 6,
    marginTop: 8,
    padding: 8,
  },
  salvar: {
    zIndex: 99,
    backgroundColor: '#0000FF',
    borderRadius: 6,
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AcaoModal;
