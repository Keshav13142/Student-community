import Head from 'next/head';


export default function Home() {
  return (
    <>
      <Head>
        <title>Student community</title>
        <meta name="description" content="Platform for students within institutions to interact" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='text-green-600'>
        <h1 className='text-4xl font-bold'>Hello world</h1>
      </main>
    </>
  )
}
