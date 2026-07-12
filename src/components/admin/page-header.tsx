export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="adm-page-title">{title}</h2>
        {subtitle && <p className="adm-page-sub mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="adm-no-print flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
}) {
  return (
    <div className="adm-card card-hover-lift relative overflow-hidden p-5">
      <span
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-xl border-2 border-secondary bg-primary/25 text-lg"
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="adm-stat-label mb-2.5 pr-12">{label}</p>
      <p className="adm-stat-value">{value}</p>
      {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
