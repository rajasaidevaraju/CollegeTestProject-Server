import { exec } from "child_process";
import escape from "shell-escape";
import mkdirp from "mkdirp";
import path from "path";

export function makeImages(
  input: string,
  image_dir: string,
  rate: number = 0.01
) {
  return new Promise((resolve, reject) => {
    mkdirp(image_dir)
      .then(() => {
        let scale: string = "300:-1";
        let image_file_nanmes: string = image_dir + "/%04d.png";
        let cmd: string[] = ["ffmpeg"];
        cmd.push("-i", input);
        cmd.push("-filter:v", "scale=" + scale);
        cmd.push("-r", String(rate));
        cmd.push(image_file_nanmes);
        let stringCmd: string = escape(cmd);
        stringCmd = stringCmd.replace(/'/g, "");
        exec(stringCmd, function (err: any) {
          if (err) reject(err);
          resolve("images created at " + image_dir + "\n");
        });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
export function makeGIF(
  image_dir: string,
  outputFilePath: string,
  delay: number = 20
) {
  return new Promise((resolve, reject) => {
    mkdirp(process.env.GIF_PATH!)
      .then(() => {
        let cmd: string[] = ["gm", "convert"];
        cmd.push("-delay", String(delay || 0));
        cmd.push("-loop", "0");
        image_dir = path.join(image_dir, "*.png");
        cmd.push(image_dir);
        cmd.push(outputFilePath);
        let stringCmd: string = escape(cmd);
        stringCmd = stringCmd.replace(/'/g, "");
        exec(stringCmd, function (err: any) {
          if (err) reject(err);
          resolve("GIF created at " + outputFilePath + "\n");
        });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
