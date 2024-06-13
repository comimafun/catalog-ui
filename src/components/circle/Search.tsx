import { useParseCircleQueryToParams } from '@/hooks/circle/useParseClientQueryToParams';
import SearchIcon from '@/icons/SearchIcon';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

function SearchInput() {
  const params = useParseCircleQueryToParams();

  const searchForm = useForm<{ search: string }>({
    mode: 'onSubmit',
  });
  const router = useRouter();

  useEffect(() => {
    if (params.search) {
      searchForm.setValue('search', params.search);
    }
  }, [params.search, searchForm.setValue]);

  return (
    <form
      className="w-full"
      onSubmit={searchForm.handleSubmit((val) => {
        router.query.search = val.search;
        if (!val.search) {
          delete router.query.search;
        }
        router.replace({ query: router.query }, undefined, {
          scroll: false,
          shallow: true,
        });
      })}
    >
      <Controller
        control={searchForm.control}
        name="search"
        render={({ field }) => {
          return (
            <Input
              startContent={<SearchIcon width={16} height={16} />}
              placeholder="Search by circle name, fandom, or block"
              color="primary"
              variant="bordered"
              isClearable
              onClear={() => {
                searchForm.setValue('search', '');
                delete router.query.search;
                router.replace({ query: router.query }, undefined, {
                  scroll: false,
                  shallow: true,
                });
              }}
              {...field}
            />
          );
        }}
      />
    </form>
  );
}

export default SearchInput;
