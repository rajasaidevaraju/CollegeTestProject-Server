import fileModel from "./file.model";
import { CreateQuery } from "mongoose";
import { FileData } from "../../service/Files/FileData";

export function getListOfFilesInDB() {
  return new Promise((resolve, reject) => {
    fileModel
      .find()
      .then((data) => {
        resolve(data);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

export function addFileToDatabase(data: FileData) {
  return fileModel
    .create(data)
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}
