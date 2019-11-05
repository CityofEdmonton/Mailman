import React from 'react'
import { Link } from 'react-router-dom'
import { getHashParams, getHashUrl } from '../util/QueryParam'

const MailmanLink = props => {
  let params = getHashParams(window.location.href)
  let fullUrl = `${window.location.href.split('#')[0]}#${props.to}`
  let toParams = getHashParams(fullUrl)

  if (params['ssid']) {
    toParams['ssid'] = params['ssid']
  }
  let urlAndParams = getHashUrl(fullUrl, toParams)
  return <Link {...props} to={urlAndParams} />
}

MailmanLink.propTypes = Link.propTypes

export default MailmanLink
