export class Playlist {
    header: PlaylistHeader;
    items: PlaylistItem[];
  }
  
  export class PlaylistHeader {
    attrs: {
      'x-tvg-url': string;
    };
    raw: string;
  }
  
  export class PlaylistItem {
    name: string;
    tvg: TvgInfo;
    group: {
      title: string;
    };
    http: HttpInfo;
    url: string;
    raw: string;
    line: number;
    timeshift: string;
    catchup: CatchupInfo;
  }
  
  export class TvgInfo {
    id: string;
    name: string;
    url: string;
    logo: string;
    rec: string;
    shift: string;
  }
  
  export class HttpInfo {
    referrer: string;
    'user-agent': string;
  }
  
  export class CatchupInfo {
    type: string;
    source: string;
    days: string;
  }