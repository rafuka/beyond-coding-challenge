import express, { Express, Request, Response } from 'express';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from "path";


type Influencer = {
  influencerName: string,
  IGName: string,
  category1: string,
  category2: string,
  followers: string,
  audienceCountry: string,
  authEngagement: string,
  engagementAvg: string
};

const app: Express = express();
const port = process.env.PORT || 3000;

const CSV_STARTING_LINE = 2; // Used to skip headers' line

app.get('/', (req: Request, res: Response) => {
  const csvPath = path.resolve(__dirname, '../../data/instagram_influencers.csv');
  const fileContent = fs.readFileSync(csvPath, { encoding: 'utf-8' });
  const columns = [
    'Name',
    'Instagram Name',
    'Category 1',
    'Category 2',
    'Followers #',
    'Audience Country (mostly)',
    'Authentic engagement',
    'Engagement average'
  ];

  parse(fileContent, {
    delimiter: ',',
    columns,
    from_line: CSV_STARTING_LINE
  }, (err, data: Influencer[]) => {
    if (err) {
      res.send(err);
    }

    res.send(data);
  })
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});