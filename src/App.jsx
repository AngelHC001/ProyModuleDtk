import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ViewContext } from './components/viewContext';
import '../src/assets/utils/a-estilos.css';
import '../src/assets/utils/c-estilos.css';


import MainHeader from './components/main_header';
import MainFooter from './components/main_footer';
import ScrollToTop from './components/scroll_top';
import MainCanvas from './components/main_canvas';

import UploadsModule from './sections-frontend/main-section';

function MainComponent(){
  const [activeView, setActiveView] = useState({type:'folders'});
  return(
    <ViewContext.Provider value={{activeView, setActiveView}}>
      <UploadsModule/>
    </ViewContext.Provider>
  )
}

function App() {
  return (
    <>
      <MainHeader/>
      <ScrollToTop/>

      <MainCanvas>
        <Routes>
            <Route path="/" element={<MainComponent/>} />            
        </Routes>
      </MainCanvas>
      <MainFooter/>
    </>
    
  )
}

export default App
