'use client'

import { useCallback, useEffect, useMemo, useState, } from 'react'
import GridGallery from './gridGallery'
import { Model, } from '@prisma/client'
import { SidebarProvider, SidebarTrigger, } from '~/components/ui/sidebar'
import { api, } from '~/trpc/react'
import AppSidebar from './appSideBar'
import ModelCard from './modelCard'
import ImageGallery from './imagesGallery'
import Paginator from './paginator'
import FolderAdder from './folder'
import ControlBar from './controlBar'
import Gallery from './home'

interface HomePageProps {
  models: Model[]
  loras: Model[]
}

const TOTAL_ITEMS = 24

const HomePage: React.FC<HomePageProps> = ({ models, loras, }) => {
  return (
    <Gallery />
  )
}

export default HomePage