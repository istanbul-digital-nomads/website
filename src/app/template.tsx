export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="route-shell">
      <div className="route-progress" aria-hidden="true" />
      <div className="route-enter">{children}</div>
    </div>
  );
}
