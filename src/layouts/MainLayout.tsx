import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  return <><Header /><main className="container main"><Outlet /></main><footer className="container footer">ShopMini · Bài thực hành 03 <span>React + TypeScript · Context API · Redux Toolkit</span></footer></>;
}
