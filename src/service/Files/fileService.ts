const fs = require("fs");
const path = require("path");
import {
  getListOfFilesInDB,
  addFileToDatabase,
} from "../../models/files/files";
import { exec } from "child_process";
import { FileData } from "./FileData";
const base_path: string = process.env.BASE_PATH!;
const gif_path: string = process.env.GIF_PATH!;
const image_path: string = process.env.IMAGE_PATH!;

export function scanFiles(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let added = 0,
      found = 0,
      records = 0;
    const files_f = await getListOfFiles();
    const files_d: any = await getListOfFilesInDB();

    found = files_f.length;
    records = files_d.length;

    /*for (let i = 0; i < found; i++) {
      let f = files_f[i];
      if (f != null) {
        let filtered_res = files_d.filter(
          (f_d: any) => f_d.filePath == f.filePath
        );
        if (filtered_res.length == 0) {
          try {
            await addFileToDatabase(await getFileDetails(f, true, true));
            added++;
          } catch (error) {
            console.log(error.message + "for file " + f.fileName);
            reject(error);
          }
        }
      }
    }*/

    resolve(
      found +
        " files in fileSystem and " +
        records +
        " records in db and " +
        added +
        " records added"
    );
  });

  //convertFiles(listOfFiles);
}

function replaceSpaceIfPresent(fileName: string) {
  let newFileName;
  if (fileName.includes(" ") && fileName.includes(".mp4")) {
    newFileName = fileName.replace(/ /g, "");
  }
  let filePath: string = path.join(base_path + fileName);
  if (newFileName) {
    let newFilePath = path.join(base_path + newFileName);
    fs.renameSync(filePath, newFilePath);
    return { fileName: newFileName, filePath: newFilePath };
  }
  return { fileName: fileName, filePath };
}

async function getFileDetails(
  { fileName, filePath }: { fileName: string; filePath: string },
  res = false,
  len = false
) {
  if (fs.statSync(filePath).isFile()) {
    var stats = fs.statSync(filePath);
    var sizeInBytes = stats["size"];
    let return_obj: any = {
      fileName,
      filePath,
      sizeInBytes,
    };

    let cmd_len = process.env.CMD_LENGTH + " " + filePath;
    let cmd_res = process.env.CMD_RESOLUTION + " " + filePath;

    if (res) {
      const { output }: any = await console_execute(cmd_res);
      return_obj["resolution"] = JSON.parse(output).streams[0];
    }
    if (len) {
      const { output }: any = await console_execute(cmd_len);
      return_obj["duration"] = parseFloat(output) / 60;
    }

    return return_obj;
  } else {
    return null;
  }
}

async function getListOfFiles() {
  let currentDirectory: string = fs.readdirSync(base_path, "utf8");
  let filesCollection: FileData[] = [];

  for (let i = 0; i < currentDirectory.length; i++) {
    if (currentDirectory[i].includes("mp4")) {
      const { fileName, filePath } = replaceSpaceIfPresent(currentDirectory[i]);
      let data = new FileData(fileName!, filePath);

      let fileObj = await getFileDetails(data);

      if (fileObj != null) {
        filesCollection.push(fileObj);
      }
    }
  }
  return filesCollection;
}

function console_execute(cmd: string) {
  return new Promise((res, rej) => {
    exec(cmd, (err, output, b) => {
      if (err) rej(err);
      res({ output });
    });
  });
}
