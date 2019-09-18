import { getOAuthToken } from '../util/OAuthUtil'

export function runMergeTemplate(templateId) {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      MergeTemplateId: templateId,
    }),
  }
  getOAuthToken().then(accessToken => {
    config.headers.accessToken = accessToken
    return fetch(`https://localhost:5001/api/MergeTemplates/run`, config).then(
      response => {
        return response.json()
      }
    )
  })
}
