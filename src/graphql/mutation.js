import gql from "graphql-tag";

const addToDo = gql`
  mutation addTodo($name: String!) {
    addTodo(name: $name) {
      id
    }
  }
`;

export { addToDo };
