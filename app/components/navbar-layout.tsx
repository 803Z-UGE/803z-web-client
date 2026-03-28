import { Avatar } from '@/components/atoms/avatar';
import {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
} from '@/components/atoms/dropdown';
import {
    Navbar,
    NavbarDivider,
    NavbarItem,
    NavbarSection,
    NavbarSpacer,
} from '@/components/atoms/navbar';
import {
    Sidebar,
    SidebarBody,
    SidebarHeader,
    SidebarItem,
    SidebarSection,
} from '@/components/atoms/sidebar';
import { StackedLayout } from '@/components/atoms/stacked-layout';
import { useAuth } from '@/contexts/auth';
import {
    ArrowRightStartOnRectangleIcon,
    Cog8ToothIcon,
    LightBulbIcon,
    ShieldCheckIcon,
    RectangleStackIcon,
} from '@heroicons/react/16/solid';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/20/solid';
import { useLocation } from 'react-router';

const navItems = [
    { label: '803Z', url: '/' },
    { label: 'Événements', url: '/events' },
    { label: 'Matos', url: '/equipments' },
    { label: 'À propos', url: '/about' },
];

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const currentPath = location.pathname;

    return (
        <StackedLayout
            navbar={
                <Navbar>
                    <NavbarSection className="max-lg:hidden">
                        {navItems.map(({ label, url }) => (
                            <NavbarItem
                                key={label}
                                href={url}
                                current={
                                    url == '/' ? currentPath == '/' : currentPath.startsWith(url)
                                }
                            >
                                {label == '803Z' ? (
                                    <img src="/logo-small.svg" className="h-5 dark:invert-100" />
                                ) : (
                                    label
                                )}
                            </NavbarItem>
                        ))}
                    </NavbarSection>
                    <NavbarSpacer />
                    <NavbarSection>
                        <NavbarItem
                            href="/search"
                            aria-label="Search"
                            current={currentPath.startsWith('/search')}
                        >
                            <MagnifyingGlassIcon />
                        </NavbarItem>
                        {isAuthenticated && (
                            <NavbarItem
                                href="/order"
                                aria-label="Order"
                                current={currentPath.startsWith('/order')}
                            >
                                <ShoppingBagIcon />
                            </NavbarItem>
                        )}
                        <NavbarDivider />
                        {isAuthenticated ? (
                            <Dropdown>
                                <DropdownButton
                                    as={NavbarItem}
                                    current={currentPath.startsWith('/account')}
                                >
                                    <Avatar square initials="KG" />
                                </DropdownButton>
                                <DropdownMenu className="min-w-64" anchor="bottom end">
                                    <DropdownItem href="/account/settings">
                                        <Cog8ToothIcon />
                                        <DropdownLabel>Paramètres</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownItem href="/account/orders">
                                        <RectangleStackIcon />
                                        <DropdownLabel>Mes réservations</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownDivider />
                                    <DropdownItem href="/account/privacy-policy">
                                        <ShieldCheckIcon />
                                        <DropdownLabel>Mentions légales</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownItem href="mailto:guilland.killian@gmail.com">
                                        <LightBulbIcon />
                                        <DropdownLabel>Partager une idée</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownDivider />
                                    <DropdownItem onClick={logout}>
                                        <ArrowRightStartOnRectangleIcon />
                                        <DropdownLabel>Se déconnecter</DropdownLabel>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <NavbarItem
                                href="/auth/login"
                                aria-label="Login"
                                current={currentPath.startsWith('/auth')}
                            >
                                <UserIcon />
                            </NavbarItem>
                        )}
                    </NavbarSection>
                </Navbar>
            }
            sidebar={
                <Sidebar>
                    <SidebarHeader></SidebarHeader>
                    <SidebarBody>
                        <SidebarSection>
                            {navItems.map(({ label, url }) => (
                                <SidebarItem key={label} href={url}>
                                    {label}
                                </SidebarItem>
                            ))}
                        </SidebarSection>
                    </SidebarBody>
                </Sidebar>
            }
        >
            {children}
        </StackedLayout>
    );
}
