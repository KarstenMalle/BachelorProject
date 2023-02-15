import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const APPLICATION_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d';
const APPLICATION_SECRET = 'e85ae3fb2e7b72d5f709ae2a0753e89e6ddd2beab9042150a0deb8880b1ab489';
const REDIRECT_URI = 'http://localhost:4000/dashboard';

const client = new ApolloClient({
  uri: 'https://gitlab.com/api/graphql',
  cache: new InMemoryCache(),
});

const GET_TOKEN = gql`
  mutation GetToken($code: String!) {
    token: access_token(
      grant_type: "authorization_code",
      client_id: ${APPLICATION_ID},
      client_secret: "${APPLICATION_SECRET},
      code: $code,
      redirect_uri: ${REDIRECT_URI}
    ) {
      access_token
    }
  }
`;

const code = '<your-authorization-code>';

client
  .mutate({
    mutation: GET_TOKEN,
    variables: { code },
  })
  .then((result) => {
    const token = result.data.token.access_token;
    console.log(token);
  });
