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
  title = ''
}
