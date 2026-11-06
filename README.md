# GaraTV Launch Build

## What is included
- Responsive GaraTV public website using the established black/red/white brand.
- News categories for Kenya, Africa, World, Business, Sports and Culture.
- Search, category filters, mobile navigation and public article feed integration.
- Contributor application UI and Supabase Auth entry point.
- Weekly newsletter signup UI.
- BUSIAN partner promotion area.
- Supabase SQL migration for newsroom, contributor workflow, editorial reviews, assignments, articles, advertisements, newsletter, audit logs, RLS and private media storage.

## Upload from Android to GitHub
1. Download and extract `GaraTV_Launch_72hr_Build.zip`.
2. Open your GaraTV GitHub repository.
3. Upload the contents of this folder to the repository root (not the ZIP itself).
4. Commit changes.
5. Enable GitHub Pages from Settings → Pages → Deploy from branch → `main` → `/ (root)`.

## Supabase connection
1. Create a dedicated GaraTV Supabase project.
2. Review and run `supabase/migrations/001_garatv_launch.sql` in SQL Editor.
3. Create a test account in Supabase Auth.
4. Copy that user's UUID, then bootstrap the first administrator in SQL Editor:
   `update public.profiles set staff_role='administrator' where id='AUTH_USER_UUID';`
5. Edit `config.js`: add the project URL and public anon/publishable key. Never use a service-role key in browser code.
6. Set `YOUTUBE_URL` and `BUSIAN_URL` to the real official destinations.
7. Redeploy GitHub Pages and test on mobile.

## Important launch boundary
This is a high-quality website foundation and database starter, not a fully production-complete media CMS. The public article feed and newsletter pending-subscription insert are wired for Supabase. Contributor application requires an authenticated account. Full contributor sign-up/application approval screens, reporter upload workspace, editorial queue and publishing controls, ad campaign CRUD/serving/event validation, email confirmation and weekly newsletter delivery still need their secure UI and Edge Functions.

Do not advertise these workflows as live until implemented and tested. The SQL migration must be reviewed and tested in a staging project. In particular:
- Do not allow browser users to approve contributors or grant staff roles.
- Newsletter confirmation, unsubscribe and sending must use secure Edge Functions/provider webhooks.
- Ad event insertion needs server-side validation/rate limiting before production billing or advertiser reporting.
- Add article detail routing, public media storage policy, search indexing and metadata/SEO.
- Configure custom domain, privacy notice, terms, editorial standards, corrections policy and backups.
- Confirm applicable Kenyan media, data protection, advertising and child-safeguarding requirements.

## Suggested 72-hour sequence
Day 1: Upload files, create Supabase project, apply migration in staging, configure Auth and public site.
Day 2: Finish reporter application/review and newsroom editorial controls; test role permissions.
Day 3: Connect newsletter provider and ad campaign workflow; mobile QA, SEO, privacy/legal pages and launch decision.

## Test checklist
- Homepage loads on mobile and desktop.
- Navigation and category filters work.
- Search filters visible stories.
- Supabase connection loads only published articles.
- Unauthenticated contributor application is blocked.
- Authenticated user can submit an application.
- Unapproved users cannot submit news.
- Only approved contributors can submit.
- Only authorized editors can manage/publish articles.
- Only active, date-valid campaigns are publicly visible.
- Newsletter signup records pending consent; no email is sent until confirmation flow is connected.
