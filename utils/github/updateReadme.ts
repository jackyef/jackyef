import fetch from 'node-fetch';

const ghRepoOwner = 'jackyef'
const ghRepoName = 'jackyef'
const ghToken = process.env['GH_TOKEN'] || '';

const baseHeaders = {
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  Authorization: `token ${ghToken}`,
  'User-Agent': 'jackyef-gh-readme',
};

// use GET to get content
// https://developer.github.com/v3/repos/contents/#get-repository-content 
// use PUT to update content
// https://developer.github.com/v3/repos/contents/#create-or-update-file-contents
const ghContentEndpoint = `https://api.github.com/repos/${ghRepoOwner}/${ghRepoName}/contents/:path`;

export const updateReadme = async (type: string) => {
  const originalReadmeResponse = await fetch(
    ghContentEndpoint.replace(':path', 'README.md'),
    {
      headers: baseHeaders
    },
  );
  const originalReadmeContentJson = (await originalReadmeResponse.json());
  const originalReadmeContentString = Buffer.from(originalReadmeContentJson.content, 'base64').toString('utf-8');

  const stringToFind = `<span id="count-${type}">`;
  const startIndex = originalReadmeContentString.indexOf(stringToFind) + stringToFind.length;
  const endIndex = originalReadmeContentString.indexOf(`</span>`, startIndex);
  
  const prevCount = Number(originalReadmeContentString.substring(startIndex, endIndex)) || 0;

  const newReadmeContentString = `${originalReadmeContentString.substring(0, startIndex)}${prevCount + 1}${originalReadmeContentString.substring(endIndex)}`;

  const response = await fetch(
    ghContentEndpoint.replace(':path', 'README.md'),
    {
      method: 'PUT',
      headers: baseHeaders,
      body: JSON.stringify({
        message: `chore: Add ${type} count`,
        content: Buffer.from(newReadmeContentString, 'utf-8').toString('base64'),
        sha: originalReadmeContentJson.sha,
      }),
    },
  );

  // @ts-expect-error
  const _json = await response.json();
  
  return;
}