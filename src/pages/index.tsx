import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { client, parseError } from '@/utils/client';

export default function Home() {
  const { data, error } = useQuery({
    queryKey: ['/api/v1/circle'],
    queryFn: async () => {
      const res = await client('/api/v1/circle', {
        params: { limit: 10, page: 1 },
      });
      return res;
    },
    retry: 0,
  });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      Hello world
    </main>
  );
}
