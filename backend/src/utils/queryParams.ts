interface QueryParams {
  [key: string]: any;
}

// Function to parse query parameters with operators
export const parseFilters = (query: QueryParams): QueryParams => {
  const excludedFields = ['sort', 'sortOrder', 'page', 'limit', 'fields'];
  const filters: QueryParams = {};

  for (const key in query) {
    if (excludedFields.includes(key)) {
      continue; // Skip excluded fields
    }

    let value = query[key];

    // Handle advanced filtering with operators
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      try {
        value = JSON.parse(value); // Parse JSON-like strings
      } catch (error) {
        throw new Error(`Invalid filter format for key ${key}`);
      }
    }

    if (typeof value === 'object') {
      for (const operator in value) {
        const operatorValue = value[operator];

        switch (operator) {
          case 'eq':
            filters[key] = operatorValue;
            break;
          case 'neq':
            filters[key] = { $ne: operatorValue };
            break;
          case 'gte':
            filters[key] = { $gte: operatorValue };
            break;
          case 'lte':
            filters[key] = { $lte: operatorValue };
            break;
          default:
            throw new Error(`Unknown operator: ${operator}`);
        }
      }
    } else {
      // If no operator, treat it as an exact match
      filters[key] = value;
    }
  }

  return filters;
};
