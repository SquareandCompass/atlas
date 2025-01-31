import { FC, useEffect } from 'react'

import { atlasConfig } from '@/config'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { fetchMore } = useNotifications()

  useEffect(() => {
    const id = setInterval(() => {
      fetchMore({
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            return fetchMoreResult
          }

          if (
            prev.notificationsConnection.edges[0]?.node.event.id !==
            fetchMoreResult.notificationsConnection.edges[0]?.node.event.id
          ) {
            const numberOfNewNotifications = fetchMoreResult.notificationsConnection.edges.findIndex(
              (node) => node.node.event.id === prev.notificationsConnection.edges[0]?.node.event.id
            )
            return {
              ...prev,
              notificationsConnection: {
                ...prev.notificationsConnection,
                edges: [
                  ...fetchMoreResult.notificationsConnection.edges.slice(0, numberOfNewNotifications),
                  ...prev.notificationsConnection.edges,
                ],
              },
            }
          }

          return prev
        },
      })
    }, atlasConfig.features.notifications.pollingInterval)

    return () => {
      clearInterval(id)
    }
  }, [fetchMore])

  return null
}
