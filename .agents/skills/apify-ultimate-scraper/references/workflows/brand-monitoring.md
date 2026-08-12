# Brand monitoring workflows

## Cross-platform brand mention tracking
Run in parallel: `apify/instagram-tagged-scraper`, `apify/instagram-hashtag-scraper`, `apidojo/tweet-scraper`, `trudax/reddit-scraper-lite`

## Twitter/X real-time mention routing
1. `apidojo/tweet-scraper`
2. `tri_angle/social-media-sentiment-analysis-tool`

## Multi-platform social listening with sentiment
Run in parallel across Instagram, Facebook, TikTok, Twitter then pipe to `tri_angle/social-media-sentiment-analysis-tool`
