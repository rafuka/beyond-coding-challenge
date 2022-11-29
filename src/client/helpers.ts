import { Influencer } from "../types";

export function sortData(option: string, data: Influencer[]): Influencer[] {
  const optionPropMap: { [index: string]: string } = {
    f: 'followers',
    e: 'engagementAvg',
    a: 'authEngagement'
  };

  const prop: string = optionPropMap[option];

  if (!prop) return data;

  return data.sort((a, b) => (b[prop] as number) - (a[prop] as number));
}

export function onError(error: any) {
  if (error) {
    console.error(error);
    process.exit();
  }
}
