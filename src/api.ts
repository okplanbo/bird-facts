/*

To replace mock data with real API calls we can use react-query and axios like so:

App.tsx

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
	...routes
</QueryClientProvider>

api.ts

import axios from "axios";

export const fetchMessages = async ({
  authors = [],
  searchQuery = '',
  page = 0,
  limit = 10,
}) => {
  const { data } = await axios.get('/api/messages', {
    params: {
      authors: authors.join(','),
      searchQuery,
      page,
      limit,
    },
  });
  return data;
};

export const fetchAuthors = async () => {
  const { data } = await axios.get("/api/authors");
  return data;
};

to call and receive:

import { useQuery } from "react-query";
import { fetchMessages, fetchAuthors } from ":src/api";

export const Home: React.FC<HomeProps> = ({ addMessage }) => {
  const { data: authors, isLoading: loadingAuthors } = useQuery("authors", fetchAuthors);
  const fetchMessagesWithParams = ({ pageParam = 0 }) =>
    fetchMessages({
      authors: selectedAuthors,
      searchQuery: searchValue,
      page: pageParam,
      limit: 10
    });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery('messages', fetchMessagesWithParams, {
    getNextPageParam: (lastPage) => lastPage.hasMore && lastPage.page + 1,
  });


  if (loadingMessages || loadingAuthors) {
    return <div>Loading...</div>;
  }

...
  
  
For optimisation and security purposes we may first of all request and receive visible chunk of messages,
only then request author info by id as needed.

to send new message data we may use something like:
const response = await axios.post('/api/messages', message);

*/