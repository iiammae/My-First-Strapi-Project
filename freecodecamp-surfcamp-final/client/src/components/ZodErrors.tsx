export function ZodErrors({ error, className }: { error: string[]; className?: string }) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div key={index} className={className ?? ""}>
      {err}
    </div>
  )); 
}