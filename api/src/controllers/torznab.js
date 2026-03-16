import Torrent from "../schema/torrent";
import { embellishTorrentsWithTrackerScrape } from "./torrent";
import User from "../schema/user";

const getCapsXml = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<caps>
  <server version="1.0" title="${process.env.SQ_SITE_NAME}" />
  <limits max="100" default="100" />
  <retention days="9999" />
  <registration available="no" open="no" />
  <searching>
    <search available="yes" supportedParams="q" />
    <tv-search available="yes" supportedParams="q,season,ep" />
    <movie-search available="yes" supportedParams="q,imdbid" />
  </searching>
  <categories>
    <category id="2000" name="Movies" />
    <category id="5000" name="TV" />
  </categories>
</caps>`;
};

const getTorrentXml = (torrent, userId) => {
  return `<item>
      <title>${torrent.name}</title>
      <description><![CDATA[${torrent.description || ''}]]></description>
      <pubDate>${new Date(torrent.created).toUTCString()}</pubDate>
      <guid isPermaLink="true">${process.env.SQ_BASE_URL}/torrent/download/${torrent.infoHash}/${userId}</guid>
      <link>${process.env.SQ_BASE_URL}/torrent/download/${torrent.infoHash}/${userId}</link>
      <enclosure url="${process.env.SQ_API_URL}/torrent/download/${torrent.infoHash}/${userId}" type="application/x-bittorrent" length="${torrent.size || 0}" />
      <torznab:attr name="seeders" value="${torrent.seeders || 0}" />
      <torznab:attr name="peers" value="${(torrent.seeders || 0) + (torrent.leechers || 0)}" />
      <torznab:attr name="infohash" value="${torrent.infoHash}" />
      <torznab:attr name="size" value="${torrent.size || 0}" />
      <torznab:attr name="downloadvolumefactor" value="${torrent.freeleech ? 0 : 1}" />
      <torznab:attr name="uploadvolumefactor" value="1" />
    </item>`;
};

export const handleTorznabRequest = (tracker) => async (req, res, next) => {
  try {
    const { t, q } = req.query;

    if (t === "caps") {
      res.setHeader("Content-Type", "text/xml");
      return res.status(200).send(getCapsXml());
    }

    if (t === "search" || t === "tvsearch" || t === "movie") {
      let queryObj = {};

      if (q) {
        queryObj = {
          $or: [
            { name: { $regex: decodeURIComponent(q), $options: "i" } },
            { description: { $regex: decodeURIComponent(q), $options: "i" } },
          ],
        };
      }

      const torrents = await Torrent.find(queryObj, null, {
        sort: { created: -1 },
        limit: 100,
      }).lean();

      let torrentsWithScrape = [];
      if (torrents.length > 0) {
          torrentsWithScrape = await embellishTorrentsWithTrackerScrape(
            tracker,
            torrents
          );
      }

      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return res.status(401).send("User not found mapping Torznab request");
      }

      const torrentsXml = torrentsWithScrape
        .map((to) => getTorrentXml(to, user.uid))
        .join("\n");

      res.setHeader("Content-Type", "text/xml");
      return res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:torznab="http://torznab.com/schemas/2015/feed">
  <channel>
    <title>${process.env.SQ_SITE_NAME} - Torznab</title>
    <link>${process.env.SQ_BASE_URL}</link>
    <description>Torznab API for ${process.env.SQ_SITE_NAME}</description>
    ${torrentsXml}
  </channel>
</rss>`);
    }

    res.setHeader("Content-Type", "text/xml");
    return res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
<error code="200" description="Unrecognized or unsupported t parameter" />`);
  } catch (e) {
    next(e);
  }
};
