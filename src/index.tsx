import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Example from './Example';
import UploadPage from './Upload';
import 'antd/dist/antd.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ParentSize>{({ width, height }) => <UploadPage />}</ParentSize>
    {/* <ParentSize>{({ width, height }) => <Example width={width} height={height} />}</ParentSize> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
