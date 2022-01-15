import React, { useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { todos } from "./graphql";
import { useMutation } from "@apollo/react-hooks";
import { FinedeedsAppClient } from "./graphql-clients";
import { addToDo } from "./graphql/mutation";

const Home = () => {
  const { data, loading } = useQuery(todos);
  const [AddTodo, { error }] = useMutation(addToDo);
  const [name, setName] = useState("");
  if (loading) return <p>Loading...</p>;

  const addToDoHandler = async () => {
    try {
      AddTodo({
        variables: {
          name,
        },
      });
      // FinedeedsAppClient.mutate({
      //   mutation: addToDo,
      // variables: {
      //   name,
      // },
      // });
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return (
    <div>
      {data?.todos?.length &&
        data?.todos?.map((x, i) => <div key={i}>{x?.name}</div>)}
      <section>
        <div>
          <label>Name</label>
          <input onChange={(e) => setName(e.target.value)} type="text" />
          <button onClick={addToDoHandler}>Add Todo</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
