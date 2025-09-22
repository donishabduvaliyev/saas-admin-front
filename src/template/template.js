import React, { useState, useEffect, createContext, useContext, forwardRef } from 'react';
import { create } from 'zustand';
import {
  LayoutDashboard, ShoppingCart, Package, Users2, LineChart, Settings, ChevronLeft, ChevronRight, Sun, Moon, Search, Bell, User, MoreVertical, PlusCircle, Filter, FileDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
// Utility for combining Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 }, { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

const analyticsData = {
  sales: [
    { month: 'Jan', sales: 12000 }, { month: 'Feb', sales: 15000 }, { month: 'Mar', sales: 22000 }, 
    { month: 'Apr', sales: 18000 }, { month: 'May', sales: 25000 }, { month: 'Jun', sales: 30000 }
  ],
  orders: [
    { month: 'Jan', orders: 450 }, { month: 'Feb', orders: 500 }, { month: 'Mar', orders: 620 },
    { month: 'Apr', orders: 580 }, { month: 'May', orders: 700 }, { month: 'Jun', orders: 810 }
  ],
  topProducts: [
    { name: 'Futuristic Gadget', sales: 150 },
    { name: 'Cybernetic Implant', sales: 120 },
    { name: 'Holographic Projector', sales: 90 },
    { name: 'Anti-Gravity Boots', sales: 75 },
    { name: 'Stealth Cloak', sales: 60 },
  ],
  shopPerformance: [
    { name: 'CyberDyne Systems', revenue: 55000 },
    { name: 'OmniCorp', revenue: 48000 },
    { name: 'Tyrell Corporation', revenue: 42000 },
    { name: 'Stark Industries', revenue: 35000 },
  ],
};

const shopsData = [
    { id: 1, name: 'CyberDyne Systems', owner: 'Miles Dyson', products: 120, revenue: '1.2M', status: 'Active' },
    { id: 2, name: 'OmniCorp', owner: 'Dick Jones', products: 85, revenue: '950K', status: 'Active' },
    { id: 3, name: 'Tyrell Corporation', owner: 'Eldon Tyrell', products: 250, revenue: '3.5M', status: 'Inactive' },
    { id: 4, name: 'Stark Industries', owner: 'Tony Stark', products: 500, revenue: '10.2M', status: 'Active' },
];

const productsData = [
    { id: 1, name: 'Futuristic Gadget', price: 299.99, stock: 150, image: 'https://placehold.co/400x400/94a3b8/ffffff?text=Product+A' },
    { id: 2, name: 'Cybernetic Implant', price: 1299.99, stock: 50, image: 'https://placehold.co/400x400/94a3b8/ffffff?text=Product+B' },
    { id: 3, name: 'Holographic Projector', price: 799.00, stock: 75, image: 'https://placehold.co/400x400/94a3b8/ffffff?text=Product+C' },
    { id: 4, name: 'Anti-Gravity Boots', price: 499.50, stock: 100, image: 'https://placehold.co/400x400/94a3b8/ffffff?text=Product+D' },
];

const ordersData = [
    { id: 'ORD001', customer: 'John Doe', date: '2025-09-18', total: 299.99, status: 'Completed' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2025-09-17', total: 1299.99, status: 'Pending' },
    { id: 'ORD003', customer: 'Deckard', date: '2025-09-16', total: 799.00, status: 'Completed' },
    { id: 'ORD004', customer: 'Sarah Connor', date: '2025-09-15', total: 499.50, status: 'Canceled' },
];

const usersData = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', role: 'Customer', joined: '2025-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', role: 'Admin', joined: '2025-02-20' },
    { id: 3, name: 'Deckard', email: 'deckard@tyrell.com', role: 'Superadmin', joined: '2024-11-10' },
    { id: 4, name: 'Sarah Connor', email: 'sarah.c@resistance.net', role: 'Customer', joined: '2025-05-01' },
];


// --- STATE MANAGEMENT (ZUSTAND) ---
// Simulates a store for theme and layout state
const useStore = create((set) => ({
  theme: 'light',
  isSidebarExpanded: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));

// --- THEME PROVIDER (CONTEXT API) ---
const ThemeProviderContext = createContext({
  theme: 'system',
  setTheme: () => null,
});

function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// --- REUSABLE UI COMPONENTS ---

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const Card = ({ className, children }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);
const CardHeader = ({ className, children }) => <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
const CardTitle = ({ className, children }) => <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>;
const CardDescription = ({ className, children }) => <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
const CardContent = ({ className, children }) => <div className={cn("p-6 pt-0", className)}>{children}</div>;
const CardFooter = ({ className, children }) => <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>;


const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});


const Table = ({ className, children }) => <div className="relative w-full overflow-auto"><table className={cn("w-full caption-bottom text-sm", className)}>{children}</table></div>
const TableHeader = ({ className, children }) => <thead className={cn("[&_tr]:border-b", className)}>{children}</thead>
const TableBody = ({ className, children }) => <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>
const TableRow = ({ className, children }) => <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}>{children}</tr>
const TableHead = ({ className, children }) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)}>{children}</th>
const TableCell = ({ className, children }) => <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>{children}</td>

const StatusBadge = ({ status }) => {
    const statusClasses = {
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Canceled': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
    };
    return (
        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', statusClasses[status])}>
            {status}
        </span>
    );
};


