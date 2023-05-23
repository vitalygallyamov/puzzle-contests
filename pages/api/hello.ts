// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {id: string; name: string; shortcode: string; precision: number;}[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const assetsRes = await axios.get<Data>('https://wavescap.com/api/assets.json')
  const clear = assetsRes.data.map(({id, name, shortcode, precision}) => {
    return {id, name, shortcode, precision};
  });
  res.status(200).json(clear)
}
