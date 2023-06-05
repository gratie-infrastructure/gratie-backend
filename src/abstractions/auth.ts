// import {GameAuth, GameAuthParams} from 'auth';

// const mongoUrl:string = process.env.DB_URL;
// const dbName:string = process.env.DB_NAME;

// const options:GameAuthParams = {
//   mongoUrl,
//   mongoOptions: {dbName},
// };

const game = {
  loginWithOTP: (options:Record<string, string>) => {
    return options;
  },
  signUpWithOTP: (options:Record<string, string>) => {
    return options;
  },
  getUserByToken: (options:string) => {
    return options;
  },

};

export default game;

export function init() {
  return game;
}
