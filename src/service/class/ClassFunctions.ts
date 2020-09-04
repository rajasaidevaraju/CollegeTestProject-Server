import classModel from "./../../models/class/class.model";
class ClassFunctions {
  getClasses() {
    return new Promise(async (resolve, reject) => {
      let result = await classModel.find();
      resolve(result);
    });
  }
  deleteClass(classId: string) {
    return new Promise(async (resolve, reject) => {
      await classModel.findByIdAndDelete(classId);
      resolve();
    });
  }
  createClass(className: string) {
    return new Promise(async (resolve, reject) => {
      let doc = await classModel.find({ className });

      if (doc.length > 0) {
        reject({ message: "className already present" });
        return;
      }
      let classDocument = await new classModel({ className }).save();
      if (classDocument) {
        resolve(classDocument);
        return;
      }
      reject({ message: "unable to create class" });
    });
  }
}

export default ClassFunctions;
