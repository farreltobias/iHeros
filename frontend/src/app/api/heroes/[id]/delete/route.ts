export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug // 'a', 'b', or 'c'

  if (slug === 'a') {
    return Response.json({ res: 'ok' })
  }
}
