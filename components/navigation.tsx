'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Menu,
  X,
  Heart,
  Plus,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Home,
  Target,
  Users,
  DollarSign,
  MessageSquare,
  Star,
  AlertTriangle,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fetch notification count if user is logged in
    if (session?.user) {
      fetchNotificationCount()
    }
  }, [session])

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications/count')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching notification count:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const publicNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/campaigns', label: 'Campaigns', icon: Target },
    { href: '/about', label: 'About', icon: Users },
    { href: '/contact', label: 'Contact', icon: MessageSquare },
  ]

  const getDonorNavItems = () => [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/campaigns', label: 'Browse Campaigns', icon: Search },
    { href: '/donations', label: 'My Donations', icon: Heart },
    { href: '/favorites', label: 'Favorites', icon: Star },
  ]

  const getCreatorNavItems = () => [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/campaigns/create', label: 'Create Campaign', icon: Plus },
    { href: '/campaigns/my', label: 'My Campaigns', icon: Target },
    { href: '/donations/received', label: 'Donations Received', icon: DollarSign },
    { href: '/impact-stories', label: 'Impact Stories', icon: Star },
  ]

  const getAdminNavItems = () => [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/campaigns', label: 'Campaign Management', icon: Target },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/verification', label: 'Verification Queue', icon: Shield },
    { href: '/admin/reports', label: 'Fraud Reports', icon: AlertTriangle },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const getNavItems = () => {
    if (!session?.user) return publicNavItems

    const baseItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/campaigns', label: 'Campaigns', icon: Target },
    ]

    switch (session.user.role) {
      case 'admin':
        return [...baseItems, ...getAdminNavItems()]
      case 'creator':
        return [...baseItems, ...getCreatorNavItems()]
      case 'donor':
        return [...baseItems, ...getDonorNavItems()]
      default:
        return [...baseItems, ...getDonorNavItems()]
    }
  }

  const navItems = getNavItems()

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
            {session?.user?.role && (
              <Badge variant="secondary" className="w-fit mt-1">
                {session.user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {session?.user?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const ThemeToggle = () => {
    if (!mounted) return null

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="h-9 w-9"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const NotificationButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      asChild
    >
      <Link href="/notifications">
        <Bell className="h-4 w-4" />
        {notifications > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {notifications > 99 ? '99+' : notifications}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  )

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">UdDog</span>
            </Link>
          </SheetTitle>
          <SheetDescription>
            Navigate through the platform
          </SheetDescription>
        </SheetHeader>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center text-sm font-medium px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
          {!session?.user && (
            <div className="mt-6 space-y-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="outline" className="w-full justify-start">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <MobileNav />

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-xl">
              UdDog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {session?.user ? (
              <>
                <NotificationButton />
                <UserMenu />
              </>
            ) : status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
