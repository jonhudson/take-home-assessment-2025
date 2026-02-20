import { DataTypes, Sequelize } from "sequelize";
import pg from "pg";

let sequelize: Sequelize;

const initSequelize = () => {
  sequelize = new Sequelize({
    dialect: "postgres",
    dialectModule: pg,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
};

export const getVoterRegistrationDeadline = () => {
  if (!sequelize) {
    initSequelize();
  }

  const VoterRegistrationDeadline = sequelize.define(
    "VoterRegistrationDeadline",
    {
      State: { type: DataTypes.STRING, primaryKey: true },
      DeadlineInPerson: DataTypes.STRING,
      DeadlineByMail: DataTypes.STRING,
      DeadlineOnline: DataTypes.STRING,
      ElectionDayRegistration: DataTypes.STRING,
      OnlineRegistrationLink: DataTypes.STRING,
      Description: DataTypes.STRING,
    },
    {
      tableName: "voter_registration_deadlines",
      timestamps: false,
    },
  );
  return VoterRegistrationDeadline;
}
