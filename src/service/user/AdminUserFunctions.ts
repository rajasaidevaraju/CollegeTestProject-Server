import userModel from "./../../models/users/users.model";
class AdminUserFunctions {
  getAllUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await userModel.find();
        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default AdminUserFunctions;
