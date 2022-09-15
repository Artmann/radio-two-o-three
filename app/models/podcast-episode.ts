import { BaseModel } from 'esix'

export default class PodcastEpisode extends BaseModel {
  description = ''
  duration = 0
  imageUrl = ''
  podcastId = ''
  publishedAt = ''
  source = {
    length: 0,
    type: '',
    url: ''
  }
  slug = ''
  title = ''
}
