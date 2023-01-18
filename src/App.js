import logo from './logo.svg';
import React from 'react';
import { Route, BrowserRouter, Routes} from 'react-router-dom';
import HomePage from './Container/HomePage';
import Login from './Container/login';
import './App.css';

function App() {
  return (
      <div className='App'>
          {/* <Routes>
              <Route path='/' element={<HomePage />}>
                  <Route index element={<HomePage />} />
              </Route>
          </Routes> */}

            {/* <HomePage /> */}
            
              
            <Routes>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/homepage' element={<HomePage />}></Route>
            </Routes>
            
      </div>
  )
}

export default App;
