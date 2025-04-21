import { Canvas } from '@/components/canvas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Create and share AI workflows',
};

const Home = () => (
  <div className="h-screen w-screen">
    <Canvas />
  </div>
);

export default Home;
