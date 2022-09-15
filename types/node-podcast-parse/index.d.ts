declare module 'node-podcast-parser' {
  export type Episode = {
    guid: string;
    title: string;
    description: string;
    explicit: boolean;
    image: string;
    published: string;
    duration: number;
    categories: string[];
    enclosure: {
      filesize: number;
      type: string;
      url: string;
    }
  };
  export type Podcast = {
    title: string;
    description: {
      short: string;
      long: string;
    },
    link: string;
    image: string;
    language: string;
    copyright: string;
    updated: string;
    explicit: boolean,
    categories: string[];
    author: string;
    owner: {
      name:  string;
      email: string;
    },
    episodes: Episode[];
  };
  type Callback = (err: Error, data: Podcast) => void;
  function parsePodcast(xml: string, callback: Callback): void;

  export default parsePodcast;
}
