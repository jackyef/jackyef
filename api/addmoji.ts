import { NowRequest, NowResponse } from '@now/node';
import { updateReadme } from '../utils/github/updateReadme';

const allowedEmojis: Record<string, boolean> = {
  '👋': true,
  '👍': true,
  '👊': true,
  '❤️': true,
  '😂': true,
  '🤓': true,
  '😎': true,
  '😛': true,
  '🙃': true,
  '👨‍💻': true,
};
export default async (req: NowRequest, res: NowResponse) => {
  const type = String(req.query.type);

  if (allowedEmojis[type]) {
    // update the readme.md in the repo, add count by 1
    try {
      await updateReadme(type);

      res.setHeader('Location', 'https://github.com/jackyef');
      res.status(302);
      res.json({ message: '↩️'})
    } catch (err) {
      res
        .status(500)
        .json({ message: '😱', error: err.message, stack: err.stack });
    }
  } else {
    res.status(403).json({ message: '😠' });
  }
};
