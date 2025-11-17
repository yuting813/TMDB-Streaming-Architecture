import Head from 'next/head';
import Header from '@/components/Header';
import Row from '@/components/Row';
import Modal from '@/components/Modal';
import requests from '@/utils/request';

interface Props {
  topRated: any[];
  action: any[];
  comedy: any[];
}

export default function MoviesPage({ topRated, action, comedy }: Props) {
  return (
    <div>
      <Head>
        <title>Movies</title>
      </Head>
      <Header />
      <main className="pt-24 px-4 m-10">
        <h1 className="mb-12 text-3xl font-bold">Movies</h1>
        <section className="space-y-8">
          <Row title="Top Rated" movies={topRated} orientation="poster" />
          <Row title="Action Movies" movies={action} orientation="poster" />
          <Row title="Comedies" movies={comedy} orientation="poster" />
        </section>
      </main>
      <Modal />
    </div>
  );
}

export async function getStaticProps() {
  try {
    const [topRatedRes, actionRes, comedyRes] = await Promise.all([
      fetch(requests.fetchTopRated).then((r) => r.json()),
      fetch(requests.fetchActionMovies).then((r) => r.json()),
      fetch(requests.fetchComedyMovies).then((r) => r.json()),
    ]);

    return {
      props: {
        topRated: topRatedRes.results || [],
        action: actionRes.results || [],
        comedy: comedyRes.results || [],
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching movie data', error);
    return { props: { topRated: [], action: [], comedy: [] }, revalidate: 60 };
  }
}
