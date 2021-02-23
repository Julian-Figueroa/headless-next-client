export default async (req, res) => {
  const {
    query: { slug },
  } = req;

  const QUERY_RECENT_POSTS = `
    query RecentPosts {
      posts(first: 5, where: { orderby: { field: DATE, order: DESC }}) {
        edges {
          node {
            excerpt
            slug
            title
          }
        }
      }
    }
  `;

  const headers = { 'Content-Type': 'application/json' };

  const data = await fetch(process.env.WORDPRESS_LOCAL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: QUERY_RECENT_POSTS,
    }),
  });

  const result = await data.json();

  res.status(200).json(result.data);
};
