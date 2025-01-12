import { Icon } from '@chakra-ui/react';
import { MdPerson, MdHome, MdBusiness, Md1kPlus } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';

import Clients from 'views/paktyping/Clients';
import Users from 'views/paktyping/Users';
import Tasks from 'views/paktyping/Tasks';
import Services from 'views/paktyping/Services';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: '/nft-marketplace',
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width="20px"
  //       height="20px"
  //       color="inherit"
  //     />
  //   ),
  //   component: <NFTMarketplace />,
  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  //   path: '/data-tables',
  //   component: <DataTables />,
  // },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: '/profile',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: <Profile />,
  // },
  // {
  //   name: 'Sign In',
  //   layout: '/auth',
  //   path: '/sign-in',
  //   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  //   component: <SignInCentered />,
  // },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: '/rtl-default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <RTL />,
  // },
  {
    name: 'Services',
    layout: '/admin',
    path: '/services',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Services />,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Users />,
  },
  {
    name: 'Tasks',
    layout: '/admin',
    path: '/tasks',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <Tasks />,
  },
  {
    name: 'Clients',
    layout: '/admin',
    path: '/clients',
    icon: <Icon as={Md1kPlus} width="20px" height="20px" color="inherit" />,
    component: <Clients />,
  },
  // {
  //   name: 'TaskDetail',
  //   layout: '/admin',
  //   path: '/task-detail/:id',
  //   icon: <Icon as={Md1kPlus} width="20px" height="20px" color="inherit" />,
  //   component: <TaskDetail />,
  // },
];

export default routes;
