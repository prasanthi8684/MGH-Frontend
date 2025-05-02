import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gift, Package, FileText, ClipboardList, User, Palette, Shield, Book, FileSpreadsheet } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

function NavItem({ icon, text, to }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center px-4 py-2 text-sm rounded-lg
          ${isActive
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: 'h-5 w-5 mr-3',
        })}
        {text}
      </NavLink>
    </li>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="h-full px-3 py-4">
      <NavSection title="SHOP">
        <NavItem icon={<Home />} text="Home" to="/" />
        
        
          <NavItem icon={<Gift />} text="Smart Gifting" to="/smart-gifting" />
          <NavItem icon={<Package />} text="Smart Catalog" to="/smart-catalog" />
          <NavItem icon={<FileText />} text="Digital Gifting" to="/digital-gifting" />
          <NavItem icon={<FileSpreadsheet />} text="Smart Proposal" to="/smart-proposal" />
        </NavSection>

        <NavSection title="MANAGE">
          <NavItem icon={<ClipboardList />} text="Quotations" to="/quotations" />
          {/* <NavItem icon={<FileText />} text="Orders" to="/orders" /> */}
        </NavSection>

        <NavSection title="ACCOUNT">
          <NavItem icon={<User />} text="Profile" to="/profile" />
          <NavItem icon={<Palette />} text="Branding" to="/branding" />
          <NavItem icon={<Shield />} text="Security" to="/security" />
          {/* <NavItem icon={<Book />} text="Address Book" to="/address-book" /> */}
        </NavSection>
      </div>
    </aside>
  );
}