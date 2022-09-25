import { BaseModel } from 'esix'

export default class Podcast extends BaseModel {
  author = ''
  description = {
    long: '',
    short: ''
  }
  feedUrl = ''
  hasBeenScraped = false
  imageUrl = ''
  slug = ''
  tags: string[] = []
  title = ''

  gradientName?: string
}
