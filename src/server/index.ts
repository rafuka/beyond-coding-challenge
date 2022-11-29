import express, { Express, Request, Response } from 'express';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from "path";


type Influencer = {
  influencerName: string,
  iGName: string,
  category1: string,
  category2: string,
  followers: number,
  audienceCountry: string,
  authEngagement: number,
  engagementAvg: number
};


const app: Express = express();
const port = process.env.PORT || 3000;

const CSV_STARTING_LINE = 2; // Used to skip headers' line
const DATA_COLUMNS = [
  'influencerName',
  'iGName',
  'category1',
  'category2',
  'followers',
  'audienceCountry',
  'authEngagement',
  'engagementAvg'
];

let influencersData: Influencer[];

try {
  const csvPath = path.resolve(__dirname, '../../data/instagram_influencers.csv');
  const fileContent = fs.readFileSync(csvPath, { encoding: 'utf-8' });

  influencersData = parse(fileContent, {
    delimiter: ',',
    columns: DATA_COLUMNS,
    fromLine: CSV_STARTING_LINE,
    cast: (colValue, context) => { // Set values to integers for number type columns
      const { column } = context;

      if (column === 'followers' || column === 'authEngagement' || column === 'engagementAvg') {
        return convertToInteger(colValue);
      }

      return colValue;
    }
  });
} catch (err) {
  console.error(err);
  process.exit();
}


app.get('/', (req: Request, res: Response) => {
  res.send(influencersData);
});

app.get('/category/:catName', (req: Request, res: Response) => {
  const { catName } = req.params;
  const influencers = influencersData.filter(inf => inf.category1 === catName || inf.category2 === catName);
  
  res.send(influencers);
});

app.get('/country/:countryName', (req: Request, res: Response) => {
  const { countryName } = req.params;
  const influencers = influencersData.filter(inf => inf.audienceCountry === countryName);
  
  res.send(influencers);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});



function convertToInteger(strNumber: string): number {
  const num: number = parseFloat(strNumber);
  if (strNumber.includes('M')) return num * 1000000;
  else if (strNumber.includes('K')) return num * 1000;
  
  return parseInt(strNumber);
}