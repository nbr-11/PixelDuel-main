import { ZodError } from "zod";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import { mimes } from "./config/filesMIME.js";

export const formatError = (issues: ZodError) => {

    let errors: any = {};

    issues.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message
    })

    return errors;
}

export const renderEmailEjs = async (filename: string, payload: any): Promise<string> => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const html: string = await ejs.renderFile(__dirname + `/views/emails/${filename}.ejs`, payload);
    return html;
}

export const checkDateDiff = (date: Date | string): number => {

    const now = moment();
    const tokenSendAt = moment(date);
    const diffMoment = moment.duration(now.diff(tokenSendAt));
    return diffMoment.asHours();
}


export const imageValidator = (size: number, mime: string): string | null => {

    if (bytesToMB(size) > 2) {
        return "Image size must be less than 2 MB"
    } else if (!mimes.includes(mime)) {
        return "File type not supported, Image mnust be of type png, jpg, jpeg, gif, webp"
    }

    return null;
}

export const bytesToMB = (size: number): number => {
    return (size) / (1024 * 1024);
}

export const getPublicID = (url: string): string => {
    const size = url.split("/").length;
    const publicId = url.split("/")[size - 1].split(".")[0];
    return publicId;
}

// export const uploadFile = async (image: UploadedFile) => {
//     const imageExt = image?.name.split(".");
//     const imageName = uuid4() + "." + imageExt[1];
//     const uploadPath = process.cwd() + "/public/images/" + imageName;
//     image.mv(uploadPath, (error) => {
//         if (error) throw error;
//     });

//     return imageName;
// }

