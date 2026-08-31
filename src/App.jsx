import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../src/assets/utils/a-estilos.css';
import '../src/assets/utils/c-estilos.css';

import MainHeader from './components/main_header';
import MainFooter from '../src/components/main_footer';
import ScrollToTop from './components/scroll_top';
import MainCanvas from './components/main_canvas';

import UploadsModule from './components_upload/main-section';

function App() {
  return (
    <>
      <MainHeader/>
      <ScrollToTop/>

      <MainCanvas>
        <Routes>
            <Route path="/" element={<UploadsModule/>} />
        </Routes>
      </MainCanvas>
      <MainFooter/>
    </>
    
  )
}

export default App
