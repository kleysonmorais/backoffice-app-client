const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "backoffice-app-2-total-dev-attachmentsbucket-1wuygx9worcbq",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://e2g73fzd4f.execute-api.us-east-1.amazonaws.com/dev",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_EKp0jYoEc",
    APP_CLIENT_ID: "27ts7plf7r08ufmg4bb2kj41r0",
    IDENTITY_POOL_ID: "us-east-1:f7427954-e1b3-42e7-915d-4486be0d8a72",
  },
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "backoffice-app-2-total-prod-attachmentsbucket-1n75ggwj81avo",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://mx5xezc9w5.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_BBcbHcgJV",
    APP_CLIENT_ID: "2njbqlq8b3p03e05gr5dkfqbq8",
    IDENTITY_POOL_ID: "us-east-1:7effaf79-9a17-471f-9535-0b8a9a6a0f87",
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
