import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page({ slug }) {
  const { data, error } = useSWR(`/api/page/${slug} `, fetcher);

  if (!data) {
    return <p>loading...</p>;
  }

  if (error) {
    return <div>error {error}</div>;
  }

  return (
    data && (
      <div>
        <Head>
          <title>Next + Wordpress</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1>{data.page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.page.content }}></div>
        </main>
      </div>
    )
  );
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/');
  return {
    props: {
      slug,
    },
  };
}

export async function getStaticPaths() {
  const QUERY_ALL_PAGES = `
    query allPages {
      pages {
        edges {
          node {
            uri
          }
        }
      }
    }
  `;
  const headers = { 'Content-Type': 'application/json' };
  const allPages = await fetch(process.env.WORDPRESS_LOCAL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: QUERY_ALL_PAGES,
    }),
  });

  const {
    data: {
      pages: { edges },
    },
  } = await allPages.json();

  const paths = edges.map(({ node }) => {
    const { uri } = node;
    return {
      params: {
        slug: uri.split('/').filter((i) => i),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}
