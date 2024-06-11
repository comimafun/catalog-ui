import { useQuery } from '@tanstack/react-query';
import { client } from '@/utils/client';
import { useSession } from '@/components/general/providers/SessionProvider';

export default function Home() {
  const { data, error } = useQuery({
    queryKey: ['/api/v1/circle'],
    queryFn: async () => {
      const res = await client('/api/v1/circle', {
        params: {
          page: 1,
          limit: 10,
        },
      });
      return res;
    },
    retry: 0,
  });

  const { session } = useSession();

  console.log(session);

  return (
    <main>
      Yeeted
      <div className="h-[2000px] text-neutral-950">yeeted</div>
    </main>
  );
}
