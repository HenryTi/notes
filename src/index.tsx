import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { NavView, start, nav } from './tonva';
import { CApp, appConfig } from './UqApp';

nav.setSettings(appConfig);

//如果要支持route，必须调用下面这一句
//await startRoute(appConfig);
const App: React.FC = () => {
	const onLogined = async (isUserLogin?: boolean) => {
		await start(CApp, appConfig, isUserLogin);
	}
	return <NavView onLogined={onLogined} />;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
