import { Box, Boxes, Images, Settings, Tag, } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const items = [
  {
    title: 'Images',
    url: '#',
    icon: Images,
  },
  {
    title: 'Models',
    url: '#',
    icon: Box,
  },
  {
    title: 'Loras',
    url: '#',
    icon: Boxes,
  },
  {
    title: 'Tags',
    url: '#',
    icon: Tag,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  }
]

interface AppSidebarProps {
  onSetDisplay: React.Dispatch<React.SetStateAction<string>>;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onSetDisplay, }) => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>GlassOcean</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={(e) => {
                      e.preventDefault()
                      onSetDisplay(item.title)
                    }}
                    asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar