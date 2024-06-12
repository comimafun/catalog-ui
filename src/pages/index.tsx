import { useQuery } from '@tanstack/react-query';
import { circleService } from '@/services/circle';
import CircleCard from '@/components/circle/Card';

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/v1/circle'],
    queryFn: async () => {
      const res = await circleService.getCircles({ limit: 20, page: 1 });
      return res;
    },
    retry: 0,
  });

  return (
    <main className="min-h-[calc(100vh-63px)] w-full bg-white px-4 pt-4">
      <div className="h-48 w-full rounded-lg bg-slate-400"></div>
      <div className="my-6 w-full">search bar</div>
      <ul className="xs:grid-cols-2 grid gap-3 sm:grid-cols-3">
        {data?.data.map((circle) => {
          return <CircleCard {...circle} key={circle.id} />;
        })}

        {isLoading &&
          new Array(12).fill(0).map((_, index) => {
            return (
              <li
                className="animate-pulse-faster h-[380px] w-full rounded-lg bg-slate-400"
                key={index}
              ></li>
            );
          })}
      </ul>
    </main>
  );
}
