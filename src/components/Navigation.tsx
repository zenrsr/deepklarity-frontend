import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusCircle, History, Trophy, BookOpen } from 'lucide-react';

export function Navigation() {
  const navItems = [
    {
      to: '/',
      icon: PlusCircle,
      label: 'Generate Quiz',
      end: true
    },
    {
      to: '/history',
      icon: History,
      label: 'Quiz History'
    },
    {
      to: '/leaderboard',
      icon: Trophy,
      label: 'Leaderboard'
    },
    {
      to: '/learn',
      icon: BookOpen,
      label: 'Learn More'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}