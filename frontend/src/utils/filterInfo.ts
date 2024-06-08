import { FilterItem, SortItem } from './types';

// Define your filter items array
export const filterItems: FilterItem[] = [
  { id: 1, value: 'Spring' },
  { id: 2, value: 'Summer' },
  { id: 3, value: 'Fall' },
  { id: 4, value: 'Winter' },
  { id: 5, value: 'Autumn' },
];

export const sortItem: SortItem[] = [
  { id: 0, value: 'id' },
  { id: 1, value: 'temperature' },
  { id: 2, value: 'humidity' },
  { id: 3, value: 'season' },
  { id: 4, value: 'created_at' },
  { id: 5, value: 'updated_at' },
  { id: 6, value: 'soil' },
];
