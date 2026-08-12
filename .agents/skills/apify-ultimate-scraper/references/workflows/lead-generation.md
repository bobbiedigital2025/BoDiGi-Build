# Lead generation workflows

## Local business leads with email enrichment
**When:** User wants business contacts, emails, or phone numbers for businesses in a specific location.

### Pipeline
1. **Find businesses** -> `compass/crawler-google-places`
2. **Enrich with contacts** -> `compass/enrich-google-maps-dataset-with-contacts`

### Output fields
Step 1: `title`, `address`, `phone`, `website`, `categoryName`, `totalScore`, `reviewsCount`, `url`
Step 2: `emails[]`, `phones[]`, `socialLinks`, `linkedInUrl`, `twitterUrl`

## B2B prospect discovery via LinkedIn
**When:** User wants to find professionals by role, company, or industry.

### Pipeline
1. `harvestapi/linkedin-profile-search`
2. `harvestapi/linkedin-profile-scraper`

## SERP-based B2B prospect discovery
1. `apify/google-search-scraper`
2. `apify/website-content-crawler`

## Reddit community lead mining
1. `trudax/reddit-scraper-lite`
2. AI qualification node
