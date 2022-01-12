import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function DataForm({ getItems, insertItem }) {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const sendDataToApi = async (e) => {
    e.preventDefault();

    await insertItem({name,job});
    await getItems();

    setName("");
    setJob("");

  };

  return (
    <div>
      <form onSubmit={sendDataToApi}>
        <div>
          <input
            type="text"
            value={name}
            placeholder="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="text"
            value={job}
            placeholder="job"
            onChange={(e) => {
              setJob(e.target.value);
            }}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
function DataTable({ dataItems, deleteItem }) {

  const deleteFromTable = async (id) =>{
    await deleteItem(id);
  }

  if (!dataItems || dataItems.length===0){
    return (<div>Use the form to enter a document.</div>)
  } else {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Job</th>
          <th>           
            {dataItems.length > 0 && (
              <button onClick={() => deleteFromTable()}>Delete all</button>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {dataItems.map((item) => {
          const id = item._id.toString();
          return (
            <tr key={id} id={id}>
              <td>{item.name}</td>
              <td>{item.job}</td>
              <td>
                <button onClick={() => deleteFromTable(id)}>X</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )};
}

function App() {
  const [dataItems, setDataItems] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const data = await fetch(`/api`, {
      headers: {
        accepts: "application/json",
      },
    });
    const json = await data.json();

    if (json) {
      setDataItems(json);
    }
  };

  const deleteItem = async (id) => {

    const data =  id ? JSON.stringify({ id }) : undefined;
    await fetch(`/api`, 
      { 
        method: "DELETE", 
        body: data, 
        headers: { 'Content-Type': 'application/json' }

      });
    await getItems();
  };

  const insertItem = async (item) => {
    await fetch(`/api`, { 
      method: "POST", 
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json' } 
    });
  };
  return (
    <div className="App">
      <DataForm insertItem={insertItem} getItems={getItems}></DataForm>
      <hr/>
      <DataTable dataItems={dataItems} deleteItem={deleteItem} />
    </div>
  );
}

export default App;
