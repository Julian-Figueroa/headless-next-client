import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Post({ slug }) {
  const { data, error } = useSWR(`/api/post/${slug} `, fetcher);

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
          <h1>{data.post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.post.content }}></div>
        </main>
      </div>
    )
  );
}

export async function getStaticProps({ params }) {
  return {
    props: {
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  const QUERY_ALL_POSTS = `
    query allPosts {
      posts {
        edges {
          node {
            slug
          }
        }
      }
    }
  `;
  const headers = { 'Content-Type': 'application/json' };
  const allPosts = await fetch(process.env.WORDPRESS_LOCAL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: QUERY_ALL_POSTS,
    }),
  });

  const {
    data: {
      posts: { edges },
    },
  } = await allPosts.json();

  const paths = edges.map(({ node }) => `/post/${node.slug}`) || [];

  return {
    paths,
    fallback: true,
  };
}