// --- LAYOUT COMPONENTS ---

const SidebarContext = createContext();

function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={`h-screen transition-all duration-300 ease-in-out ${expanded ? "w-64" : "w-20"}`}>
      <nav className="h-full flex flex-col bg-card/60 backdrop-blur-xl border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src={`https://placehold.co/100x40/000000/FFFFFF?text=LOGO`} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="" />
          <button onClick={() => setExpanded(curr => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
            {expanded ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

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

function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li
            onClick={onClick}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-900 dark:to-indigo-800 dark:text-white"
                    : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300"
            }`}
        >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    );
}

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/60 backdrop-blur-xl px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
      </Button>
    </header>
  );
};


function DashboardLayout({ activePage, setActivePage }) {
    const navItems = [
        { icon: <LayoutDashboard size={20} />, text: 'Dashboard', page: 'Dashboard' },
        { icon: <ShoppingCart size={20} />, text: 'Shops', page: 'Shops' },
        { icon: <Package size={20} />, text: 'Products', page: 'Products' },
        { icon: <Users2 size={20} />, text: 'Orders', page: 'Orders' },
        { icon: <Users2 size={20} />, text: 'Users', page: 'Users' },
        { icon: <LineChart size={20} />, text: 'Analytics', page: 'Analytics' },
        { icon: <Settings size={20} />, text: 'Settings', page: 'Settings' },
    ];
    
    const PageComponent = {
        Dashboard: DashboardPage,
        Shops: ShopsPage,
        Products: ProductsPage,
        Orders: OrdersPage,
        Users: UsersPage,
        Analytics: AnalyticsPage,
        Settings: SettingsPage,
    }[activePage];

    return (
        <div className="flex">
            <Sidebar>
                {navItems.map(item => (
                    <SidebarItem 
                        key={item.page}
                        icon={item.icon}
                        text={item.text}
                        active={activePage === item.page}
                        onClick={() => setActivePage(item.page)}
                    />
                ))}
            </Sidebar>
            <main className="flex-1">
              <div className="flex flex-col h-screen overflow-y-auto">
                <Header />
                <div className="p-6">
                    {PageComponent ? <PageComponent /> : <DashboardPage />}
                </div>
              </div>
            </main>
        </div>
    );
}

// --- PAGE COMPONENTS ---

const DashboardPage = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <span className="text-muted-foreground">$</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        <ShoppingCart className="text-muted-foreground h-4 w-4"/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+2350</div>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
        <Users2 className="text-muted-foreground h-4 w-4"/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+573</div>
        <p className="text-xs text-muted-foreground">+21 since last hour</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <LineChart className="text-muted-foreground h-4 w-4"/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12,234</div>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
      </CardContent>
    </Card>
    <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>A chart showing sales over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Legend iconSize={10}/>
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  </div>
);

const ShopsPage = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Shops</CardTitle>
                    <CardDescription>Manage all the shops in the system.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline"><FileDown className="h-4 w-4 mr-2" /> Export</Button>
                    <Button><PlusCircle className="h-4 w-4 mr-2" /> Add Shop</Button>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Input placeholder="Search shops..." className="max-w-sm" />
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Shop Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shopsData.map((shop) => (
                        <TableRow key={shop.id}>
                            <TableCell className="font-medium">{shop.name}</TableCell>
                            <TableCell>{shop.owner}</TableCell>
                            <TableCell>{shop.products}</TableCell>
                            <TableCell>${shop.revenue}</TableCell>
                            <TableCell><StatusBadge status={shop.status} /></TableCell>
                            <TableCell><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const ProductsPage = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage all products.</CardDescription>
                </div>
                <Button><PlusCircle className="h-4 w-4 mr-2" /> Add Product</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsData.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-lg">{product.name}</h4>
                            <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground mt-1">Stock: {product.stock}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full">Edit</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </CardContent>
    </Card>
);

const OrdersPage = () => (
     <Card>
        <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordersData.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell><StatusBadge status={order.status} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const UsersPage = () => (
     <Card>
        <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and roles.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined On</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usersData.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.joined}</TableCell>
                            <TableCell><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const AnalyticsPage = () => (
    <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={analyticsData.sales}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))' }}/>
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Orders Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.orders}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))' }} />
                            <Bar dataKey="orders" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Units Sold</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analyticsData.topProducts.map((p) => (
                                <TableRow key={p.name}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.sales}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Shop Performance (Revenue)</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shop</TableHead>
                                <TableHead>Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analyticsData.shopPerformance.map((s) => (
                                <TableRow key={s.name}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>${s.revenue.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
);

const SettingsPage = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-muted-foreground">Manage your account and website settings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <Input {...register("fullName")} defaultValue="Superadmin" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email Address</label>
                            <Input {...register("email")} type="email" defaultValue="admin@email.com" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Password</label>
                        <Input {...register("password")} type="password" placeholder="Enter new password" />
                    </div>
                     <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

function App() {
    const [activePage, setActivePage] = useState('Dashboard');

    return (
        <ThemeProvider defaultTheme="dark" storageKey="admin-dashboard-theme">
            <div className="bg-background text-foreground">
                <DashboardLayout activePage={activePage} setActivePage={setActivePage} />
            </div>
        </ThemeProvider>
    )
}

export default App;
