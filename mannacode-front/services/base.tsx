import getConfig from 'next/config'
import fetch from 'isomorphic-unfetch'

// eslint-disable-next-line
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {}
const baseURL = process.env.baseUrl

interface CustomFetchReposponse {
  ok: boolean,
  data: any,
}

interface Headers {
  'Content-Type': string,
  'Authorization': string
}

const customFetch = async (endpoint, options): Promise<CustomFetchReposponse> => {
  const headers = {
    'Content-Type': 'application/json',
  } as Headers;

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      ...options,
      headers
    })

    if (response.ok) {
      return {
        ok: true,
        data: await response.json()
      }
    }
    return {
      ok: false,
      data: await response.json()
    }
  } catch (e) {
    return {
      ok: false,
      data: {
        message: 'Ocoreu algum problema com servidor contate Administrador'
      }
    }
  }
}

export const post = (endpoint, data, token) =>
  customFetch(endpoint, {
    token,
    method: 'POST',
    body: JSON.stringify(data)
  });

export const get = (endpoint, token) =>
  customFetch(endpoint, {
    token,
    method: 'GET',
  });

export const remove = (endpoint, token) =>
  customFetch(endpoint, {
    token,
    method: 'DELETE',
  });

export const patch = (endpoint, data, token) =>
  customFetch(endpoint, {
    token,
    method: 'PATCH',
    body: JSON.stringify(data)
  })
