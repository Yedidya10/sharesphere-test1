'use client'

import { ItemCoreWithLoanDetails } from '@/utils/types/Item'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import ItemEditButton from '../../buttons/itemEditButton/ItemEditButton'
import styles from './UserOwnedCardInfo.module.scss'

export interface IUserOwnedCardInfo {
  isAvailable: boolean
  isOwner: boolean
  card: ItemCoreWithLoanDetails
  activeButton: boolean
  deleteButton: boolean
  editButton: boolean
  restoreButton: boolean
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the UserOwnedCardInfo be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * UserOwnedCardInfo contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

function ControlledSwitches() {
  const [checked, setChecked] = React.useState(true)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return (
    <Tooltip title={checked ? 'Active' : 'Inactive'}>
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </Tooltip>
  )
}

const UserOwnedCardInfo: React.FC<IUserOwnedCardInfo> = ({
  primary = false,
  label,
  isAvailable,
  isOwner,
  activeButton,
  deleteButton,
  editButton,
  restoreButton,
  card,
  ...props
}) => {
  const { data: session, status } = useSession()
  const [itemMaxLoanPeriod, setItemMaxLoanPeriod] = useState<string>('')
  const [itemCondition, setItemCondition] = useState<string>('')

  const { cardIds, details, owner, condition, location, maxLoanPeriod } = card

  const { name, author, description } = details
  const { city, streetName, streetNumber, zipCode } = location
  const { isbn, danacode, barcode } = cardIds
  const {  imagesUrl } = card

  const handleDelete = async () => {
    try {
      // @ts-ignore
      const res = await fetch(`/api/cards/cardId/${card._id}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        console.log('success')
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Grid container columnSpacing={3} columns={100}>
        <Grid
          sx={{
            position: 'relative',
          }}
          xs={22}
        >
          <Image
            className={styles.image}
            fill={true}
            alt={`${name} by ${author}`}
            objectFit="contain"
            objectPosition="center"
            src={imagesUrl[0]}
          />
        </Grid>
        <Grid xs={58}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography className={styles.name}>{name}</Typography>
            <Typography className={styles.author}>מחבר: {author}</Typography>
            <Typography component={'p'} className={styles.description}>
              {description}
            </Typography>
            <Box className={styles.itemLender}></Box>
            <Box className={styles.itemLocation}>
              <Typography className={styles.optionText}>
                מיקום הפריט:
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '80px',
            gap: '10px',
          }}
          xs={20}
        >
          {status === 'authenticated' && isOwner && (
            <CardActions>
              {deleteButton && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              {editButton && <ItemEditButton label={''} formProps={card} />}
              {restoreButton && (
                <Tooltip title="Restore">
                  <IconButton>
                    <RestoreFromTrashIcon />
                  </IconButton>
                </Tooltip>
              )}
              {activeButton && <ControlledSwitches />}
            </CardActions>
          )}
        </Grid>
      </Grid>
    </Card>
  )
}

export default UserOwnedCardInfo
