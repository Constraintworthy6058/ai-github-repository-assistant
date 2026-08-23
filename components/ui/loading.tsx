export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return <div className="loading-block" aria-label="Loading"><span className="skeleton wide" />{Array.from({ length: lines - 1 }, (_, index) => <span className="skeleton" key={index} />)}</div>;
}
