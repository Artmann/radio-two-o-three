import { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {

  const content = `User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: https://two-o-three.com/sitemap.xml
  `

  return new Response(content,{
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
