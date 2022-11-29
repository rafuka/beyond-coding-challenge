import axios from 'axios';
import prompt from 'prompt';

import { sortData, onError } from './helpers';


const promptSchema = {
  properties: {
    option: {
      pattern: /^cat$|^country$/,
      description: `Please input one of the following options to retrieve influencer data:
        - "cat" to retrieve by category
        - "country" to retrieve by country
      `,
      message: 'Invalid option',
      required: true
    }
  }
};

const catSchema = {
  properties: {
    value: {
      description: `Please input category name`,
      message: 'Invalid category name',
      required: true
    }
  }
}

const countrySchema = {
  properties: {
    value: {
      description: `Please input country name`,
      message: 'Invalid country name',
      required: true
    }
  }
};

const sortSchema = {
  properties: {
    sortOption: {
      pattern: /^f$|^e$|^a$/,
      description: `Please input one of the following options to sort the data:
        - "f" to sort by followers
        - "e" to sort by engagement average
        - "a" to sort by authentic engagement

        Leave empty for no sorting.
      `,
      message: 'Invalid option',
      required: false
    }
  }
}


prompt.start();

async function main() {
  const { option } = await prompt.get(promptSchema);

  const schema = option === 'cat' ? catSchema : countrySchema;
  const pathname = option === 'cat' ? 'category' : 'country';

  const { value } = await prompt.get(schema);

  console.log(`Retrieving influencers data by ${pathname} name:`, value, '...');

  const resp = await axios.get(`http://localhost:3000/${pathname}/${value}`);
  const { data: influencerData } = resp;

  console.log('Data fetched.');

  const { sortOption } = await prompt.get(sortSchema);

  const sortedData = sortData(sortOption as string, influencerData);
  console.table(sortedData);
}

main();
