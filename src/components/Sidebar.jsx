import React from 'react'
import useAuthStore from '../store/auth';
import {
  LayoutDashboard, ShoppingCart, Package, Users2, LineChart, Settings, ChevronLeft, ChevronRight, Sun, Moon, Search, Bell, User, MoreVertical, PlusCircle, Filter, FileDown
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

    const shopAdminMenu = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', page: 'Dashboard' },
    { icon: <ShoppingCart size={20} />, text: 'Shops', page: 'Shops' },
    { icon: <Package size={20} />, text: 'Products', page: 'Products' },
    { icon: <Users2 size={20} />, text: 'Orders', page: 'Orders' },
    { icon: <Users2 size={20} />, text: 'Users', page: 'Users' },
    { icon: <LineChart size={20} />, text: 'Analytics', page: 'Analytics' },
    { icon: <Settings size={20} />, text: 'Settings', page: 'Settings' },
  ];
  const superadminMenu = [

    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <ShoppingCart size={20} />, path: '/shops', label: 'Shops' },
    { icon: <Package size={20} />, path: '/products', label: 'Products' },    
    { icon: <Users2 size={20} />, path: '/orders', label: 'Orders' },
    { icon: <Users2 size={20} />, path: '/users', label: 'Users' },
    { icon: <LineChart size={20} />, path: '/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/settings', label: 'Settings' },
  ]

  if (!user) return null;

  const menu = user.role === "superadmin" ? superadminMenu : shopAdminMenu;








  return (
    <aside className={`h-screen transition-all duration-300 ease-in-out ${expanded ? "w-64" : "w-20"}`}>
      <nav className="h-full flex flex-col bg-card/60 backdrop-blur-xl border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src={`https://placehold.co/100x40/000000/FFFFFF?text=LOGO`} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="" />
          <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center p-3 hover:bg-gray-100 ${location.pathname === item.path ? "bg-gray-200 font-semibold" : ""
                }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}


        <div className="border-t flex p-3">
          <img src="https://i.pravatar.cc/40?u=admin" alt="" className="w-10 h-10 rounded-md" />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">Superadmin</h4>
              <span className="text-xs text-gray-600 dark:text-gray-400">admin@email.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar