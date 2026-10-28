/** Small country flag for a phone number, from its country code. Only the countries we have offices in. */
export function Flag({ phone, className }: { phone: string; className?: string }) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+1")) return <UsFlag className={className} />;
  if (digits.startsWith("+254")) return <KenyaFlag className={className} />;
  return null;
}

function UsFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 19 10" width="21" height="11" aria-hidden="true">
      <rect width="19" height="10" fill="#b22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={(i * 10) / 13} width="19" height={10 / 13} fill="#fff" />
      ))}
      <rect width="7.6" height={(7 * 10) / 13} fill="#3c3b6e" />
    </svg>
  );
}

function KenyaFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" width="17" height="11" aria-hidden="true">
      <rect width="30" height="20" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#bb0000" />
      <rect y="13.33" width="30" height="6.67" fill="#006600" />
      <rect y="6" width="30" height="0.9" fill="#fff" />
      <rect y="13.1" width="30" height="0.9" fill="#fff" />
      <ellipse cx="15" cy="10" rx="3" ry="6" fill="#bb0000" stroke="#000" strokeWidth="0.6" />
    </svg>
  );
}
