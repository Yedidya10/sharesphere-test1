'use client'

import { ItemCoreWithLoanDetails } from '@/utils/types/Item'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Unstable_Grid2'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import PublishedItemsLabTabs from '../../publishedItemsLabTabs/PublishedItemsLabTabs'
import ProfileCardInfo from '../profileCardInfo/ProfileCardInfo'

export interface ICurrentUserCards {
  sampleTextProp: string
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the CurrentUserCards be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * CurrentUserCards contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

const CurrentUserCards: React.FC<ICurrentUserCards> = ({
  primary = false,
  label,
  sampleTextProp,
  ...props
}) => {
  const [value, setValue] = React.useState('1')
  const { data: session, status } = useSession()

  const [isOwner, setIsOwner] = React.useState<boolean | null>(null)
  const [currentUserCards, setCurrentUserCards] = React.useState<
    ItemCoreWithLoanDetails[] | null
  >(null)

  async function getCurrentUserCards() {
    try {
      const response = await fetch(`/api/cards/userId/${session?.user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      const cards = data.cards

      if (response.ok) {
        return setCurrentUserCards(cards)
      } else {
        throw new Error(cards.error || 'Failed to fetch cards')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  React.useEffect(() => {
    if (session?.user?.id !== undefined && session?.user?.id !== null) {
      getCurrentUserCards()
    }
  }, [session?.user?.id])

  React.useEffect(() => {
    if (session?.user?.id) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }, [session?.user?.id])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Pending publication" value="1" />
            <Tab label="Published" value="2" />
            <Tab label="On hold" value="3" />
            <Tab label="Deleted" value="4" />
          </TabList>
        </Box>
        <TabPanel
          value="1"
          sx={{
            paddingInline: 0,
          }}
        >
          <Grid container spacing={2}>
            {currentUserCards?.map(
              (card) =>
                card.status === 'pendingPublication' && (
                  <Grid
                    // @ts-ignore
                    key={card._id}
                    xs={12}
                    sx={{
                      height: 'max-content',
                    }}
                  >
                    <ProfileCardInfo
                      card={card}
                      isOwner={isOwner!}
                      isAvailable={true}
                      label={''}
                      activeButton={false}
                      deleteButton={true}
                      editButton={true}
                      restoreButton={false}
                    />
                  </Grid>
                )
            )}
          </Grid>
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            paddingInline: 0,
          }}
        >
          <Grid container spacing={2}>
            <PublishedItemsLabTabs
              currentUserCards={currentUserCards}
              label=""
              isOwner={isOwner!}
            />
          </Grid>
        </TabPanel>
        <TabPanel
          value="3"
          sx={{
            paddingInline: 0,
          }}
        >
          <Grid container spacing={2}>
            {currentUserCards?.map(
              (card) =>
                card.status === 'onHold' && (
                  <Grid
                    // @ts-ignore
                    key={card._id}
                    xs={12}
                    sx={{
                      height: 'max-content',
                    }}
                  >
                    <ProfileCardInfo
                      card={card}
                      isOwner={isOwner!}
                      isAvailable={true}
                      label={''}
                      activeButton={true}
                      deleteButton={true}
                      editButton={true}
                      restoreButton={false}
                    />
                  </Grid>
                )
            )}
          </Grid>
        </TabPanel>
        <TabPanel
          value="4"
          sx={{
            paddingInline: 0,
          }}
        >
          <Grid container spacing={2}>
            {currentUserCards?.map(
              (card) =>
                card.status === 'deleted' && (
                  <Grid
                    // @ts-ignore
                    key={card._id}
                    xs={12}
                    sx={{
                      height: 'max-content',
                    }}
                  >
                    <Box>
                      <ProfileCardInfo
                        card={card}
                        isOwner={isOwner!}
                        isAvailable={true}
                        label={''}
                        activeButton={false}
                        deleteButton={false}
                        editButton={false}
                        restoreButton={true}
                      />
                    </Box>
                  </Grid>
                )
            )}
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default CurrentUserCards
