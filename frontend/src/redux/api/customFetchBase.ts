import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

// Define the base URL for the API endpoint
const baseUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/api/`;

// Create the base query with the defined base URL
const baseQuery = fetchBaseQuery({
  baseUrl,
});

// Create a basic fetch base query without authentication handling
const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Execute the base query with the provided arguments, API, and extra options
  const result = await baseQuery(args, api, extraOptions);
  console.log('result =======>', result);
  return result; // Return the result of the query
};

// Export the custom fetch base query
export default customFetchBase;
