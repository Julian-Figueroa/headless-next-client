import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const { data: dataHome, error: errorHome } = useSWR('/api/page/sample-page', fetcher);
  const { data: dataPost, error: errorPost } = useSWR('/api/post/recent', fetcher);

  console.log('dataPost: ', dataPost);

  if (!dataHome) {
    return <p>loading...</p>;
  }
  if (errorHome) {
    return <div>error {error}</div>;
  }
  return (
    <div>
      <Head>
        <title>Next + Wordpress</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={'http://headlessnext.local/wp-includes/css/dist/block-library/style.min.css'} />
      </Head>

      <main>
        <h1>{dataHome.page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: dataHome.page.content }}></div>
        <hr />
        <h2>Recent Posts</h2>
        {dataPost &&
          dataPost.posts.edges.map(({ node }) => (
            <div key={node.slug}>
              <h3>{node.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: node.excerpt }}></div>
              <Link href={`post/${node.slug}`}>
                <a>Read more</a>
              </Link>
            </div>
          ))}
      </main>
    </div>
  );
}
