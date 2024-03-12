import Sidebar from "../components/sidebar/Sidebar";

export default async function MasksLayout({
  children
}: {
  children: React.ReactNode,
}) {

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  );
}