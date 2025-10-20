import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList ,Text, View, StyleSheet } from "react-native";


export default function Accounts() {
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
        <Text style = {styles.headerText}>Cards and Accounts </Text>
      </View>
      {/* DEBIT BOX */}
      <Text style = {styles.cardTitles}>Debit Cards </Text>
      <View style = {styles.cardBox}>
        <Text style = {styles.boldText}>Primary Account</Text>
        <Text style = {styles.normalText}>Financial Insitution </Text>
        <Text style = {styles.balanceAmount}>$25,000.00 </Text>
        <Text style = {styles.normalText}>Current Balance </Text>
        <Text style = {styles.normalText}>Most Recent Transaction: $450.71                  </Text>
      </View>
      {/* CREDIT BOX */}
      <Text style = {styles.cardTitles}>Credit Cards </Text>
      <View style = {styles.cardBox}>
        <Text style = {styles.boldText}>Primary Account</Text>
        <Text style = {styles.normalText}>Financial Insitution </Text>
        <Text style = {styles.balanceAmount}>$500 </Text>
        <Text style = {styles.normalText}>Amount Owed </Text>
        <Text style = {styles.normalText}> 
          Payment Due: November 16, 2025</Text>
      </View>

      {/* INTEGRATE NEW CARDS */}
      <View style = {styles.integrationBox}> 
        <Text style = {styles.integrationText}>Integrate More Cards</Text>
        </View>
    </View>
  );
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bhuvanesh_db_user:<db_password>@expensetracker.sqthx1n.mongodb.net/?retryWrites=true&w=majority&appName=ExpenseTracker";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // TITLE/HEADER STYLES
  mainPageHeader: {
    flex: 1.025,
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
    flex: .5,
    margin: 10, 
  },

  // CARD BOXES
  cardBox: {
    flex: 2,
    margin: 20,
    borderRadius: 10,
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: "#dededeff",
  },
  // INTEGRATION BOX
  integrationBox: {
    flex: .5,
  },

  // DIFFERENT TEXT STYLES
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 25,
  },
  cardTitles: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 21,
  },
  balanceAmount: {
    color: "#939393ff",
    marginTop: 10,
    marginLeft: 20,
    fontSize: 35,
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
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
  },
  integrationText: {
    color: "#939393ff",
    marginTop: 7,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});