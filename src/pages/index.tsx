import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { client, parseError } from '@/utils/client';

export default function Home() {
  const { data, error } = useQuery({
    queryKey: ['/api/v1/circle'],
    queryFn: async () => {
      const res = await client('/api/v1/circle');
      return res;
    },
    retry: 0,
  });

  console.log(data);
  console.log('error', parseError(error));
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      Hello world
    </main>
  );
}
