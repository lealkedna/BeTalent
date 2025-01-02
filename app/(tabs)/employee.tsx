import React, {useState, useEffect } from 'react';
import {View, Text, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';


type Employee = {
    id: number;
    name: string;
    photo: string;
}


const EmployeeScreen: React.FC = () => {
    const [Employees, setEmployees] = useState<Employee[]>([]);
    const [search, setSearch] = useState<string>('');

     useEffect(() => {
    axios
      .get<Employee[]>('https://sua-api.com/employees') // Substitua pela URL real
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error(error));
  }, []);

  const filteredEmployees = Employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <View>
        <Text>Funcionários</Text>
        <TextInput
          placeholder='Pesquisar'
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
  }
});


export default EmployeeScreen;