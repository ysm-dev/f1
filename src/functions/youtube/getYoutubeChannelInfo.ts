import { memoize } from "@fxts/core"
import { z } from "zod"

export const getYoutubeChannelInfo = memoize(async (channelId: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${new URLSearchParams({
      part: "statistics",
      id: channelId,
      key: process.env.YOUTUBE_DATA_API_KEY!,
    })}`,
  ).then((res) => res.json())

  const data = getYoutubeChannelInfoSchema.parse(response)

  return data.items.find((v) => v.id === channelId) ?? null
})

export const getYoutubeChannelInfoSchema = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.string(),
      statistics: z.object({
        viewCount: z.string(),
        subscriberCount: z.string(),
        hiddenSubscriberCount: z.boolean(),
        videoCount: z.string(),
      }),
    }),
  ),
})

export type getYoutubeChannelInfoResponse = z.infer<
  typeof getYoutubeChannelInfoSchema
>
