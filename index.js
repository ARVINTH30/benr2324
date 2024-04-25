  const express = require('express');
  const bcrypt = require('bcrypt');
  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

  const app = express();
  const port = process.env.PORT || 3004; // Change the port number

  app.use(express.json());

  //new user registration
  app.post('/user:username', async (req, res) => {
    //console.log(req.body);
    const hash = bcrypt.hashSync(req.body.password, 10);

    //insertOne
    let result = await client.db('Mlbb').collection('Heroes').insertOne({
      username: req.body.username,  
      password: hash,
      name: req.body.name,
      email: req.body.email
    });

    res.send(result);
  });

  app.post('/login', async (req, res) => {
    //username: req.body.username
    //password: req.body.password
    //step 1: check if the user exists
    client.db('Mlbb').collection('Heroes').findOne(
      {username: req.body.username}
    );
      
    if(!result){
      res.send("User not found");
      console.log(result); 
    } else{
      //step 2: check if the password is correct
      //result.password = req.body.password
      if (bcrypt.compareSync(req.body.password, result.password)== true){
        res.send("Login successful");
      } else{
        res.send("Password is incorrect");
      }
    }
  });

  //get user profile
  app.get('/user/:id',async (req, res) => {
    let result = await client.db('Mlbb').collection('Heroes').findOne({
    _id: new ObjectId(req.params.id)
  })

  res.send(result)
  })
    //findOne
    //console.log("get user profile");

  //update user account
  app.patch('/user/:id', async (req, res) => {
    let result = await client.db('Mlbb').collection('Heroes').updateOne(

      {
        _id: new ObjectId(req.params.id)
      },
      {
        $set: {
          name: req.body.name,
        }
      }

    )

    //updateOne
    res.send(result)
  });

  //delete user account
  app.delete('/user/:id', async(req, res) => {
    //deleteOne
    let result = await client.db('Mlbb').collection('Heroes').deleteOne(
      {
        _id: new ObjectId(req.params.id)
      }
    )
    res.send(result)
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });


  const uri = "mongodb+srv://Vintoi:Vintoi@cluster0.p4r5qu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      await client.connect();
      console.log("Connected successfully to server");
    } finally {
      // Perform necessary actions, if any, when connection is closed
    }
  }
  run().catch(console.dir);
