import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  name: Yup.string().required("Required"),

  country: Yup.string().required("Required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Contact number must contain only numbers")
    .required("Required"),
});

const OptionSchema = Yup.object().shape({
  option_text: Yup.string().required("Option text is required"),
});

const QuestionSchema = Yup.object().shape({
  question_desc: Yup.string().required("Question description is required"),
  question_type: Yup.string()
    .oneOf(["MCQ", "Text Based", "True Or False"], "Invalid question type")
    .required("Question type is required"),
  question_point: Yup.number()
    .positive("Marks must be a positive number")
    .required("Marks of question is required"),
  number_of_options: Yup.number().min(
    0,
    "Number of options should be non-negative"
  ),
  answer_text: Yup.string().required("Correct answer is required"),
  options: Yup.array().of(OptionSchema),
});

const AssessmentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const AnswerSchema = Yup.object().shape({
  question: Yup.string().required("Question id is required"),
  answer_text: Yup.string().required("Answer is Required"),
});

const ScheduleInterviewSchema = Yup.object().shape({
  job_id: Yup.string().required("Select any Job"),
  candidate_id: Yup.number().required("Candidate  is required"),
  start_time: Yup.string().required("Start time is required"),
  end_time: Yup.string().required("End time is required"),
  interview_date: Yup.string().required("Interview date is required"),
  message: Yup.string(),
});

export {
  LoginSchema,
  SignUpSchema,
  QuestionSchema,
  AssessmentSchema,
  AnswerSchema,
  ScheduleInterviewSchema,
};
