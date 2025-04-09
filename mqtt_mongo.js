
//MQTT-välityspalvelimen määrittely
const mqtt = require('mqtt');
const express = require('express'); // Add this line
const app = express(); // Add this line
const broker = 'mqtt://test.mosquitto.org';
const user = '';
const pw = ''; 
const PORT = process.env.PORT || 3000; 

//määritellään välityspalvelimen "olio"
mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

//tilataan oikea topic
mq.subscribe('automaatio/#');

//liitytään välityspalvelimeen
mq.on('connect', function(){
    console.log('Connected.....');
});

//Määritellään tietokanta-API
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mustafamahmood:mustama@cluster0.wvfzf.mongodb.net/sensordata?retryWrites=true&w=majority&useUnifiedTopology=true";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//määritellään tietokannan ja kokoelman nimi sekä dataobjekti sensoridatan käsittelyyn
const myDB = client.db("sensordata2");
const myColl = myDB.collection("sensordata2");
var obj;

//odotetaan dataa välityspalvelimelta ja viedään data tietokantaan
mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj.Time, obj.T, obj.H, obj.DP, obj.pCount);
	myColl.insertOne(obj);
	console.log(
	`An entry was inserted successfully`,
	);
});


app.get('/', (req, res) => {
  res.send('MQTT to MongoDB service is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



