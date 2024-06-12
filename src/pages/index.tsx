import { useQuery } from '@tanstack/react-query';
import { circleService } from '@/services/circle';

export default function Home() {
  const { data } = useQuery({
    queryKey: ['/api/v1/circle'],
    queryFn: async () => {
      const res = await circleService.getCircles({ limit: 20, page: 1 });
      return res;
    },
    retry: 0,
  });

  return (
    <main>
      {data?.data.map((circle) => {
        return <div key={circle.id}>{circle.name}</div>;
      })}
    </main>
  );
}
