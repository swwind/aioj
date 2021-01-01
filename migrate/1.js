const mongodb = require('mongodb');

(async () => {
  
  const client = new mongodb.MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
  
  await client.connect();
  
  const db = client.db('attack204_ak_world_final');
  
  const regions = db.collection('region');
  
  const rs = await regions.find({ }).toArray();

  await Promise.all(rs.map((s) => {
    return regions.findOneAndUpdate(s, {
      $set: {
        hidden: false,
      }
    });
  }));

  console.log('success');
  process.exit(0);
  
})();