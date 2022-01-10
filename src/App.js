import './App.css';
import React from 'react'; 
import earned from './datas/earned.json';
import Table from './components/Table';

function App() {
  const {postsConnection} = earned.data;
  const author = postsConnection.summary;
  const post = postsConnection.edges;

 return (
<Table post={post} author={author} />
  )
}

export default App;
