import test from "../../models/test/test.model";
import submitter from "../../models/test/submitter.model";
export default class TestFunctions {
  createTest(test_id: string, user_id: string, testName: string) {
    const rejectMessage = "Could not create Test";
    return new Promise((resolve, reject) => {
      const testObject = {
        _id: test_id,
        createdBy: user_id,
        testData: {
          testName: testName,
          questions: {},
        },
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
    delete testData._id;

    let result = await test.findOneAndUpdate(_id, {
      testData: { ...testData },
    });
  }

  async saveAnswer(testData: any, userData: any) {
    const userID = userData._id;
    const quizID = testData._id;
    let query = {
      userID,
      quizID,
    };
    let answers: any = {};
    const questions = testData.questions;

    for (let question of Object.keys(questions)) {
      answers[question] = questions[question].answers;
      delete questions[question].answers;
    }
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
          let mergedData: any = await this.mergeTest(submissionData, testData);

          returnData[mergedData._id] = mergedData;
        }
        resolve(returnData);
      } catch (error) {
        reject(error);
      }
    });
  }

  mergeTest(submissionData: any, testData: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let reurnValue: any = {};

        const answers = submissionData.answers;
        const questions = testData.testData.questions;
        if (questions) {
          for (let question_id of Object.keys(questions)) {
            if (answers && answers[question_id]) {
              questions[question_id].answers = answers[question_id];
            }
          }
        }
        resolve(testData);
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
