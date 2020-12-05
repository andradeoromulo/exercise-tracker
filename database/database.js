  
const mongoose = require("mongoose");

exports.connect = () => {

    const uri = process.env.ATLAS_URI;
    const connectionParams = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    };
    
    mongoose.connect(uri, connectionParams)
      .then(() =>
        console.log("Database successfully connected")
      )
      .catch((err) => 
        console.log(`Error connecting to the database:\n${err}`)  
      );
    
    return mongoose.connection;

};