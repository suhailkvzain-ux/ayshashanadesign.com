import Link from 'next/link';
import {Nav,Footer} from './components';
export default function NotFound(){return <><Nav/><main className="page notFound"><div className="eyebrow">404</div><h1>PAGE NOT FOUND</h1><p>The page you’re looking for doesn’t exist.</p><Link className="btn dark" href="/">BACK TO HOME</Link></main><Footer/></>;}
