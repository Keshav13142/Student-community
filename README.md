# Student Community Platform

## Tech stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [PlanetScale](https://planetscale.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Deployment**: [Vercel](https://vercel.com), [Fly](https://fly.io)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), [Chakra UI](https://chakra-ui.com)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Running Locally

Create a `.env` file similar to [`.env.example`](https://github.com/Keshav13142/Student-community/blob/main/.env.example).

```bash
git clone git@github.com:Keshav13142/Student-community.git
cd Student-community
npm install
npx prisma db push && npx prisma db generate
npm run dev
```

> You need to run this [socket server](https://github.com/Keshav13142/student_comm_socket_server), for real-time messaging to work

Create a `.env` file similar to [`.env.example`](https://github.com/Keshav13142/Student-community/blob/main/.env.example).

## TODO

- [x] ~~Functional Chat messages UI~~
- [x] ~~Delete/Hide messages~~
- [x] ~~Don't send message content if they're hidden (in requests)~~
- [x] ~~Add requests feature to join institution~~
- [x] ~~User onDelete cascade~~
- [x] ~~User profile with their posts and restr. and pvt comms~~
- [x] ~~Fix the community members modal code~~
- [x] ~~Posts/Blog articles with comments~~
- [x] ~~Check if user has admin/mod access in API before performing actions~~
- [x] ~~User settings option in navbar dropdown~~
- [x] ~~Responsiveness of sidebar~~
- [x] ~~Fix tabindex in nav links~~
- [x] ~~Fix sidebar issue in blog and profile page (and add nav links in mobile-nav)~~
- [x] ~~Fix scrollbar height in chat page~~
- [x] ~~Fix modal styling in smaller screens~~
- [x] ~~Fix socket connection in production~~ (hosted socket server on [fly.io](https://fly.io))
- [x] ~~Make error boundary UI look good~~
- [x] ~~Query filter params in blog page (AI&ML not working , probably cause of `&` symbol?)~~
- [x] ~~Add dark theme support~~
- [x] ~~Add relavent meta tags to pages~~
- [x] ~~Make public communities joinable~~
- [x] ~~Fix routing after profile creation~~
- [x] ~~Make codeType as a separate entity~~
- [ ] Fix auto scroll on new messages in chat.
- [ ] Leave communities, and institution
- [ ] Reset institution codes (by admins)
- [ ] Use react hook form in blog create/edit page
- [ ] Chat infinite scroll.
- [ ] Blog page pagination.
- [ ] Fix dark mode images
- [ ] Handle socket connections more efficiently.
- [ ] Socket events for deletion
- [ ] Notifications on new messages or events.
- [ ] Community visibilty for each year and dept.
- [ ] Verify clg mail (get dept and year from mail).
- [ ] Truthful data for student year and dept (probably from their clg email).
- [ ] Admins can view all students, filter by dept and year.
- [ ] Update students year(1,2,3 or 4) every year (Batch edit by admins/figure out how to do it automagically)
- [ ] User pending request screen
- [ ] automagically figure of code type while new-user registration
- [ ] HOC for protected API routes, managing req types.
- [ ] Prisma transactions
- [ ] Switch to ui.shadcn.com(better accessibility and lighter) or mantine(seems more plug and play) from chakra UI
- [ ] Guest user login (have a default community)
- [ ] Customize UI for clg
- [ ] Show user info on hover in chat?
- [ ] Pending req for users joining pvt.communities (idk if this is needed)

<!-- ![mock](final-year-project-mock.png) -->
