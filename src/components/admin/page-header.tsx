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
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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
    <div className="adm-card relative overflow-hidden p-5">
      <span className="absolute top-4 right-4 text-[28px] opacity-15" aria-hidden="true">
        {icon}
      </span>
      <p className="adm-stat-label mb-2.5">{label}</p>
      <p className="adm-stat-value">{value}</p>
      {sub && <p className="mt-2 text-xs text-[#5a6a7e]">{sub}</p>}
    </div>
  );
}
