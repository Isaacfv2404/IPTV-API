export interface Playlist {
    header: PlaylistHeader;
    items: PlaylistItem[];
  }
  
  export interface PlaylistHeader {
    attrs: {
      'x-tvg-url': string;
    };
    raw: string;
  }
  
  export interface PlaylistItem {
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
  
  export interface TvgInfo {
    id: string;
    name: string;
    url: string;
    logo: string;
    rec: string;
    shift: string;
  }
  
  export interface HttpInfo {
    referrer: string;
    'user-agent': string;
  }
  
  export interface CatchupInfo {
    type: string;
    source: string;
    days: string;
  }