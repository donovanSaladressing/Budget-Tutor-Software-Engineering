import { Text, View, StyleSheet } from "react-native";

export default function Transactions() {
    return (
        <View style={styles.container}>
              {/* TITLE */}
              <View style = {styles.mainPageHeader}>
                <Text style = {styles.budget}> Budget 
                  <Text style = {styles.tutor}> Tutor </Text>
                </Text>
              </View>
              {/** HEADER */}\
              <View style = {styles.header}>
                <Text style = {styles.headerText}>Recent Transactions</Text>
              </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // TITLE/HEADER STYLES
  mainPageHeader: {
    flex: .13,
    marginBottom: 10,
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "#dededeff",
  }, 
  budget: {
    color: '#0097B2',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 40,
  },
  tutor: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 40,
  },
  // BOX FOR HEADER
  header: {
    flex: 0.5,
    margin: 10, 
  },

// DIFFERENT TEXT STYLES
headerText: {
  color: 'black',
  fontWeight: 'bold',
  marginTop: 20,
  marginLeft: 20,
  fontSize: 25,
},
boldText: {
  color: 'black',
  fontWeight: 'bold',
  marginTop: 20,
  marginLeft: 20,
  fontSize: 20,
},
normalText: {
  color: "#939393ff",
  marginTop: 12,
  marginLeft: 20,
  marginRight: 20,
  fontSize: 18,
},
});

