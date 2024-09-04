import { cleanEnv, port, str } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DEFAULT_LANG: str({ choices: ['pt-BR', 'en-US'] })
  });
};

export default validateEnv;
