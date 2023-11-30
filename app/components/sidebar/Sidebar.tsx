import getCurrentUser from '@/app/actions/getCurrentUser';

import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import getAuthRoutes from '@/app/actions/getAuthRoutes';

async function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const currentUser = await getCurrentUser();
  const authChannels = await getAuthRoutes();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} authChannels={authChannels!}/>
      <MobileFooter authChannels={authChannels!}/>
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;