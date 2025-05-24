export type Series = {
  id: string;
  title: string;
  episodes: Episode[];
};

export type Episode = {
  id: string;
  title: string;
  url: string;
  premium: boolean;
};
