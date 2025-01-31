import { QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import { useNftsConnection } from '@/api/hooks/nfts'
import { GetNftsConnectionQuery, GetNftsConnectionQueryVariables } from '@/api/queries/__generated__/nfts.generated'
import { DEFAULT_NFTS_GRID } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { useBreakpointKey } from './useBreakpointKey'
import { useVideoGridRows } from './useVideoGridRows'

export const useInfiniteNftsGrid = (
  variables: GetNftsConnectionQueryVariables,
  opts?: QueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) => {
  const initialRowsToLoad = useVideoGridRows('main')

  const breakPointKey = useBreakpointKey()
  const columns = (breakPointKey && DEFAULT_NFTS_GRID[breakPointKey]?.columns) ?? 0

  const { nfts, loading, fetchMore, totalCount, pageInfo } = useNftsConnection(
    {
      ...variables,
      first: columns * initialRowsToLoad,
    },
    {
      skip: !columns,
      notifyOnNetworkStatusChange: true,
      ...opts,
    }
  )

  const firstLoad = !nfts && loading

  const itemsLeft = (totalCount || 0) - (nfts?.length || 0)
  const itemsToLoad = Math.min(itemsLeft, columns * 4)

  const tiles = useMemo(() => {
    const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []
    const nextLoadPlaceholders = !pageInfo?.hasNextPage ? [] : createPlaceholderData(itemsToLoad)
    return [...firstLoadPlaceholders, ...(nfts || []), ...(loading ? nextLoadPlaceholders : [])]
  }, [columns, firstLoad, initialRowsToLoad, itemsToLoad, loading, nfts, pageInfo?.hasNextPage])

  return {
    tiles,
    fetchMore,
    pageInfo,
    totalCount,
    columns,
  }
}
