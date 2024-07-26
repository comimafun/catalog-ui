import ChevronUpIcon from '@/icons/ChevronUpIcon';
import { useViewport } from '../providers/ViewportProvider';
import { classNames } from '@/utils/classNames';

function CircleHomepageBackToTop({
  className,
  ...props
}: JSX.IntrinsicElements['button']) {
  const { viewportRef } = useViewport();
  return (
    <button
      onClick={() => {
        viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={classNames(
        'rounded-full border border-primary bg-white p-2 text-primary transition-all hover:scale-105 active:scale-90',
        className,
      )}
      type="button"
      {...props}
    >
      <ChevronUpIcon width={16} height={16} />
    </button>
  );
}

export default CircleHomepageBackToTop;
