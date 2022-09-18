import * as path from "path";
import https from "https";
import { downloadFile } from "./lib.js";

const host = "https://est01.varcdn.top/m3/tracks-v1a1";
const streamUrl = `${host}/mono.m3u8`;
const downloadedChunks = [];


setInterval(() => {
  https.get(streamUrl, (stream) => {
    const filesToDownload = [];
    stream.on("data",  (chunk) => {
      const chunkContent = chunk.toString("utf8") + "";
      const chunkVideosRegex = /\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/[-\d]+.ts/g;
      const videos = chunkContent.match(chunkVideosRegex).filter(newVideo => !downloadedChunks.includes(newVideo));
      downloadedChunks.push(...videos);
      filesToDownload.push(...videos.map( video => downloadFile(`${host}/${video}`, video, path.join(path.resolve(), "videos"))));
    });
    
    stream.on("end", async () => {
      console.log("start to download");
      await Promise.all(filesToDownload);
      console.log("ended")
    });
  }); 
}, 10000);


