import {Sequelize} from 'sequelize'


// tao object sequelize to connect on database
const sequelize = new Sequelize(
    "app_pinterest",
    "root",// user name
    '123456', //password
    {
        host: "localhost",
        port: 3307,
        dialect: "mysql"
    }
);

export default sequelize;