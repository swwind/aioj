import mongodb from 'mongodb';
import config from '../config.json';

const client = new mongodb.MongoClient(config.mongo.url, { useUnifiedTopology: true });

await client.connect();

const db = client.db(config.mongo.dbname);

const regions = db.collection('region');

const rs = await regions.find({ }).toArray();

await Promise.all(rs.map((s) => {
  return regions.findOneAndUpdate(s, {
    $set: {
      hidden: false,
    }
  });
}));
