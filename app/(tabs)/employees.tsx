import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";

type Employee = {
  id: number;
  name: string;
  job: string;
  admission_date: string;
  phone: string;
  image: string;
};

const EmployeeScreen: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]); // 🔹 Inicializa corretamente como array vazio
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<{ employees: Employee[] }>(
          "https://gist.githubusercontent.com/EmilenyRochaLeal/4e22d0ab8a76c9e8774928ce6ac8634d/raw/644b704288a98fdb49adbaf552aceeb44189a7f4/dados.json"
        );

        // console.log("Dados recebidos da API:", response.data); 

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

  const filteredEmployees = employees ? employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  ) : []; 

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Funcionários</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Campo de Pesquisa */}
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

      {/* Exibe um indicador de carregamento enquanto busca os dados */}
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.employeeItem}>
              <Image source={{ uri: item.image }} style={styles.employeeImage} />
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeName}>{item.name}</Text>
                <Text style={styles.employeeJob}>{item.job}</Text>
              </View>
              <TouchableOpacity>
                <AntDesign name="down" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
});

export default EmployeeScreen;
