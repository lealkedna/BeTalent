import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id); 
  };

  const formatDate = (admission_date: string) => {
    const date = new Date(admission_date); 
    return date.toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    const pais = phone.substring(0, 2);
    const ddd = phone.substring(2, 4)
    const part1 = phone.substring(4, 9);
    const part2 = phone.substring(9);
    return `+${pais} (${ddd}) ${part1}-${part2}`;
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={30} color="black" />
        <Ionicons name="notifications-outline" size={30} color="black" />
      </View>

      {/* Campo de Pesquisa */}
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

      {/* Exibe um indicador de carregamento enquanto busca os dados */}
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.employeeItem}>
              <View style={styles.horizontalContainer}>
              <View style={styles.imageAndNameContainer}>
                <Image source={{ uri: item.image }} style={styles.employeeImage} />
                <Text style={styles.employeeName}>{item.name}</Text>
               </View>
                <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                  <AntDesign
                    name={expandedId === item.id ? "up" : "down"} 
                    size={16}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {expandedId === item.id && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Cargo:</Text> {item.job}
                  </Text>
                  <Text style={styles.detailText}><Text style={styles.bold}>Data de admissão:</Text> {formatDate(item.admission_date)}</Text>
                  <Text style={styles.detailText}><Text style={styles.bold}>Telefone:</Text>  {formatPhone(item.phone)}</Text>
                </View>
              )}

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
});

export default EmployeeScreen;
