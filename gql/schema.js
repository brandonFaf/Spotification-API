module.exports = [
  { type: `type Track { id: String }` },

  { type: `type ExternalUrls { spotify: String }` },

  {
    type: `type AddedBy { href: String
  id: String
  type: String
  uri: String
  external_urls: ExternalUrls }`
  },

  {
    type: `type Items { added_at: String
  is_local: Boolean
  primary_color: String
  track: Track
  added_by: AddedBy }`
  },

  {
    type: `type Tracks { href: String
  limit: Int
  next: String
  offset: Int
  previous: String
  total: Int
  items: [Items ] }`
  },

  {
    type: `type Owner { display_name: String
  href: String
  id: String
  type: String
  uri: String
  external_urls: ExternalUrls }`
  },

  { type: `type Images { height: String url: String width: String }` },

  { type: `type Followers { href: String total: Int }` },

  {
    type: `type SpotifyPlaylist { collaborative: Boolean
  description: String
  href: String
  id: String
  name: String
  public: Boolean
  snapshot_id: String
  type: String
  uri: String
  tracks: Tracks
  owner: Owner
  images: [Images ]
  followers: Followers
  external_urls: ExternalUrls }`
  }
];
