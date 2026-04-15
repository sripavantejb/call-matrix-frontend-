import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Home,
  Megaphone,
  MessageSquare,
  Phone,
  UserCog,
  Users,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/agents', label: 'Agents', icon: Users, end: false },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen, end: true },
  { to: '/conversations', label: 'Call matrix', icon: MessageSquare, end: true },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone, end: true },
  { to: '/phone-numbers', label: 'Phone Numbers', icon: Phone, end: true },
  {
    to: '/user-management',
    label: 'User Management',
    icon: UserCog,
    end: true,
  },
]
