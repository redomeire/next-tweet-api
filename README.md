# About
The Next Tweet API offers a range of features, including user authentication and operations related to tweets, such as creating, retrieving, updating, and deleting.

## Install Locally
#### Clone this repository

```bash
git clone https://github.com/redomeire/next-tweet-api.git
```

#### Navigate to your project directory

```bash
cd next-tweet-api
```

#### Install

```bash
npm install
```

#### Copy environment variables

```bash
cp .env.example .env
```

#### Copy environment variables

```bash
cp .env.example .env
```

adjust your env value. 

```bash
POSTGRES_PRISMA_URL=postgres://{{ username }}:{{ password }}@{{ dbHost }}:5432/{{ dbName }}
```

#### Run prisma migration

```bash 
npx prisma generate
```

```bash 
npx prisma db push
```
#### Start your local server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## API Documentation
Postman 👇 
[https://documenter.getpostman.com/view/19050804/2s9Yyv9ejr](https://documenter.getpostman.com/view/19050804/2s9Yyv9ejr)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
