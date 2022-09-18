import fs from 'fs'  
import https from 'https'
import path from 'path'

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */

export async function downloadFile (url, _targetFile, targetFolder) { 
  return await new Promise((resolve, reject) => {
    const targetFile = (_targetFile+"").replace(/\//g, "-");
    https.get(url, response => {
      const code = response.statusCode ?? 0
      if (code >= 400) {
        return reject(new Error(response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return downloadFile(response.headers.location, targetFile, targetFolder)
      }
      // save the file to disk
      const fileWriter = fs
        .createWriteStream(path.join(targetFolder, targetFile))
        .on('finish', () => {
          resolve({})
        })

      response.pipe(fileWriter)
    }).on('error', error => {
      console.log("download failed",url)
      reject(error)
    })
  })
}