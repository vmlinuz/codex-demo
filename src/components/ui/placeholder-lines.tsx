type PlaceholderLinesProps = {
  lines?: number;
};

export function PlaceholderLines({ lines = 3 }: Readonly<PlaceholderLinesProps>) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3 rounded-full bg-accent/10"
          style={{
            width: `${100 - Math.min(index * 11, 34)}%`,
          }}
        />
      ))}
    </div>
  );
}
