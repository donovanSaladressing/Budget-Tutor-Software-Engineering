import { Text, View, StyleSheet, } from "react-native";

export default function Index() {
  return (
    <View style = {styles.container}>
      {/* TITLE */}
       <View style = {styles.mainPageHeader}>
        <Text style = {styles.budget}> Budget 
          <Text style = {styles.tutor}> Tutor </Text>
          </Text>
        </View>

        {/** HEADER */}\
        <View style = {styles.header}>
          <Text style = {styles.headerText}>Welcome back! </Text>
        </View>

        {/* RECENT PAYMENTS BOX */}
       <View style = {styles.recentPayments}> 
        <Text style = {styles.boldText}>
          Recent Transactions
        </Text>
        <Text style = {styles.normalText}>Oct. 6, 2025:     $150.00                           
        </Text>
        <Text style = {styles.normalText}>Oct. 6, 2025:     $150.00                             
        </Text>
        <Text style = {styles.normalText}>Oct. 6, 2025:     $150.00                             
        </Text>
       </View>

        {/* BUDGET OVERVIEW BOX */}
       <View style = {styles.budgetOverview}> 
        <Text style = {styles.boldText}>
          Spending Distribution
        </Text>
       </View>

      {/* ACCOUNT BALANCE BOX */}
       <View style = {styles.currentBalance}> 
        <Text style = {styles.boldText}>
          Current Balances
        </Text>
        <Text style = {styles.normalText}>Primary Account:    $150.00                     
        </Text>
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
    flex: .9,
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
  // BOX FOR RECENT PAYMENTS
  recentPayments: {
    flex: 1.5,
    margin: 20,
    borderRadius: 10,
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "#dededeff",
  }, 

// BOX FOR BUDGET OVERVIEW
  budgetOverview: {
    flex: 2,
    margin: 20,
    borderRadius: 10,
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "#dededeff",
  }, 
  // BOX FOR CRURRENT BALANCE
   currentBalance: {
    flex: .9,
    margin: 20,
    borderRadius: 10,
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "#dededeff",
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

