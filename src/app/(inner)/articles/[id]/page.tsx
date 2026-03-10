export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function ArticleDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [postRes, commentsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  ]);

  const post = await postRes.json();
  const comments = await commentsRes.json();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-blue-900 capitalize mb-4">{post.title}</h1>
      <p className="text-lg text-gray-700 mb-8">{post.body}</p>

      <hr className="my-6 text-gray-200" />
      
      <h2 className="text-xl font-semibold mb-4 text-green-700">💬 Відгуки читачів (Книга #{id}):</h2>
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-3 bg-gray-50 rounded border">
            <p className="font-bold text-sm text-gray-500">{comment.email}</p>
            <p className="mt-1">{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}