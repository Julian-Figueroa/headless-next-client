export default async (req, res) => {
  const {
    query: { slug },
  } = req;
  const uri = slug.join('/');

  const QUERY_SINGLE_PAGE = `
    query SinglePage($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
      }
    }
  `;

  const headers = { 'Content-Type': 'application/json' };

  const data = await fetch(process.env.WORDPRESS_LOCAL_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: QUERY_SINGLE_PAGE,
      variables: {
        id: uri,
      },
    }),
  });

  const result = await data.json();

  res.status(200).json(result.data);
};
