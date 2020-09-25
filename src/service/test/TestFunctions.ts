import test from "../../models/test/test.model";
import submitter from "../../models/test/submitter.model";
export default class TestFunctions {
  createTest(test_id: string, user_id: string, testName: string) {
    const rejectMessage = "Could not create Test";
    return new Promise((resolve, reject) => {
      const testObject = {
        _id: test_id,
        createdBy: user_id,
        testName: testName,
        questions: {},
      };

      const submissionObject = {
        userID: user_id,
        quizID: test_id,
        submission_type: "answer",
        submission: {},
      };
      new test(testObject)
        .save()
        .then((result) => {
          new submitter(submissionObject)
            .save()
            .then((sub_result) => {
              resolve(result);
            })
            .catch((err) => {
              reject({ message: rejectMessage, error: err });
            });
        })
        .catch((err) => {
          reject({ message: rejectMessage, error: err });
        });
    });
  }

  async saveTest(testData: any, userData: any) {
    await this.saveAnswer(testData, userData);
    await this.saveQuestion(testData, userData);
  }
  async saveQuestion(testData: any, userData: any) {
    let _id = testData._id;

    let result = await test.findByIdAndUpdate(_id, {
      ...testData,
    });
  }

  async saveAnswer(testData: any, userData: any) {
    const userID = userData._id;
    const quizID = testData._id;
    let query = {
      userID,
      quizID,
    };
    let answers: any = testData.answers;
    delete testData.answers;
    let submitterObj = { ...query, answers };
    let isPresent = await submitter.findOneAndUpdate(query, submitterObj, {
      new: true,
    });
    if (!isPresent) {
      await new submitter(submitterObj).save();
    }
  }

  getTests(user_id: string) {
    return new Promise(async (resolve, reject) => {
      let returnData: any = {};
      try {
        const results = await submitter.find({ userID: user_id });
        let submissionData: any;
        for (submissionData of results) {
          const testID = submissionData.quizID;
          const testData = await test.findById({ _id: testID });
          if (testData) {
            let testObject = testData?.toJSON();
            testObject.answers = submissionData.answers;
            returnData[testObject._id] = testObject;
          }
        }
        resolve(returnData);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteTest(test_id: string) {
    const rejectMessage = "Could not create Test";
    return new Promise(async (resolve, reject) => {
      try {
        await test.findByIdAndDelete({ _id: test_id });
        await submitter.deleteMany({ quizID: test_id });
        resolve();
      } catch (error) {
        reject({ message: rejectMessage, error: error });
      }
    });
  }
}
