import React, {
  useState,
} from 'react'
import {
  TagInput,
} from 'emblor'
import { Tag, } from '@prisma/client'
import { api, } from '~/trpc/react'

type UiTags = {
  id: string,
  text: string
}

interface TaggerProps {
  objectTags: Tag[],
  imageId: number,
}

const Tagger: React.FC<TaggerProps> = ({ objectTags, imageId, }) => {
  const initialUiTags: UiTags[] = objectTags.map((tag) => ({
    id: tag.id.toString(),
    text: tag.name,
  }))
  console.log('tags tags tags', initialUiTags)
  const [tags, setTags] = useState < UiTags[] > (initialUiTags)
  const [activeTagIndex, setActiveTagIndex] = useState < number | null > (null)

  const {data: allTags, isLoading: tagsLoading, } = api.tag.getAllTags.useQuery()
  const createNewTagWithImage = api.tag.addTagWithImage.useMutation()

  const addTag = (tagName: string) => {
    const newTag = createNewTagWithImage.mutate({imageId, tagName,})
    return newTag
  }

  const autocompleteOptions: UiTags[] = allTags?.map((tag) => ({
    id: tag.id.toString(),
    text: tag.name,
  })) || []

  return ( 
    <div className='flex'><
      TagInput tags = {
        tags
      }
      setTags = {
        (newTags) => {
          console.log('newTags', newTags)
          setTags(newTags)
        }
      }
      placeholder = 'Add a tag'
      styleClasses = {
        {input: 'w-full sm:max-w-[350px]',}
      }
      activeTagIndex = {
        activeTagIndex
      }
      setActiveTagIndex = {
        setActiveTagIndex
      }
      inputFieldPosition = {
        'bottom'
      }
      inlineTags = {
        false
      }
      enableAutocomplete = { 
        true
      }
      autocompleteOptions = {
        autocompleteOptions
      }
      onTagAdd = {
        (tag) => addTag(tag)
      }
    />
    </div>
  )
}

export default Tagger