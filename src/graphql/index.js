import gql from "graphql-tag";

const todos = gql`
  query todos {
    todos {
      id
      name
    }
  }
`;

export { todos };
