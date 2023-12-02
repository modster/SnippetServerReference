/* Run this file with: */
// deno run - A--unstable server.ts

/* Test it with curl: */
// curl--header "Content-Type: application/json" \
// --request POST \
// --data '{"url":"https://docs.deno.com/runtime/manual","slug":"denodocs"}' \
// http://localhost:8000/

/* IMPORTANT: */
// Remember to have fun! :)

const kv = await Deno.openKv()

Deno.serve(async (request: Request) => {
  // Create short links
  if (request.method == "POST") {
    const body = await request.text()
    const { slug, url } = JSON.parse(body)
    const result = await kv.set(["links", slug], url)
    return new Response(JSON.stringify(result))
  }

  // Redirect short links
  const slug = request.url.split("/").pop() || ""
  const url = (await kv.get(["links", slug])).value as string
  if (url) {
    return Response.redirect(url, 301)
  } else {
    const m = !slug ? "Please provide a slug." : `Slug "${slug}" not found`
    return new Response(m, { status: 404 })
  }
})
