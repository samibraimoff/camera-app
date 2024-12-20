import path from "path"
export const videoExtensions = [".m4v", ".mov", ".mp4"];
export type MediaType = "video" | "image";

export const getMediaType = (uri: string) => {
    return videoExtensions.includes(path.extname(uri)) ? "video" : "image"
}