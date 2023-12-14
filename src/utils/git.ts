export const base64 = async (data: string) =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result)
    reader.onerror = () => rej(reader.error)

    reader.readAsDataURL(new Blob([data]))
  })

export const commit = async (message: string, path: string, data: string) => {
  const method = 'PUT'
  const baseURL = `https://api.github.com/repos/RayyanNafees/pb-admin/contents/${path}`
  const headers = {
    Authorization: `Bearer ${import.meta.env.PUBLIC_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({
    message,
    content: await base64(data),
  })

  return fetch(baseURL, { method, headers, body })
    .then((res) => res.json())
    .catch(console.error)
}



export default commit;