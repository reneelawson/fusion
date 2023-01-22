// import { Sequelize, Op, Model, DataTypes } from "sequelize";
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

const dotenv = require("dotenv");
dotenv.config()

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const password = process.env.DATABASE_PASSWORD;

const sequelize =  new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    logging: false,
    ssl: true
})

class UserMetadata extends Model { }

UserMetadata.init(
    {
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userGuid: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true
        },
        magicLinkAuthToken: {
            type: DataTypes.TEXT,
        },
        neurosityToken: {
            type: DataTypes.TEXT,
        },
        magicflowToken: {
            type: DataTypes.TEXT,
        },
        magicflowLastFetched: {
            type: DataTypes.DATE,
        },
        userLastSeen: {
            type: DataTypes.DATE,
        },
        userConsentUsage: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, { sequelize, modelName: "userMetadata" });

module.exports = {
    UserMetadata: UserMetadata,
    sequelize: sequelize
}