
import { createRef } from 'react';
import Header from './components/Header';
import ViewGames from './components/ViewGames';
function App() {
  let scrollDiv = createRef();

  return (
    <>
      <Header scroll={scrollDiv}/> 
      <ViewGames scroll={scrollDiv}/>
    </>
  );
}

export default App;
