import { NowRequest, NowResponse } from '@now/node';

export default (_req: NowRequest, res: NowResponse) => {
  res.status(200).json({ name: 'Hello world' });
}
