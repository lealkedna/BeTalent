import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { Ionicons, AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AcaoModal from "@/components/AcaoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Employee = {
  id: number;
  name: string;
  job: string;
  admission_date: string;
  phone: string;
  image: string;
};

const EmployeeScreen: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [hourValue, setHourValue] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<{ employees: Employee[] }>(
          "https://gist.githubusercontent.com/EmilenyRochaLeal/4e22d0ab8a76c9e8774928ce6ac8634d/raw/1e2fc8453d16f06c7ead6a7bedc96842249bab46/dados.json"
        );

        if (response.data && Array.isArray(response.data.employees)) {
          setEmployees(response.data.employees);
        } else {
          console.error("Erro: A API não retornou um array válido dentro de 'employees'.");
          setEmployees([]);
        }
      } catch (error) {
        console.error("Erro ao buscar os funcionários:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const calculateTotal = () => {
    if (hoursWorked && hourValue) {
      return parseFloat(hoursWorked) * parseFloat(hourValue);
    }
    return 0;
  };

  // const saveData = async (employeeId: number, hoursWorked: string, date: string, hourValue: string) => {
  //   try {
  //     const total = calculateTotal();
  //     const data = { employeeId, hoursWorked, date, hourValue, total };

  //     const storedData = await AsyncStorage.getItem("@employee_hours");
  //     let parsedData = storedData ? JSON.parse(storedData) : [];
  //     parsedData.push(data);

  //     await AsyncStorage.setItem("@employee_hours", JSON.stringify(parsedData));
  //     console.log("Dados salvos:", data);
  //   } catch (error) {
  //     console.log("Erro ao salvar dados:", error);
  //   }
  // };


  const saveData = async (id: number, hoursWorked: string, date: string, hourValue: string) => {
    if (selectedEmployee && hoursWorked && date && hourValue) {
      try {
        const total = parseFloat(hoursWorked) * parseFloat(hourValue);
        const newData = {
          name: selectedEmployee.name, 
          matricula: selectedEmployee.id.toString(),
          hoursWorked,
          date,
          hourValue,
          totalToPay: total
        };
  
        const storedData = await AsyncStorage.getItem("@employee_data");
        let parsedData = storedData ? JSON.parse(storedData) : [];
        parsedData.push(newData);
  
        await AsyncStorage.setItem("@employee_data", JSON.stringify(parsedData));
  
        console.log("Dados salvos:", newData);
  
    
        setTimeout(() => {
          setHoursWorked("");
          setDate("");
          setHourValue("");
        }, 500);
      } catch (error) {
        console.log("Erro ao salvar dados:", error);
      }
    } else {
      console.log("Preencha todos os campos!");
    }
  };
  

  const handleSubmit = () => {
    if (selectedEmployee && hoursWorked && date && hourValue) {
      saveData(selectedEmployee.id, hoursWorked, date, hourValue);

      setHoursWorked("");
      setDate("");
      setHourValue("");
      setVisibleModal(false);
    } else {
      console.log("Preencha todos os campos!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Funcionários</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={employees.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.employeeItem}>
              <View style={styles.horizontalContainer}>
                <Image source={{ uri: item.image }} style={styles.employeeImage} />
                <Text style={styles.employeeName}>{item.name}</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                  setSelectedEmployee(item);
                  setVisibleModal(true);
                }}>
                  <MaterialIcons name="more-time" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={visibleModal} transparent={true} onRequestClose={() => setVisibleModal(false)} animationType="slide">
        <AcaoModal
          handleClose={() => setVisibleModal(false)}
          handleSubmit={handleSubmit}
          hoursWorked={hoursWorked}
          setHoursWorked={setHoursWorked}
          date={date}
          setDate={setDate}
          hourValue={hourValue}
          setHourValue={setHourValue}
        />
      </Modal>
    </View>
  );
};

export default EmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    paddingTop: 29,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    // padding: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  employeeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageAndNameContainer:{
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1,
  }, 
  employeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  employeeJob: {
    fontSize: 14,
    color: "gray",
  },
  detailsContainer: {
    marginTop: 10, 
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  button:{
    backgroundColor: 'black'
  }
});