// Convert an uploaded image File into a base64 string (no "data:" prefix),
// downscaling to keep webhook payloads small and fast. Returns '' on failure
// so callers can still fall back to mock data.
export async function imageFileToBase64(file, maxDim = 1024, quality = 0.8) {
  try {
    const dataUrl = await readAsDataURL(file)
    const img = await loadImage(dataUrl)
    let { width, height } = img
    const scale = Math.min(1, maxDim / Math.max(width, height))
    width = Math.round(width * scale)
    height = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(img, 0, 0, width, height)
    const out = canvas.toDataURL('image/jpeg', quality)
    return out.split(',')[1] || ''
  } catch {
    return ''
  }
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
