import { getOAuthToken } from '../util/OAuthUtil'

export function deleteMergeTemplate(templateId) {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      MergeTemplateId: templateId,
    }),
  }
  getOAuthToken().then(accessToken => {
    config.headers.accessToken = accessToken
    return fetch(
      `https://localhost:5001/api/MergeTemplates/Email`,
      config
    ).then(response => {
      window.location.reload()
      return response.json()
    })
  })
}
